import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Importar estilos globales
import '@/assets/styles/main.css'
import '@/assets/styles/variables.css'
import '@/assets/styles/base/_buttons.css'
import '@/assets/styles/base/_inputs.css'

// Inicializar la App 
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
