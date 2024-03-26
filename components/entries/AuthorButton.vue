<script setup lang="ts">
import { useTimeout } from '@vueuse/core'
import type { Entry } from '~/models/Entry'

const props = withDefaults(
  defineProps<{
    entry: Entry
    timeout?: number
  }>(),
  {
    timeout: 1500,
  },

)

const ready = useTimeout(props.timeout)

const {
  data: icon,
  status,
} = useLazyMinifluxFetch('/v1/feeds/{feedID}/icon', {
  method: 'GET',
  path: {
    feedID: computed(() => props.entry.feed_id || Number.NaN) as Ref,
  },
})

const iconLoading = computed(() => status.value === 'pending')
const iconUrl = computed(() => {
  const { data, mime_type } = icon.value || {}
  if (data?.startsWith(mime_type || ''))
    return `data:${data}`

  return data
})
function openExternal(url?: string) {
  if (url && url.startsWith('http'))
    window.open(url, '_blank')
}
</script>

<template>
  <div class="inline-flex animate-fade-in-down cursor-pointer items-center gap2 hover:(underline underline-wavy)" :title="$t('da_kai_yuan_lian_jie')" @click="openExternal(entry.feed?.site_url)">
    <div v-if="iconLoading" class="i-svg-spinners:pulse-multiple text-sm" />
    <img v-else :src="iconUrl" class="inline-block h-1em w-1em text-sm" lazy>
    <a relative flex items-center gap1 pr2.5em no-underline :href="entry.feed?.site_url" @click.prevent>
      {{ entry.author || entry.feed?.title || $t('entry.author.empty') }}
      <div v-if="ready" inline-block class="i-lucide:external-link absolute right-1em animate-fade-in animate-duration-500ms" />
    </a>
  </div>
</template>
