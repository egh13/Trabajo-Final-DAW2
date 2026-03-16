<template>
  <div class="row justify-content-center py-5">
    <div class="col-md-5 col-lg-4">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <h3 class="fw-bold text-center mb-4">Iniciar Sesión</h3>

          <div v-if="authStore.error" class="alert alert-danger py-2 small">
            {{ authStore.error }}
          </div>

          <form @submit.prevent="handleLogin" novalidate>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': submitted && !form.email }"
                placeholder="tu@email.com"
                autocomplete="email"
              />
              <div class="invalid-feedback">El email es obligatorio.</div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': submitted && !form.password }"
                placeholder="Tu contraseña"
                autocomplete="current-password"
              />
              <div class="invalid-feedback">La contraseña es obligatoria.</div>
            </div>

            <button
              type="submit"
              class="btn btn-dark w-100 mb-3"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              Entrar
            </button>
          </form>

          <p class="text-center text-muted small mb-0">
            ¿No tienes cuenta?
            <router-link to="/register" class="text-accent fw-semibold">Regístrate</router-link>
          </p>
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
.text-accent {
  color: var(--color-accent);
}
</style>
