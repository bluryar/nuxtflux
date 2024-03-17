import { breakpointsAntDesign, createSharedComposable, useBreakpoints } from '@vueuse/core'

export const useSharedBreakpoints = createSharedComposable(() => {
  return useBreakpoints(breakpointsAntDesign)
})
