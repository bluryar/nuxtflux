<script setup lang="ts">
import { useElementBounding, useInfiniteScroll, useMounted, useTemplateRefsList, whenever } from '@vueuse/core'
import { useInjectApiAdapter } from './stores/useApiAdapter'
import EntriesListItem from './EntriesListItem.vue'
import { useProvideLoadMore } from './stores/useEntriesLoadMore'
import EntriesListToggleRadioGroup from './EntriesListToggleRadioGroup.vue'
import EntriesMarkAllReadButton from './EntriesMarkAllReadButton.vue'
import EntriesListSearchForm from './EntriesListSearchForm.vue'
import { useViewingEntries } from './stores/useViewingEntries'
import type { IEntry } from '~/models/Entry'
import { useSharedMagicKeys } from '~/composables/vueuse'

const entriesInjection = useInjectApiAdapter()
const { setViewingEntries, setViewingEntry, viewingEntry } = useViewingEntries()

const scrollbarRef = shallowRef<HTMLElement>()
const refs = useTemplateRefsList<HTMLDivElement>()

const {
  list: entries,
  loadingMore,
  loadMore,
  noMore,
  init,
  total,
} = useProvideLoadMore({
  data: entriesInjection.entries,
  pending: entriesInjection.loading,
  execute: entriesInjection.execute,
  query: entriesInjection.query,
  refresh: entriesInjection.refresh,
})

watch(entries, (list) => {
  setViewingEntries(list)
})

const isMounted = useMounted()
watch([
  isMounted,
  entriesInjection.id,
  entriesInjection.mode,
], ([mounted]) => {
  if (!mounted)
    return
  init()
  loadMore()
}, { immediate: true })

useInfiniteScroll(scrollbarRef, () => {
  if (noMore.value || loadingMore.value)
    return

  return loadMore()
}, {
  canLoadMore() {
    return !loadingMore.value
  },
})

const containerRef = shallowRef<HTMLDivElement>()
const { right, bottom } = useElementBounding(containerRef)

const router = useRouter()
const { arrowLeft, arrowRight } = useSharedMagicKeys()

// TODO MOVE TO SHARED COMPOSABLES
whenever(arrowLeft, () => updateViewingEntryByKey(-1))
whenever(arrowRight, () => updateViewingEntryByKey(1))
async function updateViewingEntryByKey(offset: 1 | -1) {
  if (!entries.value?.length)
    return

  if (!viewingEntry.value) {
    await setEntry(entries.value[0])
    return
  }

  const currentIdx = entries.value.findIndex(i => i.id === viewingEntry.value?.id)

  const newIdx = currentIdx + offset
  if (currentIdx < 0 || newIdx < 0 || newIdx - 1 > total.value)
    return

  const target = entries.value[newIdx]
  if (!target)
    await loadMore()
    // await nextTick()

  setEntry(target)
}

async function focusToEntryItem(entry: IEntry) {
  await nextTick()
  if (!viewingEntry.value || !scrollbarRef.value)
    return

  const currentIdx = entries.value.findIndex(i => i.id === entry?.id)
  const targetDOM = refs.value[currentIdx]
  if (!targetDOM)
    return
  targetDOM.scrollIntoView({
    block: 'start',
  })
}

async function setEntry(entry?: IEntry | null) {
  if (!entry) {
    setViewingEntry(null)
    return
  }

  setViewingEntry(entry)
  await nextTick()
  await focusToEntryItem(entry)

  router.push({
    name: 'mode-id-entryID',
    params: {
      ...(router.currentRoute.value.params as { mode: string, id: string }),
      entryID: entry?.id,
    },
  })
}
</script>

<template>
  <div ref="containerRef" class="flex flex-col">
    <NBackTop
      v-if="scrollbarRef"
      :theme-overrides="{
        height: '2.25rem',
        width: '2.25rem',
      }"
      :listen-to="scrollbarRef" :to="containerRef" :bottom="`calc(100vh - ${bottom - 60}px)`" :right="`calc(100vw - ${right - 20}px)`"
    >
      <div class="i-line-md:upload-outline-loop text-2xl" />
    </NBackTop>

    <EntriesListSearchForm class="input-area" />
    <div v-if="loadingMore && !entries.length" class="list">
      <EntriesListItem
        v-for="i in 5"
        :key="`entries-item-empty#${i}`" :loading="loadingMore"
      />
    </div>
    <div v-else ref="scrollbarRef" class="list">
      <div
        v-for="entry in entries"
        :key="`entries-item#${entry.id}`"
        :ref="refs.set"
      >
        <EntriesListItem

          :entry="entry"
          :loading="loadingMore"
          @click="(entry) => setEntry(entry)"
        />
      </div>

      <div class="h-full w-full flex items-center justify-center prose">
        <div v-if="noMore">
          {{ $t('list.empty') }}
        </div>
        <NButton
          v-else
          quaternary
          loading
        />
      </div>
    </div>
    <div class="toggle-area">
      <EntriesListToggleRadioGroup />
      <EntriesMarkAllReadButton />
    </div>
  </div>
</template>

<style scoped>
.list {
  @apply h-full w-full flex flex-col gap-2.25 pb-4 uno-scrollbar uno-scrollbar-rounded px-3 relative;
}

.input-area,
.toggle-area {
  @apply shrink-0 grow-0 w-full px-3;
}

.toggle-area {
  @apply flex items-center justify-between;
}
</style>
