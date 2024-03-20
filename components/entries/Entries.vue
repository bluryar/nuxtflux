<script setup lang="ts">
import EntriesList from './EntriesList.vue'
import { type Mode, useProvideApiAdapter } from './stores/useApiAdapter'
import { useViewingEntries } from './stores/useViewingEntries'
import { useContentScroll } from './stores/useContentScroll'
import { NuxtPage } from '#components'
import { usePageTransition } from '~/composables/usePageTransition'

const props = withDefaults(
  defineProps<{
    listWidth?: string
    mode: Mode
    id?: number
  }>(),
  {
    listWidth: '360px',
    mode: 'all',
  },
)
const { id, mode } = toRefs(props)

const { listWidth } = toRefs(props)

useProvideApiAdapter({ id, mode })
const { isTransiting } = usePageTransition()

const {
  viewingEntry,
  setViewingEntry,
} = useViewingEntries()
setViewingEntry(null)

const isReading = computed(() => !!viewingEntry.value)
const isSmallThanMD = useSharedBreakpoints().smallerOrEqual('md')

// list 唯一不展示的场景： 屏幕小于md且正在阅读
const isListHidden = computed(() => isSmallThanMD.value && isReading.value)

// content 唯一不展示的场景：屏幕小于md且不在阅读
const isContentHidden = computed(() => isSmallThanMD.value && !isReading.value)

const scrollRef = ref<HTMLDivElement>()
const scrollStore = useContentScroll()

const router = useRouter()

watch(router.currentRoute, (to, from) => {
  if (!scrollRef.value)
    return

  scrollStore.updateScroll(to, from, scrollRef.value)
}, {
  flush: 'pre',
  deep: !!1,
})
</script>

<template>
  <div class="entries">
    <EntriesList v-show="!isListHidden" class="list" />
    <div v-show="!isContentHidden" class="content">
      <div ref="scrollRef" class="h-full w-full overflow-x-hidden uno-scrollbar uno-scrollbar-rounded">
        <NuxtPage
          :entry="viewingEntry"
          :transition="{
            name: 'custom',
            mode: 'out-in',
            onAfterEnter: () => (isTransiting = false),
            onBeforeLeave: () => (isTransiting = true),
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.entries {
  @apply h-full w-full flex;

  .content {
    @apply w-full;
  }
  @screen lt-md {
    .list {
      width: unset;
      width: 60ch;
      margin: 0 auto;
    }
  }

  @screen md {
    .list {
      width: v-bind(listWidth);
    }

    .list {
      @apply h-full shrink-0 grow-0 border-r-1px border-color-border;
    }
  }
}
</style>
