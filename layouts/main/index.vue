<script lang="ts" setup>
import { setupAsideResponsive } from './composables'
import { useProvideLayoutStore } from '@/components/layouts/Main/store'
import { usePageTransition } from '~/composables/usePageTransition'

const {
  headerHeight,
  asideWidth,

  asideBackgroundColor,
  headerBackgroundColor,

  headerRef,
  asideRef,
  contentRef,
  layoutRef,

  headerZIndex,
  asideZIndex,
} = useProvideLayoutStore({
  asideWidth: '240px',
  asideCollapsedWidth: '64px',

  headerHeight: '52px',

  asideBackgroundColor: '#ffffff',
  headerBackgroundColor: 'transparent',

  logoSize: '24px',
  asidePaddingLeft: '32px',
  asideCollapsedPaddingLeft: '20px',
  asidePaddingRight: '16px',
  asideCollapsedPaddingRight: '0px',
  asideHoverDelay: 150,

  headerZIndex: 4,
  asideZIndex: 5,
})

const { isDark } = useTheme()

watchEffect(
  () => {
    if (isDark.value)
      asideBackgroundColor.value = '#1d1f26'
    else
      asideBackgroundColor.value = '#ffffff'
  },
)
const { isTransiting } = usePageTransition()

setupAsideResponsive()
</script>

<template>
  <div ref="layoutRef" class="layout">
    <LayoutMainHeader ref="headerRef" class="header" />
    <LayoutMainAside
      ref="asideRef" class="aside"
    />
    <LayoutMainContent
      ref="contentRef" class="content" :style="{
        overflow: isTransiting ? 'hidden' : '',
      }"
    >
      <slot />
    </LayoutMainContent>
  </div>
</template>

<style>
body {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
</style>

<style scoped>
.layout {
  /* size */
  --header-height: v-bind(headerHeight);
  --aside-width: v-bind(asideWidth);
  --header-offset-left: v-bind(asideWidth);
  --content-offset-left: v-bind(asideWidth);

  /* background */
  --aside-background-color: v-bind(asideBackgroundColor);
  --header-background-color: v-bind(headerBackgroundColor);
}

.layout {
  width: 100vw;
  height: 100vh;

  .header {
    position: fixed;
    top: 0;
    left: var(--header-offset-left);
    height: var(--header-height);
    width: calc(100% - var(--header-offset-left));
    background-color: var(--header-background-color);
    z-index: v-bind(headerZIndex);
  }

  .aside {
    overflow-x: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: var(--aside-width);
    height: 100%;
    background-color: var(--aside-background-color);
    transition: all 0.3s;
    z-index: v-bind(asideZIndex);
  }

  .content {
    width: 100%;
    height: 100%;
    padding-top: var(--header-height);
    padding-left: var(--content-offset-left);
    transition: all 0.3s;
  }
}
</style>
../../components/layouts/Main/store
