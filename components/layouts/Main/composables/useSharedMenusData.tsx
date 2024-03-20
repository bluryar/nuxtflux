import { createSharedComposable } from '@vueuse/core'
import { type MenuOption as NMenuOption, NSkeleton } from 'naive-ui'
import type { MenuDividerOption } from 'naive-ui/lib'
import type { TypedRouteLocationRaw } from '@typed-router'
import MenuLink from '../MenuLink.vue'
import { NuxtLink } from '#components'
import type { ICategory } from '~/models/Category'
import type { Feed, IFeed } from '~/models/Feed'

type MenuOption = NMenuOption & {
  $label?: string
}

const KEY_SPLITTER = '   @   '

const ENTRY_ROUTE_KEY_REG = /^\/(all|categories|feeds)\/(\d+)/

const HOME_ROUTE = {
  name: 'mode-id-entryID',
  params: { mode: 'all', id: 'all' },
} satisfies TypedRouteLocationRaw
const CATEGORIES_IDX = 2
const FEEDS_IDX = 3

function useActiveKey() {
  const router = useRouter()
  const route = useRoute()
  function encodeKey(route: TypedRouteLocationRaw) {
    const { fullPath, name } = router.resolve(route)
    const [, mode, id] = fullPath.match(ENTRY_ROUTE_KEY_REG) || []
    return [name, mode, id].join(KEY_SPLITTER)
  }
  const decodeKey = (key: string) => {
    const [name = '', mode = '', id = ''] = key.split(KEY_SPLITTER)
    return { name, mode, id }
  }
  const activeKey = computed<string>(() => encodeKey(route))
  return {
    encodeKey,
    decodeKey,
    activeKey,
  }
}

function useInitMenu({
  activeKey,
  decodeKey,
  encodeKey,
}: ReturnType<typeof useActiveKey>) {
  const categoriesStore = useCategoriesStore()
  const feedsStore = useFeedsStore()

  const { categories } = storeToRefs(categoriesStore)
  const { feeds, counters } = storeToRefs(feedsStore)
  const { t } = useI18n()

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
      $label: t('menu.index'),
      icon: () => <div class="i-lucide:newspaper"></div>,
      key: encodeKey(HOME_ROUTE),
      extra: allExtra,
    } satisfies MenuOption,
    {
      type: 'divider',
      key: 'divider',
    } satisfies MenuDividerOption,
    {
      label: () => t('menu.category'),
      key: 'categories',
      $label: t('menu.category'),
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
      $label: t('menu.feeds'),
      icon: () => <div class="i-lucide:mailbox"></div>,
      children: [
        {
          key: 'categories-skeleton',
          label: () => (<NSkeleton class="text-1.5rem" />),
        },
      ],
    } satisfies MenuOption,
  ])

  function _filterFeedsByActiveCategory(_feeds: Feed[] | null) {
    const { mode, id } = decodeKey(activeKey.value || '')

    let res = (feeds.value)
    if (mode === 'categories') {
      const target = categories.value?.find(item => String(item.id) === String(id))
      if (target)
        res = _feeds?.filter(feed => feed.category.id === target.id) || feeds.value || []
    }

    return res
  }

  function updateMenus() {
    const categoriesMenus = (toValue(categories) || []).map(transformFactory('categories'))

    const feedsMenus = _filterFeedsByActiveCategory(toValue(feeds)).map(transformFactory('feeds'))

    menus[CATEGORIES_IDX].children = categoriesMenus
    menus[FEEDS_IDX].children = feedsMenus
  }

  function transformFactory(mode: 'categories' | 'feeds') {
    return ({ id, title }: ICategory | IFeed) => {
      const route = {
        name: 'mode-id-entryID',
        params: { id, mode },
      } satisfies TypedRouteLocationRaw

      return {
        key: encodeKey(route),
        $label: title,
        label: () => (<MenuLink to={route} title={title} />),
        extra: mode === 'feeds'
          ? () => feedExtra(id)
          : () => categoryExtra(id),
      } satisfies MenuOption
    }
  }

  return {
    menus,
    updateMenus,
  }
}

export const useSharedMenusData = createSharedComposable(() => {
  const categoriesStore = useCategoriesStore()
  const feedsStore = useFeedsStore()
  const { executeCategories } = categoriesStore
  const { executeAll } = feedsStore
  const { encodeKey, decodeKey, activeKey } = useActiveKey()
  const menuWrapperRef = ref<HTMLDivElement>()

  const {
    menus,
    updateMenus,
  } = useInitMenu({ activeKey, decodeKey, encodeKey })

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

    updateMenus()

    loaded = true
  }

  // 根据路由变化更新菜单 - feeds by active category
  watch(activeKey, updateMenus)

  return {
    menus,
    // 初始化交由外部触发
    init,
    encodeKey,
    menuWrapperRef,
    activeKey,
  }
})
