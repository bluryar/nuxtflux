<script setup lang="ts">
import { computedEager, useAsyncState } from '@vueuse/core'
import { useViewingEntries } from './stores/useViewingEntries'
import EntryNavTagList from './EntryNavTagList.vue'
import type { IEntry } from '~/models/Entry'
import FluentMdl2ImagePixel from '~/assets/FluentMdl2ImagePixel.svg?url'
import FluentMdl2ImagePixelDark from '~/assets/FluentMdl2ImagePixelDark.svg?url'

const props = defineProps<{
  entry?: IEntry
  loading?: boolean
}>()
const emits = defineEmits<{
  (evt: 'click', entry: IEntry | undefined | null): void
}>()

const { isDark } = useTheme()

const fallbackSrc = computed(() => isDark.value ? FluentMdl2ImagePixelDark : FluentMdl2ImagePixel)
const imageSrc = computedEager(() => getFirstImage(props.entry?.content))

const { viewingEntry } = useViewingEntries()

const isActive = computed(() => viewingEntry.value !== null && viewingEntry.value?.id === props.entry?.id)

const timeAgo = useLocaleTimeAgo(
  () => (props.entry?.published_at || ''),
)

function setEntry() {
  emits('click', props.entry)
}

const id = useId()
const {
  data: icon,
  execute: executeIcon,
  // pending: isLoading,
  status,
} = useLazyMinifluxFetch('/v1/icons/{iconID}', {
  method: 'GET',
  path: {
    iconID: computed(() => String(props.entry?.feed?.icon.icon_id || Number.NaN)) as Ref,
  },
  key: `icon-${id}`,
  watch: false,
  immediate: false,
})
const isLoading = computed(() => status.value === 'pending')

watch(() => props.entry?.feed_id, (entry) => {
  if (typeof entry !== 'undefined')
    executeIcon()
}, { immediate: true, deep: true })

const iconUrl = computed(() => {
  const { data, mime_type } = icon.value || {}
  if (data?.startsWith(mime_type || ''))
    return `data:${data}`

  return data
})
</script>

<template>
  <NCard
    size="small"
    hoverable
    :theme-overrides="{
      borderColor: isActive ? 'var(--primary-color-pressed)' : undefined,
      boxShadow: isActive ? '0 0 8px 1px var(--primary-color-hover)' : undefined,
    }"
    class="cursor-pointer transition-all duration-500"
    :class="[
      entry?.status === 'read' && !isActive && 'not-hover:op-70%',
      loading && 'hover:cursor-wait',
    ]"
    @click="setEntry"
  >
    <template #cover>
      <NImage
        class="w-full transition-all"
        :src="imageSrc || fallbackSrc"
        :fallback-src="loading ? undefined : fallbackSrc"

        lazy preview-disabled
        :intersection-observer-options="{ }"
      >
        <template #placeholder>
          <NSkeleton class="aspect-video h-unset" height="unset" />
        </template>
      </NImage>
    </template>
    <NSkeleton v-if="loading" text :repeat="2" />
    <NSkeleton v-if="loading" style="width: 5em" />

    <div v-else prose>
      <EntryNavTagList :entry="entry" type="primary" class="w-full" />
      <h4 my="2">
        {{ entry?.title || $t('entry.title.empty') }}
      </h4>
      <div class="font-sans op-90%">
        <div class="inline-flex items-center gap2 text-lg">
          <div v-if="isLoading" class="i-svg-spinners:pulse-multiple" />
          <img v-else :src="iconUrl" class="inline-block h-1em w-1em" lazy>
          <span class="text-size-sm">{{ entry?.author || entry?.feed?.title || $t('entry.author.empty') }}</span>
        </div>
        <div class="flex items-center gap2">
          <div
            v-if="entry?.starred "
            :class="[
              entry?.starred && 'i-line-md:star-filled bg-primary mb-2px',
            ]"
          />
          <div>
            {{ timeAgo }}
          </div>
        </div>
      </div>
    </div>
  </NCard>
</template>
