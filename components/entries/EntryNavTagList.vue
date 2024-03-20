<script setup lang="ts">
import type { TagProps } from 'naive-ui'
import type { IEntry } from '~/models/Entry'

defineProps<{
  entry?: null | IEntry
  type: TagProps['type']
}>()
</script>

<template>
  <div flex="~ items-center gap1" overflow="hidden" my="1">
    <NTag v-if="entry?.feed?.category?.title" class="max-w-40%" size="small" :type="type" @click.stop="$router.push({ name: 'mode-id-entryID', params: { mode: 'categories', id: entry.feed.category.id } })">
      <div class="tag-text">
        {{ entry?.feed?.category?.title }}
      </div>
    </NTag>
    <span v-if="entry?.feed?.title && entry.feed.category?.title" class="text-xs text-gray">/</span>
    <NTag v-if="entry?.feed?.title" class="max-w-55%" size="small" :type="type" @click.stop="$router.push({ name: 'mode-id-entryID', params: { mode: 'feeds', id: entry.feed.id } })">
      <div class="tag-text">
        {{ entry?.feed?.title }}
      </div>
    </NTag>
  </div>
</template>

<style scoped>
:deep() {
  .n-tag__content {
    width: 100%;
  }
}

.tag-text {
  @apply w-full truncate py1 hover:(underline underline-wavy);
}
</style>
