import type { components } from '#build/types/nuxt-open-fetch/schemas/miniflux'

export type IIcon = components['schemas']['Icon']

export class Icon implements IIcon {
  id: number
  data: string
  mime_type: string

  constructor(data: IIcon) {
    this.id = data.id
    this.data = data.data
    this.mime_type = data.mime_type
  }

  toPngDataUrl() {
    if (this.mime_type !== 'image/png')
      return this.data.replace(this.mime_type, `data:image/png`)

    return this.data
  }
}
