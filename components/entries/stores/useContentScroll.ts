import type { TypedRoute } from '@typed-router'
import { createSharedComposable } from '@vueuse/core'
import type { RouteLocationNamedRaw, RouteLocationNormalized } from 'vue-router'
import type { Mode } from '~/components/entries/stores/useApiAdapter'

export interface ScrollOption extends ScrollToOptions {
  el: HTMLElement | null
  left: number
  top: number
}

type Key = string
type Route = TypedRoute | RouteLocationNormalized

export const useContentScroll = createSharedComposable(() => {
  const map = ref(new Map<Key, ScrollOption>())

  const updateScroll = (to: Route, from: Route, el: ScrollOption['el']) => {
    const toKey = getKey(to)
    const fromKey = getKey(from)

    cacheOldScroll(fromKey, map, el)
    applyNewScroll(toKey, map, el)
  }

  return {
    updateScroll,
  }
})

function getKey(to: Route) {
  const params = to.params as { mode: Mode, id: string, entryID: string }
  return [to.name, params.mode, params.id, params.entryID].join(' @ ')
}

function applyNewScroll(toKey: Key, map: Ref<Map<Key, ScrollOption>>, el: ScrollOption['el']) {
  if (!toKey)
    return

  if (!map.value.has(toKey)) {
    map.value.set(toKey, {
      el,
      top: 0,
      left: 0,
    })
  }

  const { el: targetEl, left, top, behavior } = map.value.get(toKey) || {}
  if (!targetEl)
    return

  targetEl.scrollTo({
    left,
    top,
    behavior,
  })
}

function cacheOldScroll(fromKey: Key, map: Ref<Map<Key, ScrollOption>>, el: ScrollOption['el']) {
  if (!fromKey)
    return

  let opt = map.value.get(fromKey)

  if (!opt) {
    opt = {
      el,
      left: 0,
      top: 0,
    }

    map.value.set(fromKey, opt)
  }

  opt.left = opt.el?.scrollLeft || 0
  opt.top = opt.el?.scrollTop || 0
}
