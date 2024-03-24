<script setup lang="ts">
import { useMinifluxFetch } from '#imports'
import type { Entry } from '~/models/Entry'

const props = withDefaults(
  defineProps<{
    entry: Entry
  }>(),

  {},
)

const {
  execute,
  status,
} = useMinifluxFetch('/v1/entries/{entryID}/save', {
  method: 'POST',
  watch: false,
  immediate: false,
  path: {
    entryID: computed(() => props.entry.id || Number.NaN),
  },
})

const loading = computed(() => status.value === 'pending')

function onClick() {
  if (loading.value)
    return

  execute()
}
</script>

<template>
  <div class="flex items-center gap1 pr2" :disabled="loading" @click="onClick">
    <div :title="$t('bao_cun_dao_di_san_fang_ji_cheng_ying_yong_zhong')">
      {{ $t('bao_cun') }}
    </div>
    <div v-if="!loading" class="i-lucide:save" />
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
