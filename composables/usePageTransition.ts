import { createSharedComposable } from '@vueuse/core'

export const usePageTransition = createSharedComposable(() => {
  const isTransiting = ref(false)
  return {
    isTransiting,
  }
})
