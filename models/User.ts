import type { components } from '#build/types/nuxt-open-fetch/schemas/miniflux'

export type IUser = components['schemas']['User']

export class User implements IUser {
  id: number
  username: string
  is_admin?: boolean
  theme?: string
  language?: string
  timezone?: string
  entry_sorting_direction?: string
  stylesheet?: string
  google_id?: string
  openid_connect_id?: string
  entries_per_page?: number
  keyboard_shortcuts?: boolean
  show_reading_time?: boolean
  entry_swipe?: boolean
  last_login_at?: string

  constructor(data: IUser) {
    this.id = data.id
    this.username = data.username
    this.is_admin = data.is_admin
    this.theme = data.theme
    this.language = data.language
    this.timezone = data.timezone
    this.entry_sorting_direction = data.entry_sorting_direction
    this.stylesheet = data.stylesheet
    this.google_id = data.google_id
    this.openid_connect_id = data.openid_connect_id
    this.entries_per_page = data.entries_per_page
    this.keyboard_shortcuts = data.keyboard_shortcuts
    this.show_reading_time = data.show_reading_time
    this.entry_swipe = data.entry_swipe
    this.last_login_at = data.last_login_at
  }
}
