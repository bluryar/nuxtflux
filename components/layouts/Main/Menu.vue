<script lang="tsx" setup>
import type { MenuProps } from 'naive-ui'
import { useInjectLayoutStore } from './store'
import { useSharedMenusData } from './composables'

defineProps<{
  menuProps?: MenuProps
}>()
const { isMenuCollapsed, asidePaddingLeft, asideCollapsedWidth } = useInjectLayoutStore()

const {
  getKey,
  init,
  menus,
} = useSharedMenusData()

onMounted(() => {
  init()
})
</script>

<template>
  <div v-bind="$attrs">
    <NMenu
      :value="getKey($route)"
      class="menu font-sans"
      :options="menus"
      :icon-size="20"
      :collapsed-icon-size="24"
      :collapsed="isMenuCollapsed"
      :root-indent="parseInt(asidePaddingLeft)"
      :collapsed-width="parseInt(asideCollapsedWidth)"
      default-expand-all
      v-bind="menuProps"
    />
  </div>
</template>

<style scoped>
.menu {
  :deep() {
    .n-menu-item-content-header {
      @apply relative pr-12px;
    }
    .n-menu-item-content-header__extra {
      @apply absolute top-0 right-0;
    }
  }
}
</style>
