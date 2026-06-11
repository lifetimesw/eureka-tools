import { defineStore } from 'pinia'

export const useRequestStore = defineStore('request', () => {
  const count = ref(0)
  const isLoading = computed(() => count.value > 0)
  function startLoading(): void {
    count.value++
  }
  function endLoading(): void {
    if (count.value > 0) {
      count.value--
    }
  }

  return {
    isLoading,
    startLoading,
    endLoading,
  }
})
