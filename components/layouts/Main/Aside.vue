<script lang="ts" setup>
import Logo from './Logo.vue'
import Menu from './Menu.vue'
import { useInjectLayoutStore } from './store'

const asideRef = ref<HTMLElement | null>(null)

const {
  isHoveringAside,
  isAsideCollapsed,
} = useInjectLayoutStore()
</script>

<template>
  <aside ref="asideRef" :data-hover="isHoveringAside" :data-collapsed="isAsideCollapsed" class="flex flex-col">
    <Logo class="shrink-0 grow-0 basis-auto" :floating="false" />
    <NScrollbar class="flex-1">
      <Menu class="w-full overflow-x-hidden" />
    </NScrollbar>
    <!-- <div class="shrink-0 grow-0 basis-auto" /> -->
  </aside>
</template>

<style scoped>
aside {
  &[data-hover='true'][data-collapsed='true'] {
    @apply shadow-2xl

    @apply dark:shadow-gray-600;
  }
}
</style>
