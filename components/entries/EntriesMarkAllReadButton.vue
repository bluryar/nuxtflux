<script setup lang="ts">
import { useInjectApiAdapter } from './stores/useApiAdapter'

const {
  mode,
  id,
} = useInjectApiAdapter()

const userStore = useUserStore()
const feedsStore = useFeedsStore()

const userId = computed(() => userStore.userInfo?.id)

const {
  execute: executeFeed,
  status: feedStatus,
} = useMinifluxFetch('/v1/feeds/{feedID}/mark-all-as-read', {
  method: 'PUT',
  path: {
    feedID: computed(() => id.value || Number.NaN),
  },
  immediate: false,
  watch: false,
})

const {
  execute: executeCategory,
  status: categoryStatus,
} = useMinifluxFetch('/v1/categories/{categoryID}/mark-all-as-read', {
  method: 'PUT',
  path: {
    categoryID: computed(() => id.value || Number.NaN),
  },
  immediate: false,
  watch: false,
})

const {
  execute: executeUser,
  status: userStatus,
} = useMinifluxFetch(
  '/v1/users/{userID}/mark-all-as-read',
  {
    method: 'PUT',
    path: {
      userID: computed(() => userId.value || Number.NaN),
    },
    immediate: false,
    watch: false,
  },
)

const message = useMessage()
const { t } = useI18n()

const loading = computed(() => userStatus.value === 'pending'
  || categoryStatus.value === 'pending'
  || feedStatus.value === 'pending')

async function onConfirm() {
  const isInvalidFeedOrCategory = isInValidId(id.value) && mode.value !== 'all'
  const isInvalidUser = isInValidId(userId.value) && mode.value === 'all'
  if (isInvalidFeedOrCategory || isInvalidUser) {
    message.warning(`${t('message.submit.fail')}...`)
    return
  }

  let promise: Promise<void> | null = null
  if (mode.value === 'feeds')
    promise = executeFeed()

  else if (mode.value === 'categories')
    promise = executeCategory()

  else if (mode.value === 'all')
    promise = executeUser()

  if (promise) {
    await promise
    message.success(`${t('message.submit.success')}`)
    await feedsStore.executeCounters()
  }
  else {
    message.warning(`${t('message.submit.fail')}...`)
  }
}
</script>

<template>
  <NPopconfirm
    trigger="hover" :positive-button-props="{
      loading,
    }" @positive-click="onConfirm"
  >
    <template #trigger>
      <NButton tertiary circle type="primary">
        <template #icon>
          <div class="i-lucide:check" />
        </template>
      </NButton>
    </template>

    <div>
      {{ $t('feeds.mark.all') }}
    </div>
  </NPopconfirm>
</template>
