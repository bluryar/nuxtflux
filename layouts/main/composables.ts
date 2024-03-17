import { useInjectLayoutStore } from '@/components/layouts/Main/store'

export function setupAsideResponsive() {
  const {
    asideWidth,
    asideCollapsedWidth,

    setAsideWidth,
    setOffset,

    isScreenSmall,
    isScreenMedium,
    isScreenLarge,
    isHoveringAside,
    isAsideCollapsed,

    toggleCollapsed,
  } = useInjectLayoutStore()

  const scope = effectScope(!!1)

  onMounted(() => scope.run(run))
  onScopeDispose(() => scope.stop())

  function run() {
    // 处理屏幕断点变化时，侧边栏的宽度变化
    watch(
      [isScreenSmall, isScreenMedium, isScreenLarge],
      ([sm, md, lg]) => {
        const isNotInSingleBreakpoint = [sm, md, lg].map(Number).reduce((a, b) => a + b) > 1
        if (isNotInSingleBreakpoint)
          return

        if (sm) {
          setOffset('0px')
        }
        else if (md) {
          setOffset(asideCollapsedWidth.value)
          toggleCollapsed(true)
        }
        else {
          setOffset(asideWidth.value)
          toggleCollapsed(false)
        }
      },
      {
        immediate: true,
        flush: 'post',
      },
    )

    watch(
      isHoveringAside,
      (val) => {
        // 当侧边栏没有被收起来时，不需要处理
        if (!isAsideCollapsed.value)
          return

        setAsideWidth(val ? asideWidth.value : asideCollapsedWidth.value)
      },
      {
        immediate: true,
        flush: 'post',
      },
    )
  }
}
