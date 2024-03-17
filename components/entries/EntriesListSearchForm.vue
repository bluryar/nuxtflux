<script setup lang="ts">
import { useInjectLoadMore } from './stores/useEntriesLoadMore'
import type { EntryFilter } from '~/models/EntryFilter'

const {
  loadMore,
  query,
  init,
  loadingMore,
} = useInjectLoadMore()

const cloneFn = (val: MaybeRef<EntryFilter>): EntryFilter => JSON.parse(JSON.stringify(toValue(val)))

const search = computed({
  get: () => query.value.search || '',
  set: (val) => {
    query.value.search = val
  },
})

async function onSearch() {
  await nextTick()
  const oldQuery = cloneFn(query)

  init()
  await nextTick()

  query.value.search = oldQuery.search

  return loadMore()
}
</script>

<template>
  <NForm class="flex flex-col">
    <div class="flex">
      <NInput
        v-model:value="search"
        clearable
        :loading="loadingMore"
        :placeholder="$t('entry.form.search.placeholder')"
        @keyup.enter="onSearch"
        @clear="onSearch"
      >
        <template #prefix>
          <span class="i-lucide:search color-icon" />
        </template>
      </NInput>
    </div>
  </NForm>
</template>
