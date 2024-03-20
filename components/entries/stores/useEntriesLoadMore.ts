import type { WritableComputedRef } from 'vue'
import { createInjectionState } from '@vueuse/core'
import { DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_TOTAL, LIMIT_KEY, OFFSET_KEY, TOTAL_KEY } from '../constant'
import type { Entry } from '~/models/Entry'
import type { EntryFilter } from '~/models/EntryFilter'
import type { EntryResponse } from '~/models/EntryResponse'
import { getDefaultEntryFilter } from '~/stores/entries'

type WritableRef<T> = Ref<T> | WritableComputedRef<T>

const [useProvideLoadMore, _useInjectLoadMore] = createInjectionState((options: {
  data: WritableRef<EntryResponse | null>
  execute: () => Promise<void>
  refresh: () => Promise<void>
  pending: Ref<boolean>
  query: Ref<EntryFilter>
}) => {
  const {
    query: _query,
    data: _data,
    execute: _execute,
    refresh: _refresh,
  } = options

  const isFirstRequest = ref(true)
  const list = ref([]) as Ref<Entry[]>
  const loadingMore = ref(false)
  const editingQuery = ref(getDefaultEntryFilter()) as Ref<EntryFilter>

  const total = computed(() => _data.value?.[TOTAL_KEY] ?? DEFAULT_TOTAL)
  const noMore = computed(() =>
    !isFirstRequest.value
    && toValue(total) >= 0
    && list.value.length >= toValue(total),
  )

  const _getOffset = () => editingQuery.value[OFFSET_KEY] || DEFAULT_OFFSET
  const _getLimit = () => editingQuery.value[LIMIT_KEY] || DEFAULT_LIMIT
  const _setOffset = (val: number) => editingQuery.value[OFFSET_KEY] = val
  const _setLimit = (val: number) => editingQuery.value[LIMIT_KEY] = val
  const _syncQuery = () => _query.value = editingQuery.value

  const init = () => {
    isFirstRequest.value = true

    editingQuery.value = getDefaultEntryFilter()

    _data.value = { total: 0, entries: [] }
    list.value = []

    _syncQuery()
  }

  const loadMore = async () => {
    if (noMore.value)
      return

    try {
      loadingMore.value = true
      _syncQuery()

      await _execute()

      isFirstRequest.value = false

      // concat entries
      const entries = _data.value?.entries || []
      list.value = [
        ...list.value,
        ...entries,
      ]

      // update query
      _setOffset(_getOffset() + _getLimit())
    }
    finally {
      loadingMore.value = false
    }
  }

  return {
    ...options,

    isFirstRequest,
    loadingMore,
    list,
    noMore,
    loadMore,
    init,
    total,

    // rewrite query reference
    query: editingQuery,
  }
},
)

function useInjectLoadMore() {
  const state = _useInjectLoadMore()

  if (!state)
    throw new Error('_useInjectLoadMore() is called without provider')

  return state
}

export { useProvideLoadMore, useInjectLoadMore }
