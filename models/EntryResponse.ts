import { Entry, type IEntry } from './Entry'

export interface IEntryResponse {
  total: number
  entries: IEntry[]
}

export class EntryResponse {
  total: number
  entries: Entry[]

  constructor(data: IEntryResponse) {
    this.total = data.total
    this.entries = data.entries.map(entry => new Entry(entry))
  }
}
