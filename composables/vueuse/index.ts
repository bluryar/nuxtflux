import { breakpointsAntDesign, createSharedComposable, useBreakpoints, useMagicKeys } from '@vueuse/core'

export const useSharedBreakpoints = createSharedComposable(() => {
  return useBreakpoints(breakpointsAntDesign)
})

export const useSharedMagicKeys = createSharedComposable(() => useMagicKeys())
