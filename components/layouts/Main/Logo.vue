<script lang="ts" setup>
import { templateRef } from '@vueuse/core'
import { useInjectLayoutStore } from './store'
import LogoURL from '@/assets/icon/Logo.svg?url'

const props = defineProps<{
  floating: boolean
}>()

const {
  headerHeight,
  logoSize,
  asidePaddingLeft,
  asidePaddingRight,
  asideCollapsedPaddingLeft,
  asideCollapsedPaddingRight,
  isAsideCollapsed,
  isHoveringAside,
  asideWidth,
  asideCollapsedWidth,
  toggleCollapsed,
  setContentOffsetLeft,
  isShowFloatAside,
} = useInjectLayoutStore()

const scope = effectScope()
const logoRef = templateRef<HTMLElement | null>('logoRef')

onMounted(() => scope.run(run))
const title = import.meta.env.VITE_TITLE

function setPaddingLeft(offset: MaybeRef<string>) {
  logoRef.value?.style.setProperty('--padding-left', toValue(offset))
}
function setPaddingRight(offset: MaybeRef<string>) {
  logoRef.value?.style.setProperty('--padding-right', toValue(offset))
}

function run() {
  if (props.floating)
    return

  watch(
    [isAsideCollapsed, isHoveringAside],
    ([collapsed, hovering]) => {
      if (hovering || !collapsed) {
        setPaddingLeft(asidePaddingLeft)
        setPaddingRight(asidePaddingRight)
        return
      }
      if (collapsed) {
        setPaddingLeft(asideCollapsedPaddingLeft)
        setPaddingRight(asideCollapsedPaddingRight)
      }
    },
    { immediate: true },
  )
}

function onClick() {
  if (props.floating) {
    isShowFloatAside.value = false
    return
  }

  toggleCollapsed()
  setContentOffsetLeft(isAsideCollapsed.value ? asideCollapsedWidth : asideWidth)
}

const isShowRestWidget = computed(() => isHoveringAside.value || !isAsideCollapsed.value || props.floating)
</script>

<template>
  <div ref="logoRef" class="logo">
    <div class="flex cursor-pointer items-center gap2 hover:animate-jello" @click="$router.push('/')">
      <img :src="LogoURL" class="logo-image">
      <span v-if="isShowRestWidget" class="text-lg">{{ title }}</span>
    </div>
    <NButton v-if="isShowRestWidget" class="toggle" quaternary @click="onClick">
      <div v-if="floating" class="i-line-md:close-circle" />
      <Transition
        v-else name="custom"
        appear
        mode="out-in"
        enter-active-class="animate__animated animate__fadeIn animate__fast"
      >
        <div v-if="isAsideCollapsed" class="i-carbon:circle-filled" />
        <div v-else class="i-line-md:circle" />
      </Transition>
    </NButton>
  </div>
</template>

<style scoped>
.logo {
  --logo-height: v-bind(headerHeight);
  --logo-size: v-bind(logoSize);
  --padding-left: v-bind(asidePaddingLeft);
  --padding-right: v-bind(asidePaddingRight);
}

.logo {
  @apply flex justify-between items-center;
  @apply w-full;
  @apply transition-all duration-300;

  padding-left: var(--padding-left);
  padding-right: var(--padding-right);
  height: var(--logo-height);

  .logo-image {
    @apply block w-[1em] h-[1em] shrink-0;
    font-size: var(--logo-size);
  }

  .toggle {
    @apply flex items-center;
    @apply p-1;
    @apply text-[20px];
    @apply text-gray-400;
    @apply cursor-pointer;

    &:hover {
      @apply rounded-sm;
    }
  }
}
</style>
