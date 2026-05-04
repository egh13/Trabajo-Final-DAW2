import { ref } from 'vue'
import { fetchAuthStats } from '@/modules/admin/services/logService'
import type { AuthStats } from '@/types'

export function useAuthStats() {
  const stats = ref<AuthStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Carga las estadísticas de autenticación desde la API
  const load = async () => {
    loading.value = true
    error.value = null
    try {
      stats.value = await fetchAuthStats()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar estadísticas'
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, error, load }
}
