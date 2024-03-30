<script setup lang="ts">
import type { SelectOption, SelectProps } from 'naive-ui'
import type { Entry, IEntry } from '~/models/Entry'

const props = withDefaults(
  defineProps<{
    entry?: IEntry | null
  }>(),
  {
  },
)

const feedsStore = useFeedsStore()
const categoriesStore = useCategoriesStore()
const currentFeeds = computed(() => {
  return props.entry?.feed
})
const currentCategory = computed(() => {
  return currentFeeds.value?.category
})
const newCategoryId = ref(currentCategory.value?.id)

const options = computed(() => categoriesStore.categories!.map((item) => {
  return {
    label: item.title,
    value: item.id,
  } satisfies SelectOption
}))

const msg = useMessage()
const { t } = useI18n()

const { execute, status } = useLazyMinifluxFetch('/v1/feeds/{feedID}', {
  method: 'PUT',
  path: {
    feedID: computed(() => props.entry?.feed_id || Number.NaN) as Ref,
  },
  body: computed(() => {
    return {
      category_id: newCategoryId.value,
    }
  }) as Ref,
  immediate: false,
  watch: false,
})

const loading = computed(() => status.value === 'pending')

const onChange: SelectProps['onChange'] = async (
  val,
) => {
  newCategoryId.value = val as number
  await nextTick()
  await execute()

  msg.success(t('category_changed'))

  await Promise.all([
    feedsStore.executeFeeds(),
    categoriesStore.executeCategories(),
    nextTick(),
  ])
}
</script>

<template>
  <NSelect
    size="tiny"
    :loading="loading"
    :consistent-menu-width="false"
    :options="options"
    :default-value="currentCategory?.id"
    @change="onChange"
  />
</template>
