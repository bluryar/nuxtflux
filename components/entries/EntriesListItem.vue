<script setup lang="ts">
import { computedEager } from '@vueuse/core'
import { useInjectApiAdapter } from './stores/useApiAdapter'
import type { IEntry } from '~/models/Entry'
import FluentMdl2ImagePixel from '~/assets/FluentMdl2ImagePixel.svg?url'
import FluentMdl2ImagePixelDark from '~/assets/FluentMdl2ImagePixelDark.svg?url'

const props = defineProps<{
  entry?: IEntry
  loading?: boolean
}>()

const { isDark } = useTheme()

const fallbackSrc = computed(() => isDark.value ? FluentMdl2ImagePixelDark : FluentMdl2ImagePixel)
const imageSrc = computedEager(() => getFirstImage(props.entry?.content))

const {
  setViewingEntry,
  viewingEntry,
} = useInjectApiAdapter()

const isActive = computed(() => viewingEntry.value !== null && viewingEntry.value?.id === props.entry?.id)

const timeAgo = useLocaleTimeAgo(
  () => (props.entry?.published_at || ''),
)

const router = useRouter()
const route = useRoute()

async function setEntry() {
  if (!props.entry) {
    setViewingEntry(null)
    return
  }

  const entry = props.entry

  setViewingEntry(entry)
  await nextTick()

  router.push({
    name: 'mode-id-entryID',
    params: {
      ...(route.params as { mode: string, id: string }),
      entryID: entry?.id,
    },
  })
}
const el = shallowRef<HTMLElement | null>(null)
</script>

<template>
  <div ref="el">
    <NCard
      size="small"
      hoverable
      :theme-overrides="{
        borderColor: isActive ? 'var(--primary-color-pressed)' : undefined,
        boxShadow: isActive ? '0 0 8px 1px var(--primary-color-hover)' : undefined,
      }"
      class="cursor-pointer transition-all duration-500"
      :class="[
        entry?.status === 'read' && 'not-hover:op-70%',
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
        <h4>{{ entry?.title || $t('entry.title.empty') }}</h4>
        <span class="font-sans op-90%">
          {{ entry?.author || entry?.feed?.title || $t('entry.author.empty') }}
          <br>
          <span>{{ timeAgo }}</span>
        </span>
      </div>
    </NCard>
  </div>
</template>
