import { ref } from 'vue'

const isOpen = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }
const close  = () => { isOpen.value = false }

export function useSidebar() {
  return { isOpen, toggle, close }
}
