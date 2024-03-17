export interface IEntryFilter {
  /**
   * Entry status (read, unread, or removed).
   * This option can be repeated to filter by multiple statuses.
   */
  status?: 'read' | 'unread' | 'removed'

  /**
   * Pagination offset.
   */
  offset?: number

  /**
   * Limit of entries to retrieve.
   */
  limit?: number

  /**
   * Ordering field.
   */
  order?: 'id' | 'status' | 'published_at' | 'category_title' | 'category_id'

  /**
   * Ordering direction.
   */
  direction?: 'asc' | 'desc'

  /**
   * Filter entries before this Unix timestamp.
   */
  before?: number

  /**
   * Filter entries after this Unix timestamp.
   */
  after?: number

  /**
   * Filter entries published before this Unix timestamp.
   */
  published_before?: number

  /**
   * Filter entries published after this Unix timestamp.
   */
  published_after?: number

  /**
   * Filter entries changed before this Unix timestamp.
   */
  changed_before?: number

  /**
   * Filter entries changed after this Unix timestamp.
   */
  changed_after?: number

  /**
   * Filter entries before this entry ID.
   */
  before_entry_id?: number

  /**
   * Filter entries after this entry ID.
   */
  after_entry_id?: number

  /**
   * Filter by starred status.
   */
  starred?: boolean

  /**
   * Text search query.
   */
  search?: string

  /**
   * Filter by category ID.
   */
  category_id?: number
}
export class EntryFilter implements IEntryFilter {
  status?: 'read' | 'unread' | 'removed'
  offset?: number
  limit?: number
  order?: 'id' | 'status' | 'published_at' | 'category_title' | 'category_id'
  direction?: 'asc' | 'desc'
  before?: number
  after?: number
  published_before?: number
  published_after?: number
  changed_before?: number
  changed_after?: number
  before_entry_id?: number
  after_entry_id?: number
  starred?: boolean
  search?: string
  category_id?: number

  constructor(data: IEntryFilter) {
    this.status = data.status
    this.offset = data.offset
    this.limit = data.limit
    this.order = data.order
    this.direction = data.direction
    this.before = data.before
    this.after = data.after
    this.published_before = data.published_before
    this.published_after = data.published_after
    this.changed_before = data.changed_before
    this.changed_after = data.changed_after
    this.before_entry_id = data.before_entry_id
    this.after_entry_id = data.after_entry_id
    this.starred = data.starred
    this.search = data.search
    this.category_id = data.category_id
  }
}
