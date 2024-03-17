<script setup lang="ts">
import { templateRef, useElementHover, useParentElement } from '@vueuse/core'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
  title: string
}>()

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

const aTagRef = templateRef<HTMLElement>('aTagRef')
</script>

<template>
  <NTooltip :show="isHover && isOverflow" class="pointer-events-none">
    <template #trigger>
      <NuxtLink :to="to">
        <a ref="aTagRef">
          {{ title }}
        </a>
      </NuxtLink>
    </template>

    <template #default>
      {{ title }}
    </template>
  </NTooltip>
</template>
