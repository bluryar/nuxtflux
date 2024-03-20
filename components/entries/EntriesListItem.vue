<script setup lang="ts">
import { computedEager } from '@vueuse/core'
import { useViewingEntries } from './stores/useViewingEntries'
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

const { setViewingEntry, viewingEntry } = useViewingEntries()

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
        <div flex="~ items-center gap1" w="full" overflow="hidden" my="1">
          <NTag v-if="entry?.feed?.category?.title" class="max-w-40%" size="small" type="primary" @click.stop="$router.push({ name: 'mode-id-entryID', params: { mode: 'categories', id: entry.feed.category.id } })">
            <div class="tag-text">
              {{ entry?.feed?.category?.title }}
            </div>
          </NTag>
          <span v-if="entry?.feed?.title && entry.feed.category?.title" class="text-xs text-gray">/</span>
          <NTag v-if="entry?.feed?.title" class="max-w-55%" size="small" type="primary" @click.stop="$router.push({ name: 'mode-id-entryID', params: { mode: 'feeds', id: entry.feed.id } })">
            <div class="tag-text">
              {{ entry?.feed?.title }}
            </div>
          </NTag>
        </div>
        <h4 my="2">
          {{ entry?.title || $t('entry.title.empty') }}
        </h4>
        <div class="font-sans op-90%">
          <div>
            <span>{{ entry?.author || entry?.feed?.title || $t('entry.author.empty') }}</span>
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
  </div>
</template>

<!-- <style scoped>
.is-favorite::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 40px; /* 控制梯形的底边宽度 */
  height: 40px; /* 控制梯形的高度 */
  background-color: var(--primary-color);
  opacity: 0.8;
  @apply shadow-lg;
  clip-path: polygon(0 0, 40% 0, 100% 60%, 100% 100%);
}
</style> -->

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
