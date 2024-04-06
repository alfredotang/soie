import type { StringifyOptions } from '@soie/utils/query-string/types'
import type { Stringifiable, StringifiableRecord } from '@soie/utils/types'
import validation from '@soie/utils/validation'

import { arrayEncoderDict, encode } from './utils'

export default function stringify(
  object: Stringifiable | undefined,
  options?: StringifyOptions
) {
  const {
    arrayFormat = 'none',
    arrayFormatSeparator = ',',
    skipEmptyString = false,
    skipNull = false,
  } = {
    arrayFormat: 'none' as StringifyOptions['arrayFormat'],
    arrayFormatSeparator: ',',
    skipNull: false,
    skipEmptyString: false,
    ...options,
  }

  validation(
    typeof arrayFormatSeparator === 'string' &&
      arrayFormatSeparator.length === 1,
    'arrayFormatSeparator must be single character string'
  )
  if (!object) {
    return ''
  }

  const shouldFilter = (key: keyof typeof object) =>
    (skipNull && object[key] == null) || (skipEmptyString && object[key] === '')

  const objectCopy: StringifiableRecord = {}

  Object.entries(object).forEach(([key, value]) => {
    if (!shouldFilter(key as keyof typeof object)) {
      objectCopy[key] = value
    }
  })

  return Object.keys(objectCopy)
    .map(key => {
      const value = objectCopy[key]

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
