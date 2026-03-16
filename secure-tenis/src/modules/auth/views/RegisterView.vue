<template>
  <div class="row justify-content-center py-5">
    <div class="col-md-6 col-lg-5">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <h3 class="fw-bold text-center mb-4">Crear Cuenta</h3>

          <div v-if="authStore.error" class="alert alert-danger py-2 small">
            {{ authStore.error }}
          </div>

          <form @submit.prevent="handleRegister" novalidate>
            <div class="mb-3">
              <label for="name" class="form-label">Nombre completo</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': submitted && !form.name }"
                placeholder="Tu nombre"
                autocomplete="name"
              />
              <div class="invalid-feedback">El nombre es obligatorio.</div>
            </div>

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
                :class="{ 'is-invalid': submitted && passwordError }"
                placeholder="Mínimo 6 caracteres"
                autocomplete="new-password"
              />
              <div class="invalid-feedback">{{ passwordError }}</div>
            </div>            <div class="mb-4">
              <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': submitted && confirmError }"
                placeholder="Repite la contraseña"
                autocomplete="new-password"
              />
              <div class="invalid-feedback">{{ confirmError }}</div>
            </div>

            <button
              type="submit"
              class="btn btn-dark w-100 mb-3"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              Crear cuenta
            </button>
          </form>

          <p class="text-center text-muted small mb-0">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="text-accent fw-semibold">Inicia sesión</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const confirmPassword = ref('')
const submitted = ref(false)

const passwordError = computed(() => {
  if (!form.password) return 'La contraseña es obligatoria.'
  if (form.password.length < 6) return 'Mínimo 6 caracteres.'
  return ''
})

const confirmError = computed(() => {
  if (!confirmPassword.value) return 'Confirma la contraseña.'
  if (confirmPassword.value !== form.password) return 'Las contraseñas no coinciden.'
  return ''
})

const handleRegister = async () => {
  submitted.value = true
  if (!form.name || !form.email || passwordError.value || confirmError.value) return

  try {
    await authStore.register(form)
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
