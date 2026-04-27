import { ref, reactive } from 'vue'
import { fetchLogs } from '@/modules/admin/services/logService'
import type { UserLog, UserLogFilters, LogLevel } from '@/types'

// Estado reactivo compartido del composable
const logs = ref<UserLog[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

const filters = reactive<UserLogFilters>({
  search: '',
  level: '',
  module: '',
  from: '',
  to: '',
  page: 1,
  pageSize: 10,
})

// Carga los logs aplicando los filtros actuales
const loadLogs = async (): Promise<void> => {
  error.value = null
  loading.value = true
  try {
    const result = await fetchLogs({ ...filters })
    logs.value = result.data
    total.value = result.total
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error inesperado'
  } finally {
    loading.value = false
  }
}

// Aplica los filtros y vuelve a la primera página
const applyFilters = (): void => {
  filters.page = 1
  loadLogs()
}

// Navega a una página concreta
const goToPage = (page: number): void => {
  filters.page = page
  loadLogs()
}

// Número total de páginas según el tamaño de página actual
const totalPages = (): number => Math.ceil(total.value / (filters.pageSize ?? 10))

export const useLogs = () => ({
  logs,
  total,
  loading,
  error,
  filters,
  loadLogs,
  applyFilters,
  goToPage,
  totalPages,
})
