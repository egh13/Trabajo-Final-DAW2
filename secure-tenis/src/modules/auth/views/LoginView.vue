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
                    class="form-control auth-input"
                    :class="{ 'is-invalid': submitted && !form.email }"
                    placeholder="tu@email.com"
                    autocomplete="email"
                  />
                  <div class="invalid-feedback">El email es obligatorio.</div>
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { LoginPayload } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<LoginPayload>({
  email: '',
  password: '',
})

const submitted = ref(false)

const handleLogin = async () => {
  submitted.value = true
  if (!form.email || !form.password) return

  try {
    await authStore.login(form)
    router.push('/')
  } catch {
    // El error ya se muestra desde el store
  }
}
</script>

<style scoped>
.auth-brand-icon {
  font-size: 2.75rem;
  color: var(--color-accent);
  filter: drop-shadow(0 0 14px rgba(233, 69, 96, 0.55));
}

.auth-card {
  background: rgba(22, 33, 62, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  padding: 2rem 2.25rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(233, 69, 96, 0.08);
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
}

.auth-label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

.auth-addon {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
}

.auth-input {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.auth-input:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--color-accent);
  color: #fff;
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.25);
}

.auth-input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.input-group:has(.is-invalid) .auth-addon {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #ff6b81;
}

.auth-footer {
  color: rgba(255, 255, 255, 0.4);
}
</style>
