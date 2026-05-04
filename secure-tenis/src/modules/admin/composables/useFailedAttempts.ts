import { ref, reactive, computed } from 'vue'
import { fetchLogs } from '@/modules/admin/services/logService'
import type { UserLog, UserLogFilters } from '@/types'

// Estado reactivo de los intentos fallidos de autenticación
const attempts = ref<UserLog[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

const filters = reactive<UserLogFilters>({
  search: '',
  level: 'ERROR',
  module: 'Auth',
  from: '',
  to: '',
  page: 1,
  pageSize: 5,
})

// Carga los intentos fallidos aplicando los filtros actuales
const loadAttempts = async (): Promise<void> => {
  error.value = null
  loading.value = true
  try {
    const result = await fetchLogs({ ...filters })
    attempts.value = result.data
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
  loadAttempts()
}

// Navega a una página concreta
const goToPage = (page: number): void => {
  filters.page = page
  loadAttempts()
}

// Número total de páginas
const totalPages = (): number => Math.ceil(total.value / (filters.pageSize ?? 5))

// Páginas visibles en el paginador (máximo 5 alrededor de la actual)
const visiblePages = computed(() => {
  const current = filters.page ?? 1
  const max = totalPages()
  const pages: number[] = []
  const start = Math.max(1, current - 2)
  const end = Math.min(max, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

export const useFailedAttempts = () => ({
  attempts,
  total,
  loading,
  error,
  filters,
  loadAttempts,
  applyFilters,
  goToPage,
  totalPages,
  visiblePages,
})
