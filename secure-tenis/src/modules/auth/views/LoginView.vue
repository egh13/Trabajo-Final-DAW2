<template>
  <div class="auth-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4" data-aos="fade-up">

          <div class="text-center mb-4">
            <i class="bi bi-shield-lock-fill auth-brand-icon"></i>
            <p class="text-white fw-bold fs-4 mb-0 mt-2">
              <span class="text-accent">Secure</span> Tenis
            </p>
          </div>

          <div class="auth-card">
            <h3 class="fw-bold text-white text-center mb-1">Iniciar Sesión</h3>
            <p class="auth-subtitle text-center mb-4">Bienvenido de nuevo</p>

            <div v-if="authStore.error" class="alert alert-danger border-0 py-2 small">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ authStore.error }}
            </div>

            <form @submit.prevent="handleLogin" novalidate>
              <div class="mb-3">
                <label for="email" class="auth-label">Email</label>
                <div class="input-group has-validation">
                  <span class="input-group-text auth-addon"><i class="bi bi-envelope"></i></span>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-control auth-input" :class="{ 'is-invalid': submitted && !emailValid }"
                    placeholder="tu@email.com"
                    autocomplete="email"
                  />
                  <div class="invalid-feedback">
                    {{ !form.email ? 'El email es obligatorio.' : 'Introduce un email válido.' }}
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label for="password" class="auth-label">Contraseña</label>
                <div class="input-group has-validation">
                  <span class="input-group-text auth-addon"><i class="bi bi-lock"></i></span>
                  <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="form-control auth-input"
                    :class="{ 'is-invalid': submitted && !form.password }"
                    placeholder="Tu contraseña"
                    autocomplete="current-password"
                  />
                  <div class="invalid-feedback">La contraseña es obligatoria.</div>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-accent w-100 mb-3"
                :disabled="authStore.loading"
              >
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                Entrar
              </button>
            </form>

            <p class="text-center small mb-0 auth-footer">
              ¿No tienes cuenta?
              <router-link to="/register" class="text-accent fw-semibold">Regístrate</router-link>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { LoginPayload } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive<LoginPayload>({
  email: '',
  password: '',
})

const submitted = ref(false)

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))

const handleLogin = async () => {
  submitted.value = true
  if (!emailValid.value || !form.password) return

  try {
    await authStore.login(form)
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? '/')
  } catch {
    // El error ya se muestra desde el store
  }
}

// Limpia errores residuales de otras vistas al entrar en login
onMounted(() => { authStore.error = null })
</script>

