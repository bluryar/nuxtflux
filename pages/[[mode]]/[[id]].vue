<script setup lang="ts">
import Entries from '@/components/entries/Entries.vue'
import type { Mode } from '~/components/entries/stores/useApiAdapter'

definePageMeta({
  layout: 'main',
  middleware: ['auth'],
})

const route = useRoute()
const router = useRouter()
const params = computed(() => {
  const { matched } = route
  const resolvedParams = {} as {
    mode: Mode
    id?: number | undefined
    entryID?: string | undefined
  }

  for (const item of matched) {
    const { params } = router.resolve(item)
    Object.assign(resolvedParams, params)
  }

  resolvedParams.id = Number(resolvedParams.id)
  return resolvedParams
})

// const id = useRouteParams('id', undefined)
// const mode = useRouteParams('mode', 'all')
</script>

<template>
  <div class="h-full w-full">
    <Entries :id="params.id" class="h-full w-full" :mode="params.mode" />
  </div>
</template>
