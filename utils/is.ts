import { isNil } from 'lodash-es'

export function isInValidId(val?: number) {
  return isNil(val) || Number.isNaN(val) || !Number.isFinite(val)
}
