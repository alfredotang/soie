import type {
  Stringifiable,
  StringifiableRecord,
  StringifyOptions,
} from '@soie/utils/query-string/types'
import validation from '@soie/utils/validation'

import { arrayEncoderDict, encode } from './utils'

export default function stringify(
  object: StringifiableRecord | undefined,
  options?: StringifyOptions
) {
  const {
    arrayFormat = 'none',
    arrayFormatSeparator = ',',
    skipEmptyString = false,
    skipNull = false,
  } = options || {}

  validation(
    typeof arrayFormatSeparator === 'string' &&
      arrayFormatSeparator.length === 1,
    'arrayFormatSeparator must be single character string'
  )
  if (!object) {
    return ''
  }

  const shouldFilter = (value: Stringifiable | Stringifiable[]) =>
    (skipNull && value == null) || (skipEmptyString && value === '')

  return Object.entries(object)
    .filter(([, value]) => !shouldFilter(value))
    .map(([key, value]) => {
      if (value === undefined) return ''

      if (value === null) return encode(key)

      if (Array.isArray(value)) {
        if (value.length === 0 && arrayFormat === 'bracket-separator') {
          return encode(key) + '[]'
        }

        const formatter = arrayEncoderDict[arrayFormat || 'none']({
          arrayFormatSeparator,
          skipEmptyString,
          skipNull,
        })

        return value.reduce(formatter(key), []).join('&')
      }

      return `${encode(key)}=${encode(value)}`
    })
    .filter(x => x.length > 0)
    .join('&')
}
