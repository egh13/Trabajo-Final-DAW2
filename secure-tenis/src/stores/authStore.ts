import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserRole, LoginPayload, RegisterPayload } from '@/types'
import { loginRequest, registerRequest, getMeRequest } from '@/modules/auth/services/authService'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed<UserRole | null>(() => user.value?.role ?? null)
  const userName = computed(() => user.value?.name ?? '')

  // Guarda token en localStorage y en el estado
  const setSession = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  // Limpia sesión
  const clearSession = () => {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  const login = async (data: LoginPayload) => {
    loading.value = true
    error.value = null
    try {
      const res = await loginRequest(data)
      if (res.data) {
        setSession(res.data.token, res.data.user)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al iniciar sesión'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterPayload) => {
    loading.value = true
    error.value = null
    try {
      const res = await registerRequest(data)
      if (res.data) {
        setSession(res.data.token, res.data.user)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al registrarse'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    clearSession()
  }

  // Recupera el usuario actual si hay token almacenado
  const fetchMe = async () => {
    if (!token.value) return
    loading.value = true
    try {
      const res = await getMeRequest()
      if (res.data) {
        user.value = res.data
      }
    } catch {
      // Token inválido o expirado: limpiar sesión
      clearSession()
    } finally {
      loading.value = false
    }
  }

  // Comprobación de rol
  const hasRole = (role: UserRole): boolean => user.value?.role === role
  const hasAnyRole = (...roles: UserRole[]): boolean => !!user.value && roles.includes(user.value.role)

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    userName,
    login,
    register,
    logout,
    fetchMe,
    hasRole,
    hasAnyRole,
  }
})
