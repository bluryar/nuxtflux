<script setup lang="ts">
import { format } from '@formkit/tempo'
import { useInjectApiAdapter } from './stores/useApiAdapter'
import AuthorButton from './AuthorButton.vue'
import PullContentButton from './PullContentButton.vue'
import type { Entry } from '~/models/Entry'

const props = withDefaults(
  defineProps<{
    entry: Entry | null
  }>(),
  { },
)

const fetchedContent = ref('')
const entry = computed(() => props.entry)
const { setViewingEntry, viewingEntry, viewingEntries } = useInjectApiAdapter()
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
  if (props.entry && viewingEntry.value?.id !== props.entry.id)
    setViewingEntry(props.entry)
}, {
  flush: 'post',
})

watch(viewingEntry, async (entry) => {
  if (entry && entry!.status === 'unread') {
    execute().then(() => executeCounters())

    entry.status = 'read'
    const index = viewingEntries.value.findIndex(e => e.id === entry.id)
    const target = viewingEntries.value[index]
    if (target) {
      viewingEntries.value[index] = entry
      triggerRef(viewingEntries)
    }
  }
})

function openExternal(url?: string) {
  if (url && url.startsWith('http'))
    window.open(url, '_blank')
}
</script>

<template>
  <div class="px-6 uno-scrollbar uno-scrollbar-rounded">
    <NEmpty v-if="!entry" size="large" class="h-full flex items-center justify-center">
      <template #icon>
        <div class="i-fluent-mdl2:page" />
      </template>
    </NEmpty>
    <div v-else class="entry" relative mx-auto prose>
      <div class="absolute top--2em">
        {{ date }}
      </div>
      <h2 class="title" @click="openExternal(entry.url)">
        <a no-underline>
          {{ entry.title || $t('entry.title.empty') }}
        </a>
      </h2>
      <div class="flex">
        <AuthorButton class="btn" :entry="entry" />
        <PullContentButton class="btn" :entry="entry" @fetch-content="(val) => (fetchedContent = val || '')" />
      </div>
      <div class="my-2 w-full origin-center scale-y-50 border-1px" />
      <blockquote v-if="fetchedContent && fetchedContent !== entry?.content" class="max-h-300px bg-card px-6 uno-scrollbar uno-scrollbar-rounded" v-html="fetchedContent" />
      <article class="entry entry-article entry-article-content" v-html="entry?.content || ''" />
    </div>
  </div>
</template>

<style>
.entry.entry-article.entry-article-content {
  iframe {
    @apply w-full;
  }

  pre {
    @apply uno-scrollbar;
  }

  code {
    @apply font-mono;
  }
}
</style>

<style scoped>
.title {
  @apply hover:(cursor-pointer underline underline-dash);
}

.btn {
  @apply text-xs color-gray hover:(cursor-pointer underline underline-wavy);
}
</style>
