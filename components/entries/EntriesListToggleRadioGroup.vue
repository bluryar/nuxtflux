<script setup lang="ts">
import type { UnwrapRef } from 'vue'
import { useInjectLoadMore } from './stores/useEntriesLoadMore'

const { t } = useI18n()
const {
  query,
  loadMore,
  init,
} = useInjectLoadMore()

const currentType = ref<UnwrapRef<typeof types>[number]['value']>('all')
const types = computed(() => {
  return [
    {
      value: 'all',
      label: t('entries.filter.all'),
    },
    {
      value: 'unread',
      label: t('entries.filter.unread'),
    },
    {
      value: 'starred',
      label: t('entries.filter.starred'),
    },
  ] as const
})

const scope = effectScope()
onMounted(() => {
  scope.run(() => {
    watch(
      currentType,
      async () => {
        // 每次用户切换类型时，都会重置查询条件
        init()

        if (currentType.value === 'unread')
          query.value.status = 'unread'
        else
          query.value.status = undefined

        if (currentType.value === 'starred')
          query.value.starred = true
        else
          query.value.starred = undefined

        await nextTick()

        loadMore()
      },
    )
  })
})
</script>

<template>
  <n-radio-group
    v-model:value="currentType" size="medium"
  >
    <n-radio-button
      v-for="song in types"
      :key="song.value"
      :value="song.value"
      :label="song.label"
    />
  </n-radio-group>
</template>
