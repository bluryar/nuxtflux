<script setup lang="ts">
import type { Entry } from '~/models/Entry'

const props = withDefaults(
  defineProps<{
    entry: Entry
    responsive?: boolean
  }>(),
  {
    responsive: true,
  },

)

defineEmits<{
  (evt: 'updateEntry', starred: boolean): void
}>()

const {
  execute,
  status,
} = useLazyMinifluxFetch('/v1/entries/{entryID}/bookmark', {
  path: {
    entryID: computed(() => props.entry.id || Number.NaN),
  },
  method: 'PUT',
  watch: false,
  immediate: false,
})

const loading = computed(() => status.value === 'pending')
</script>

<template>
  <div class="flex items-center gap1 pr2" :disabled="loading" @click="() => !loading && execute().then(() => { $emit('updateEntry', !entry.starred) })">
    <div class="lt-sm:hidden">
      {{ entry.starred ? '取消收藏' : '收藏' }}
    </div>
    <div
      v-if="!loading"
      class="transition-all duration-300"
      :class="[
        entry.starred ? 'i-line-md:star-filled' : 'i-line-md:star',
      ]"
    />
    <div v-else class="i-svg-spinners:bouncing-ball" />
  </div>
</template>

<style scoped>
div[disabled='true'] {
  @apply cursor-wait;
}
div[disabled='false'] {
  @apply cursor-pointer;
}
</style>
