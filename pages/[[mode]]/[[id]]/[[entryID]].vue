<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import EntriesContent from '@/components/entries/EntriesContent.vue'
import { Entry } from '~/models/Entry'
import { isInValidId } from '~/utils/is'

/**
 * 路由传参
 */
const props = defineProps<{
  entry: Entry | null
}>()

definePageMeta({
  layout: 'main',
  middleware: ['auth'],

  key(route) {
    const obj = route.params as { mode: string, id: string, entry: string }
    return `entries-${obj.mode}-${obj.id}-${obj.entry}`
  },
})

const resolvedData = shallowRef<Entry | null>(null)

const entryID = useRouteParams('entryID', undefined, { transform: (val) => {
  if (val === '')
    return Number.NaN

  return Number(val)
} })

const { $minifluxFetch } = useNuxtApp()
const entriesStore = useEntriesStore()

const {
  data,
  execute,
  // pending,
} = useAsyncData(
  `entry-by-id-${entryID.value}`,
  () => {
    const target = entriesStore.findCachedEntries(entryID.value)
    if (target)
      return Promise.resolve(target)

    const promise = $minifluxFetch(`/v1/entries/{entryID}`, {
      path: {
        entryID: entryID.value,
      },

    }).then(res => new Entry(res))

    return promise
  },
  {
    watch: [],
    immediate: false,
  },
)

watchEffect(() => {
  resolvedData.value = data.value || props.entry
  if (isInValidId(toValue(entryID)))
    resolvedData.value = null
})

watch(entryID, async (val) => {
  if (!isInValidId(val))
    await execute()
  else
    entriesStore.setViewingEntry(null)
}, { immediate: !!1, flush: 'post' })
</script>

<template>
  <div class="h-full w-full">
    <EntriesContent :entry="resolvedData" class="h-full w-full" />
  </div>
</template>
