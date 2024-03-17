<script setup lang="ts">
import type { Entry } from '~/models/Entry'

const props = withDefaults(
  defineProps<{
    entry: Entry
  }>(),
  { },
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
  <div class="flex items-center gap1" :title="$t('zhua_qu_quan_wen')" @click="() => execute().then(() => emits('fetch-content', data?.content))">
    {{ $t('zhua_qu_quan_wen') }}
    <div v-if="!loading" class="i-lucide:download" inline-block />
    <div v-else class="i-svg-spinners:bouncing-ball" inline-block />
  </div>
</template>
