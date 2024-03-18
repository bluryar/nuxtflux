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

const emits = defineEmits<{
  (evt: 'fetch-content', data?: string): void
}>()

const {
  execute,
  status,
  data,
} = useMinifluxFetch('/v1/entries/{entryID}/fetch-content', {
  method: 'GET',
  watch: false,
  immediate: false,
  path: {
    entryID: computed(() => props.entry.id || Number.NaN),
  },
})

const loading = computed(() => status.value === 'pending')
</script>

<template>
  <div class="flex items-center gap1 pr-2" :title="$t('zhua_qu_quan_wen')" :disabled="loading" @click="() => !loading && execute().then(() => emits('fetch-content', data?.content))">
    <div class="lt-sm:hidden">
      {{ $t('zhua_qu_quan_wen') }}
    </div>
    <div v-if="!loading" class="i-lucide:download" inline-block />
    <div v-else class="i-svg-spinners:bouncing-ball" inline-block />
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
