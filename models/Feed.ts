import { Category } from './Category'
import type { components } from '#build/types/nuxt-open-fetch/schemas/miniflux'

export type IFeed = components['schemas']['Feed']

export class Feed implements IFeed {
  id: number
  user_id: number
  title: string
  site_url: string
  feed_url: string
  checked_at: string
  etag_header: string
  last_modified_header: string
  parsing_error_message: string
  parsing_error_count: number
  scraper_rules: string
  rewrite_rules: string
  crawler: boolean
  blocklist_rules: string
  keeplist_rules: string
  user_agent: string
  username: string
  password: string
  disabled: boolean
  ignore_http_cache: boolean
  fetch_via_proxy: boolean
  category: Category
  icon: { feed_id: number, icon_id: number }
  next_check_at: string
  urlrewrite_rules: string
  cookie: string
  no_media_player: boolean
  allow_self_signed_certificates: boolean
  hide_globally: boolean
  apprise_service_urls: string

  private $unread_count: number = 0

  constructor(data: IFeed) {
    this.id ||= data.id
    this.user_id ||= data.user_id
    this.title ||= data.title
    this.site_url ||= data.site_url
    this.feed_url ||= data.feed_url
    this.checked_at ||= data.checked_at
    this.etag_header ||= data.etag_header
    this.last_modified_header ||= data.last_modified_header
    this.parsing_error_message ||= data.parsing_error_message
    this.parsing_error_count ||= data.parsing_error_count
    this.scraper_rules ||= data.scraper_rules
    this.rewrite_rules ||= data.rewrite_rules
    this.crawler ||= data.crawler
    this.blocklist_rules ||= data.blocklist_rules
    this.keeplist_rules ||= data.keeplist_rules
    this.user_agent ||= data.user_agent
    this.username ||= data.username
    this.password ||= data.password
    this.disabled ||= data.disabled
    this.ignore_http_cache ||= data.ignore_http_cache
    this.fetch_via_proxy ||= data.fetch_via_proxy
    this.category ||= new Category(data.category!)
    this.icon ||= data.icon
    this.next_check_at ||= data.next_check_at
    this.urlrewrite_rules ||= data.urlrewrite_rules
    this.cookie ||= data.cookie
    this.no_media_player ||= data.no_media_player
    this.allow_self_signed_certificates ||= data.allow_self_signed_certificates
    this.hide_globally ||= data.hide_globally
    this.apprise_service_urls ||= data.apprise_service_urls
  }

  setUnreadCount(count: number) {
    this.$unread_count = count
  }

  getUnreadCount() {
    return this.$unread_count
  }
}
