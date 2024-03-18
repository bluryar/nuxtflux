import { createInjectionState } from '@vueuse/core'
import type { Entry } from '~/models/Entry'

export type Mode = 'all' | 'feeds' | 'categories'

type EntryRes = {
  total: number
  entries: Entry[]
} | null

const [
  useProvideApiAdapter,
  _useInjectApiAdapter,
] = createInjectionState((init: {
  id: Ref<number | undefined>
  mode: Ref<Mode>
}) => {
  const mode = ref<Mode>('all')

  const entriesStore = useEntriesStore()
  const {
    categoryID,
    feedID,

    queryAll,
    queryByCategory,
    queryByFeed,

    entries: entriesAll,
    entriesByCategory,
    entriesByFeed,

    pendingEntries,
    pendingEntriesByCategory,
    pendingEntriesByFeed,
  } = storeToRefs(entriesStore)

  const entries = computed<EntryRes>({
    get() {
      return {
        all: entriesAll.value as EntryRes,
        feeds: entriesByFeed.value as EntryRes,
        categories: entriesByCategory.value as EntryRes,
      }[mode.value]
    },
    set(val) {
      const target = {
        all: entriesAll,
        feeds: entriesByFeed,
        categories: entriesByCategory,
      }[mode.value]

      target.value = val
    },
  })

  const loading = computed(() => {
    return {
      all: pendingEntries.value,
      feeds: pendingEntriesByFeed.value,
      categories: pendingEntriesByCategory.value,
    }[mode.value]
  })

  const query = computed({
    get() {
      return {
        all: queryAll.value,
        feeds: queryByFeed.value,
        categories: queryByCategory.value,
      }[mode.value]
    },
    set(val) {
      const target = {
        all: queryAll,
        feeds: queryByFeed,
        categories: queryByCategory,
      }[mode.value]

      target.value = val
    },
  })

  const execute = () => {
    const target = {
      all: entriesStore.executeEntries,
      feeds: entriesStore.executeEntriesByFeed,
      categories: entriesStore.executeEntriesByCategory,
    }[mode.value]

    return target()
  }

  const refresh = () => {
    const target = {
      all: entriesStore.refreshEntries,
      feeds: entriesStore.refreshEntriesByFeed,
      categories: entriesStore.refreshEntriesByCategory,
    }[mode.value]

    return target()
  }
  const id = computed<number | undefined>({
    set(val) {
      const target = {
        all: undefined,
        feeds: feedID,
        categories: categoryID,
      }[mode.value]

      if (target)
        target.value = val
    },
    get() {
      const target = {
        all: undefined,
        feeds: feedID,
        categories: categoryID,
      }[mode.value]

      if (target)
        return target.value
    },
  })

  const setId = (val?: number) => id.value = val
  const setMode = (val: Mode) => mode.value = val

  watchEffect(() => {
    setId(init.id.value)
  })
  watchEffect(() => {
    setMode(init.mode.value)
  })

  return {
    mode,
    id,

    entries,
    loading,
    query,
    execute,
    refresh,
  }
})

function useInjectApiAdapter() {
  const state = _useInjectApiAdapter()

  if (!state)
    throw new Error('_useInjectApiAdapter() is called without provider')

  return state
}

export { useProvideApiAdapter, useInjectApiAdapter }
