import { Entry, type IEntry } from '~/models/Entry'
import { EntryFilter } from '~/models/EntryFilter'

const OFFSET_KEY = 'offset'
const LIMIT_KEY = 'limit'

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 10

export function getDefaultEntryFilter(): EntryFilter {
  return new EntryFilter({
    [OFFSET_KEY]: DEFAULT_OFFSET,
    [LIMIT_KEY]: DEFAULT_LIMIT,
    order: 'published_at',
    direction: 'desc',
  })
}

export const useEntriesStore = defineStore('entry', () => {
  const categoryID = ref<number>()
  const feedID = ref<number>()

  const queryAll = ref<EntryFilter>(getDefaultEntryFilter())
  const queryByCategory = ref<EntryFilter>(getDefaultEntryFilter())
  const queryByFeed = ref<EntryFilter>(getDefaultEntryFilter())

  const {
    data: entries,
    execute: executeEntries,
    refresh: refreshEntries,
    pending: pendingEntries,
  } = useLazyMinifluxFetch('/v1/entries', {
    immediate: false,
    watch: false,
    transform: Entry.transformFromResponse,

    query: queryAll,
  })

  const {
    data: entriesByCategory,
    execute: executeEntriesByCategory,
    refresh: refreshEntriesByCategory,
    pending: pendingEntriesByCategory,
  } = (useLazyMinifluxFetch('/v1/categories/{categoryID}/entries', {
    immediate: false,
    watch: false,
    transform: Entry.transformFromResponse,

    path: {
      categoryID: computed(() => categoryID.value || 0),
    },
    query: queryByCategory,
  }))

  const {
    data: entriesByFeed,
    execute: executeEntriesByFeed,
    refresh: refreshEntriesByFeed,
    pending: pendingEntriesByFeed,
  } = useLazyMinifluxFetch('/v1/feeds/{feedID}/entries', {
    immediate: false,
    watch: false,
    transform: Entry.transformFromResponse,

    query: queryByFeed,
    path: {
      feedID: computed(() => feedID.value || 0),
    },
  })

  const viewingEntry = ref<Entry | null>(null)
  const viewingEntries = shallowRef<Entry[]>([])
  const setViewingEntry = (val: IEntry | null) => viewingEntry.value = (val ? new Entry(val) : null)
  const setViewingEntries = (val: Entry[]) => viewingEntries.value = val
  const findCachedEntries = (id: number) => {
    if (isInValidId(id))
      return null

    return viewingEntries.value.find(entry => entry.id === id)
  }

  return {
    categoryID,
    feedID,

    queryAll,
    queryByCategory,
    queryByFeed,

    entries,
    entriesByCategory,
    entriesByFeed,

    executeEntries,
    executeEntriesByCategory,
    executeEntriesByFeed,

    refreshEntries,
    refreshEntriesByCategory,
    refreshEntriesByFeed,

    pendingEntries,
    pendingEntriesByCategory,
    pendingEntriesByFeed,

    viewingEntry,
    viewingEntries,
    setViewingEntry,
    setViewingEntries,
    findCachedEntries,
  }
})
