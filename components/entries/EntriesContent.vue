<script setup lang="ts">
import { format } from '@formkit/tempo'
import AuthorButton from './AuthorButton.vue'
import PullContentButton from './PullContentButton.vue'
import StarButton from './StarButton.vue'
import { useViewingEntries } from './stores/useViewingEntries'
import EntryNavTagList from './EntryNavTagList.vue'
import type { Entry } from '~/models/Entry'

const props = withDefaults(
  defineProps<{
    entry: Entry | null
  }>(),
  { },
)

const fetchedContent = ref('')
const entry = computed(() => props.entry)
const { setViewingEntry, viewingEntry, viewingEntries } = useViewingEntries()
const { executeCounters } = useFeedsStore()
const { t, locale } = useI18n()

const date = computed(() => props.entry?.published_at && format(new Date(props.entry!.published_at), t('date.full.format'), locale.value))

const {
  execute,
} = useMinifluxFetch('/v1/entries', {
  method: 'PUT',
  body: computed(() => ({
    entry_ids: [(viewingEntry.value?.id || Number.NaN)],
    status: 'read',
  })),
  watch: false,
  immediate: false,
})

watchEffect(async () => {
  // entry 可以从外部传入，也可以自行通过id从接口获取
  if (props.entry && viewingEntry.value?.id !== props.entry.id)
    setViewingEntry(props.entry)
}, {
  flush: 'post',
})

watch(viewingEntry, async (entry) => {
  if (entry && entry!.status === 'unread') {
    execute().then(() => executeCounters())

    entry.status = 'read'

    setViewingEntry(entry)
    updateEntries(entry)
  }
})

function updateEntries(entry: Entry) {
  const index = viewingEntries.value?.findIndex(e => e.id === entry.id)
  const target = viewingEntries.value?.[index || 0]
  if (target) {
    viewingEntries.value![index || 0] = entry
    triggerRef(viewingEntries)
  }
}

function onUpdateEntryStarred(val: boolean) {
  const entry = viewingEntry.value
  if (entry) {
    entry.starred = val

    setViewingEntry(entry)

    updateEntries(entry)
  }
}

function openExternal(url?: string) {
  if (url && url.startsWith('http'))
    window.open(url, '_blank')
}
</script>

<template>
  <div class="px-6 pb-6">
    <NEmpty v-if="!entry" size="large" class="h-full flex items-center justify-center">
      <template #icon>
        <div class="i-fluent-mdl2:page" />
      </template>
    </NEmpty>
    <!-- overflow-hidden: create A BFC, avoid children margin overflow -->
    <div v-else class="relative mx-auto max-w-80ch overflow-hidden font-prose-serif prose">
      <div class="absolute top-0 text-sm text-text3">
        {{ date }}
      </div>

      <h1 class="title mb2 mt5" @click="openExternal(entry.url)">
        <a no-underline class="font-bold">
          {{ entry.title || $t('entry.title.empty') }}
        </a>
      </h1>

      <div v-if="viewingEntry" class="w-full flex flex-wrap items-center gap-y-2 font-sans">
        <AuthorButton class="btn" :entry="viewingEntry" />
        <StarButton class="btn" :entry="viewingEntry" responsive @update-entry="onUpdateEntryStarred" />
        <PullContentButton class="btn" :entry="viewingEntry" responsive @fetch-content="(val) => (fetchedContent = val || '')" />
        <NDivider vertical />
        <EntryNavTagList :entry="entry" type="default" class="inline-flex" />
      </div>

      <div class="my-2 w-full origin-center scale-y-50 border-1px" />

      <blockquote v-if="fetchedContent && fetchedContent !== entry?.content" class="max-h-300px bg-card px-6 uno-scrollbar uno-scrollbar-rounded" v-html="fetchedContent" />

      <div id="entry-article" class="text-16px">
        <article class="text-1.1em color-text2 font-500 tracking-.045em" v-html="entry?.content || ''" />
      </div>
    </div>
  </div>
</template>

<style>
#entry-article {
  iframe {
    @apply w-full;
  }

  pre {
    @apply uno-scrollbar;
  }

  code {
    @apply font-mono text-14px tracking-0;
  }

  blockquote {
    border-left-width: 0.25rem;
    border-style: solid;
    border-color: var(--icon-color);
    font-style: normal;
    @apply px-4 ml--4 my6;
  }
}
</style>

<style scoped>
.title {
  @apply hover:(cursor-pointer underline underline-dash);
}

.btn {
  @apply text-xs color-gray hover:(underline underline-wavy);
}
</style>
