import { Category, type ICategory } from '~/models/Category'

export const useCategoriesStore = defineStore('category', () => {
  const {
    data: categories,
    execute: executeCategories,
    refresh: refreshCategories,
    error: errorCategories,
    pending: pendingCategories,
  } = useLazyMinifluxFetch('/v1/categories', {
    immediate: false,
    transform: (data: ICategory[]) => data.map(i => (new Category(i))),
  })

  return {
    categories,
    executeCategories,
    refreshCategories,
    errorCategories,
    pendingCategories,
  }
})
