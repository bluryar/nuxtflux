import { Feed } from './Feed'
import { EntryResponse, type IEntryResponse } from './EntryResponse'
import type { components } from '#build/types/nuxt-open-fetch/schemas/miniflux'

export type IEntry = components['schemas']['Entry']

export class Entry implements IEntry {
  static transformFromResponse(data: IEntryResponse) {
    return new EntryResponse(data)
  }

  id?: number | undefined
  user_id?: number | undefined
  feed_id?: number | undefined
  title?: string | undefined
  url?: string | undefined
  comments_url?: string | undefined
  author?: string | undefined
  content?: string | undefined
  hash?: string | undefined
  published_at?: string | undefined
  created_at?: string | undefined
  status?: string | undefined
  share_code?: string | undefined
  starred?: boolean | undefined
  reading_time?: number | undefined
  enclosures?: Record<string, never>[] | undefined
  feed?: Feed | undefined

  constructor(data: IEntry) {
    this.id = data.id
    this.user_id = data.user_id
    this.feed_id = data.feed_id
    this.title = data.title
    this.url = data.url
    this.comments_url = data.comments_url
    this.author = data.author
    this.content = data.content
    this.hash = data.hash
    this.published_at = data.published_at
    this.created_at = data.created_at
    this.status = data.status
    this.share_code = data.share_code
    this.starred = data.starred
    this.reading_time = data.reading_time
    this.enclosures = data.enclosures
    this.feed = new Feed(data.feed!)
  }
}
