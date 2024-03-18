import { createSharedComposable } from '@vueuse/core'
import type { Entry } from '~/models/Entry'

export const useViewingEntries = createSharedComposable(
  () => {
    const entriesStore = useEntriesStore()
    const {
      viewingEntry,
      viewingEntries,
    } = storeToRefs(entriesStore)

    return {

      viewingEntry: viewingEntry as Ref<Entry | null>,
      viewingEntries: viewingEntries as Ref<Entry[] | null>,
      setViewingEntry: entriesStore.setViewingEntry,
      setViewingEntries: entriesStore.setViewingEntries,
    }
  },
)
