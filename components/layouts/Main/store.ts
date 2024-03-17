import { createInjectionState, templateRef, useElementHover } from '@vueuse/core'

export interface LayoutSettings {
  // size
  headerHeight: string
  asideWidth: string
  asideCollapsedWidth: string
  logoSize: string

  asidePaddingLeft: string
  asideCollapsedPaddingLeft: string
  asidePaddingRight: string
  asideCollapsedPaddingRight: string

  // background
  asideBackgroundColor: string
  headerBackgroundColor: string

  // z-index
  headerZIndex: number
  asideZIndex: number

  // animation
  asideHoverDelay: number
}

export interface LayoutStore extends LayoutSettings {
  isAsideCollapsed: boolean
  isShowFloatAside: boolean
}

const [
  useProvideLayoutStore,
  _useInjectLayoutStore,
] = createInjectionState(
  (
    initialState: LayoutSettings,
  ) => {
    const state = reactive<LayoutStore>({
      isAsideCollapsed: false,
      isShowFloatAside: false,
      ...initialState,
    })

    const layoutRef = templateRef<HTMLElement | null>('layoutRef')
    const headerRef = templateRef<HTMLElement | null>('headerRef')
    const asideRef = templateRef<HTMLElement | null>('asideRef')
    const contentRef = templateRef<HTMLElement | null>('contentRef')

    const isScreenSmall = useSharedBreakpoints().smaller('sm')
    const isScreenMedium = useSharedBreakpoints().between('sm', 'xl')
    const isScreenLarge = useSharedBreakpoints().greater('xl')
    const isHoveringAside = useElementHover(asideRef, {
      delayLeave: state.asideHoverDelay,
    })
    const isMenuCollapsed = computed(() => state.isAsideCollapsed && !isHoveringAside.value)

    const toggleCollapsed = (val?: boolean) => {
      if (typeof val === 'boolean')
        state.isAsideCollapsed = val
      else
        state.isAsideCollapsed = !state.isAsideCollapsed
    }

    function setContentOffsetLeft(offsetLeft: MaybeRef<string>) {
      layoutRef.value?.style.setProperty('--header-offset-left', unref(offsetLeft))
      layoutRef.value?.style.setProperty('--content-offset-left', unref(offsetLeft))
    }

    function setAsideWidth(_asideWidth: MaybeRef<string>) {
      layoutRef.value?.style.setProperty('--aside-width', unref(_asideWidth))
    }

    function setOffset(offset: MaybeRef<string>) {
      setContentOffsetLeft(offset)
      setAsideWidth(offset)
    }

    return {
      ...toRefs(state),

      toggleCollapsed,
      setContentOffsetLeft,
      setAsideWidth,
      setOffset,

      isHoveringAside,
      isScreenSmall,
      isScreenMedium,
      isScreenLarge,
      isMenuCollapsed,

      layoutRef,
      headerRef,
      asideRef,
      contentRef,
    }
  },
)

function useInjectLayoutStore() {
  const state = _useInjectLayoutStore()

  if (!state)
    throw new Error('useInjectLayoutStore() is called without provider')

  return state
}

export {
  useProvideLayoutStore,
  useInjectLayoutStore,
}
