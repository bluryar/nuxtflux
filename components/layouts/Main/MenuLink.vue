<script setup lang="ts">
import { templateRef, useElementHover, useParentElement } from '@vueuse/core'
import type { RouteLocationRaw } from 'vue-router'
import { useSharedMenusData } from './composables/useSharedMenusData'

defineProps<{
  to: RouteLocationRaw
  title: string
}>()

const { menuWrapperRef } = useSharedMenusData()

const parentRef = useParentElement()
const isHover = useElementHover(parentRef)
const isOverflow = computed(
  () => {
    const dom = parentRef.value
    if (!dom)
      return

    return isTextOverflow(dom, false)
  },
)
</script>

<template>
  <NTooltip :show="isHover && isOverflow" class="pointer-events-none" :to="menuWrapperRef">
    <template #trigger>
      <NuxtLink :to="to">
        {{ title }}
      </NuxtLink>
    </template>

    <template #default>
      {{ title }}
    </template>
  </NTooltip>
</template>
