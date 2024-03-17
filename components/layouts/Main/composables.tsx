import { createSharedComposable } from '@vueuse/core'
import { type MenuOption, NSkeleton } from 'naive-ui'
import type { MenuDividerOption } from 'naive-ui/lib'
import type { TypedRouteLocationRaw } from '@typed-router'
import MenuLink from './MenuLink.vue'
import { NuxtLink } from '#components'
import type { ICategory } from '~/models/Category'
import type { IFeed } from '~/models/Feed'

export const useSharedMenusData = createSharedComposable(() => {
  const { t } = useI18n()
  const categoriesStore = useCategoriesStore()
  const feedsStore = useFeedsStore()
  const { executeCategories } = categoriesStore
  const { executeAll } = feedsStore
  const { categories } = storeToRefs(categoriesStore)
  const { feeds, counters } = storeToRefs(feedsStore)

  const router = useRouter()
  const ENTRY_ROUTE_KEY_REG = /^\/(all|categories|feeds)\/(\d+)/

  const HOME_ROUTE = {
    name: 'mode-id-entryID',
    params: { mode: 'all', id: 'all' },
  } satisfies TypedRouteLocationRaw
  const CATEGORIES_IDX = 2
  const FEEDS_IDX = 3

  const allExtra = () => <span>{Object.values(counters.value?.unreads || {}).reduce((acc, val) => acc + val, 0) || ''}</span>
  const feedExtra = (id: number | string) => {
    const num = counters.value?.unreads?.[id]
    return num ? <span>{num}</span> : undefined
  }
  const categoryExtra = (id: number | string) => {
    const list = (toValue(feeds) || []).filter(feed => feed.category.id === id)
    const nums = list.reduce((acc, feed) => {
      const num = counters.value?.unreads?.[feed.id] || 0
      return acc + num
    }, 0)

    return nums ? <span>{nums}</span> : undefined
  }

  const menus = reactive<MenuOption[]>([
  {
    label: () => (
      <NuxtLink to={HOME_ROUTE}>
        {t('menu.index')}
      </NuxtLink>
    ),
    icon: () => <div class="i-lucide:newspaper"></div>,
    key: getKey(HOME_ROUTE),
    extra: allExtra,
  } satisfies MenuOption,
  {
    type: 'divider',
    key: 'divider',
  } satisfies MenuDividerOption,
  {
    label: () => t('menu.category'),
    key: 'categories',
    icon: () => <div class="i-lucide:inbox"></div>,
    children: [
      {
        key: 'categories-skeleton',
        label: () => (<NSkeleton class="text-1.5rem" />),
      },
    ],
  } satisfies MenuOption,
  {
    label: () => t('menu.feeds'),
    key: 'feeds',
    icon: () => <div class="i-lucide:mailbox"></div>,
    children: [
      {
        key: 'categories-skeleton',
        label: () => (<NSkeleton class="text-1.5rem" />),
      },
    ],
  } satisfies MenuOption,
  ])

  function getKey(route: TypedRouteLocationRaw) {
    const { fullPath, name } = router.resolve(route)
    const [,mode, id] = fullPath.match(ENTRY_ROUTE_KEY_REG) || []
    return `${name}-${mode}-${id}`
  }

  function transformFactory(mode: 'categories' | 'feeds') {
    return ({ id, title }: ICategory | IFeed) => {
      const route = {
        name: 'mode-id-entryID',
        params: { id, mode },
      } satisfies TypedRouteLocationRaw

      return {
        key: getKey(route),
        label: () => (<MenuLink to={route} title={title} />),
        extra: mode === 'feeds'
          ? () => feedExtra(id)
          : () => categoryExtra(id),
      } satisfies MenuOption
    }
  }

  let loaded = false
  const init = async () => {
    if (loaded)
      return

    try {
      await Promise.all([
        executeCategories(),
        executeAll(),
        nextTick(),
      ])
    }
    catch (error) {
      console.error('fetch menus fail', error)
      loaded = false
      return
    }

    const categoriesMenus = (toValue(categories) || []).map(transformFactory('categories'))
    const feedsMenus = (toValue(feeds) || []).map(transformFactory('feeds'))

    menus[CATEGORIES_IDX].children = categoriesMenus
    menus[FEEDS_IDX].children = feedsMenus
    loaded = true
  }

  return {
    menus,
    init,
    getKey,
  }
})
