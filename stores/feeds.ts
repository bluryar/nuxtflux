import { Feed, type IFeed } from '~/models/Feed'

export const useFeedsStore = defineStore('feed', () => {
  const categoryID = ref<number>()

  const {
    data: feeds,
    execute: executeFeeds,
    refresh: refreshFeeds,
    pending: pendingFeeds,
  } = useLazyMinifluxFetch('/v1/feeds', {
    immediate: false,
    watch: false,
    transform: (data: IFeed[]) => data.map(i => (new Feed(i))),
  })
  const {
    data: counters,
    execute: executeCounters,
    refresh: refreshCounters,
    pending: pendingCounters,
  } = useLazyMinifluxFetch('/v1/feeds/counters', {
    watch: false,
    immediate: false,
  })
  const {
    data: feedsPartial,
    execute: executeFeedsPartial,
    refresh: refreshFeedsPartial,
    pending: pendingFeedsPartial,
  } = useLazyMinifluxFetch('/v1/categories/{categoryID}/feeds', {
    immediate: false,
    watch: false,
    path: {
      categoryID: computed(() => categoryID.value || Number.NaN),
    },
  })

  const data = computed(() => {
    return {
      feeds: feeds.value,
      counters: counters.value,
    }
  })
  const pendingAll = computed(() => pendingFeeds.value || pendingCounters.value)

  const executeAll = async () => {
    await Promise.all([executeFeeds(), executeCounters()])
  }
  const refreshAll = async () => {
    await Promise.all([refreshFeeds(), refreshCounters()])
  }

  const executeBy = (id?: IFeed['id']) => {
    if (typeof id === 'undefined') {
      executeFeeds()
      return
    }
    categoryID.value = id
    executeFeedsPartial()
  }
  const refreshBy = (id?: IFeed['id']) => {
    if (typeof id === 'undefined') {
      refreshFeeds()
      return
    }
    categoryID.value = id
    refreshFeedsPartial()
  }

  return {
    data,
    feeds,
    counters,
    feedsPartial,

    executeFeeds,
    executeCounters,
    executeFeedsPartial,
    executeAll,
    executeBy,

    refreshCounters,
    refreshFeedsPartial,
    refreshAll,
    refreshBy,

    pendingAll,
    pendingFeeds,
    pendingCounters,
    pendingFeedsPartial,
  }
})
