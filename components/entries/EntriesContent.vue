<script setup lang="ts">
import { format } from '@formkit/tempo'
import type { VNode } from 'vue'
import AuthorButton from './AuthorButton.vue'
import PullContentButton from './PullContentButton.vue'
import StarButton from './StarButton.vue'
import { useViewingEntries } from './stores/useViewingEntries'
import EntryNavTagList from './EntryNavTagList.vue'
import SaveButton from './SaveButton.vue'
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

const replacement = [
  {
    title: 'twitter',
    icon: 'i-logos:twitter',
    prefix: 'https://twitter.com',
  },
  {
    title: 'x',
    icon: 'i-carbon:logo-x',
    prefix: 'https://x.com',
  },
  {
    title: 'Github',
    icon: 'i-mdi:github',
    prefix: 'https://github.com',
  },
  {
    title: 'Youtube',
    icon: 'i-logos:youtube',
    prefix: 'https://youtube.com',
  },
  {
    title: 'Bilibili',
    icon: 'i-ant-design:bilibili-outlined',
    prefix: 'https://bilibili.com',
  },
  {
    title: 'Discord',
    icon: 'i-logos:discord-icon',
    prefix: 'https://discord.com',
  },
  {
    title: 'Zhihu',
    icon: 'i-simple-icons:zhihu',
    prefix: 'https://zhihu.com',
  },
  {
    title: 'Weibo',
    icon: 'i-ant-design:weibo-outlined',
    prefix: 'https://weibo.com',
  },
]

const transformContent = computed(() => {
  const str = entry.value?.content || ''

  // // 提取a标签的href, 然后提取文本, 然后将其余的属性回填, 目的: 为了在a标签内插入icon
  // const reg = /<a\s*((?:.|\n|\r)*?)href="((?:.|\n|\r)*?)"((?:.|\n|\r)*?)>((?:.|\n|\r)*?)<\/a>/g

  // str = str.replace(reg, (match, restAttrs1, url, restAttrs2, text) => {
  //   const item = replacement.find(item => url.startsWith(item.prefix))
  //   if (item)
  //     return `<a ${restAttrs1 || ''} href="${url}" ${restAttrs2 || ''}> <i class="${item.icon} inline-block"></i> ${text} </a>`

  //   return match
  // })

  return str
})

function onContentMounted(vNode: VNode) {
  const el = vNode?.el as HTMLElement | null
  if (!el)
    return

  const allLinks = el.getElementsByTagName('a')

  // 添加icon
  for (const link of allLinks) {
    const href = link.getAttribute('href')
    const item = replacement.find(item => href?.startsWith(item.prefix))
    if (item) {
      const icon = document.createElement('i')
      icon.className = item.icon
      icon.classList.add('inline-block')
      icon.classList.add('m-r-[0.1em]')
      // icon.classList.add('translate-y-.15em')
      link.insertBefore(icon, link.firstChild)
    }
  }
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
    <div v-else class="ctrl-a-selectable relative mx-auto max-w-95ch overflow-hidden font-prose-serif prose">
      <div class="absolute top-0 text-sm text-text3">
        {{ date }}
      </div>

      <h1 class="title mb2 mt5" @click="openExternal(entry.url)">
        <a no-underline class="font-bold" :href="entry.url" @click.prevent>
          {{ entry.title || $t('entry.title.empty') }}
        </a>
      </h1>

      <div v-if="viewingEntry" class="w-full flex flex-wrap items-center gap-y-2 font-sans">
        <AuthorButton class="btn" :entry="viewingEntry" />
        <StarButton class="btn" :entry="viewingEntry" responsive @update-entry="onUpdateEntryStarred" />
        <SaveButton class="btn" :entry="viewingEntry" />
        <PullContentButton class="btn" :entry="viewingEntry" responsive @fetch-content="(val) => (fetchedContent = val || '')" />
        <NDivider vertical />
        <EntryNavTagList show-select :entry="entry" type="default" class="inline-flex" />
      </div>

      <div class="my-2 w-full origin-center scale-y-50 border-1px" />

      <blockquote v-if="fetchedContent && fetchedContent !== entry?.content" class="max-h-300px bg-card px-6 uno-scrollbar uno-scrollbar-rounded" v-html="fetchedContent" />

      <div id="entry-article" class="text-16px">
        <article class="text-1.1em color-text2 font-500 tracking-[0.015em]" @vue:mounted="onContentMounted" v-html="transformContent" />
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

  a[href] {
    color: var(--text-color-2);
    text-decoration: none;
    height: 1.4em;
    margin: 0 0.1em;
    line-height: 100%;
    border-bottom: 1px solid var(--text-color-2);

    &:hover {
      color: var(--text-color-3);
    }
    &:active {
      color: var(--primary-color-pressed);
    }
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
