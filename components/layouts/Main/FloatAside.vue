<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import Logo from './Logo.vue'
import Menu from './Menu.vue'
import { useInjectLayoutStore } from './store'

const props = withDefaults(defineProps<
  { zIndex?: number }
>(), {
  zIndex: 2000,
})

const { zIndex } = toRefs(props)
const maskZIndex = computed(() => zIndex.value - 1)

const asideRef = ref<HTMLElement | null>(null)
const maskRef = ref<HTMLElement | null>(null)
const {
  asideWidth,
  asideBackgroundColor,
  isShowFloatAside,
} = useInjectLayoutStore()

onClickOutside(asideRef, () => {
  isShowFloatAside.value = false
}, {
  // ignore: [maskRef],
})
</script>

<template>
  <Transition
    name="custom"
    appear
    enter-active-class="animate__animated animate__slideInLeft animate__faster"
    leave-active-class="animate__animated animate__slideOutLeft animate__faster"
  >
    <aside v-show="isShowFloatAside" ref="asideRef" class="flex flex-col">
      <Logo class="shrink-0 grow-0 basis-auto" floating />
      <NScrollbar class="flex-1">
        <Menu class="w-full overflow-x-hidden" :menu-props="{ collapsed: false }" />
      </NScrollbar>
      <!-- <div class="shrink-0 grow-0 basis-auto" /> -->
      <Teleport to="body">
        <div v-if="isShowFloatAside" ref="maskRef" class="float-aside-mask" />
      </Teleport>
    </aside>
  </Transition>
</template>

<style scoped>
aside {
  z-index: v-bind(zIndex);
  width: v-bind(asideWidth);
  background-color: v-bind(asideBackgroundColor);
  height: 100vh;
}

body > div.float-aside-mask {
  @apply fixed top-0 left-0 w-100vw h-100vh bg-black opacity-50;
  z-index: v-bind(maskZIndex);
}

aside {
  @apply shadow-2xl;
  @apply dark:shadow-gray-600;
  @apply fixed top-0 left-0;
}
</style>
