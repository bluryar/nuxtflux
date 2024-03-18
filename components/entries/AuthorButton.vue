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

function openExternal(url?: string) {
  if (url && url.startsWith('http'))
    window.open(url, '_blank')
}
</script>

<template>
  <div class="inline-block animate-fade-in-down cursor-pointer hover:(underline underline-wavy)" :title="$t('da_kai_yuan_lian_jie')" @click="openExternal(entry.feed?.site_url)">
    <a relative flex items-center gap1 pr2.5em no-underline>
      {{ entry.author || entry.feed?.title || $t('entry.author.empty') }}
      <div v-if="ready" inline-block class="i-lucide:external-link absolute right-1em animate-fade-in animate-duration-500ms" />
    </a>
  </div>
</template>
