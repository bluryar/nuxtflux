import type { components } from '#build/types/nuxt-open-fetch/schemas/miniflux'

export type ICategory = components['schemas']['Category']

export class Category implements ICategory {
  id: number
  user_id: number
  title: string
  hide_globally: boolean
  private $unread_count: number = 0

  constructor(data: ICategory) {
    this.id = data.id
    this.user_id = data.user_id
    this.title = data.title
    this.hide_globally = data.hide_globally
  }

  setUnreadCount(count: number) {
    this.$unread_count = count
  }

  getUnreadCount() {
    return this.$unread_count
  }
}
