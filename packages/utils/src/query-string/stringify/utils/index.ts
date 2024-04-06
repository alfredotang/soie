import type {
  ArrayFormat,
  StringifyOptions,
} from '@soie/utils/query-string/types'
import type { Stringifiable } from '@soie/utils/types'

export const encode = (input: Stringifiable) =>
  encodeURIComponent(input as string).replaceAll(
    /[!'()*]/g,
    x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`
  )

const shouldSkip = (
  value: unknown,
  { skipEmptyString, skipNull }: StringifyOptions
) => {
  return (
    value === undefined ||
    (skipNull && value === null) ||
    (skipEmptyString && value === '')
  )
}

export const arrayEncoderDict: Record<
  ArrayFormat,
  (
    options: StringifyOptions | undefined
  ) => (
    key: string
  ) => (collection: string[], value: Stringifiable, index: number) => string[]
> = {
  index({ skipEmptyString, skipNull }: StringifyOptions = {}) {
    return (key: string) =>
      (collection: string[], value: Stringifiable, _index: number) => {
        const index = collection.length
        if (shouldSkip(value, { skipEmptyString, skipNull })) {
          return collection
        }

        if (value === null) {
          return [...collection, `${encode(key)}[${index}]`]
        }

        return [...collection, `${encode(key)}[${index}]=${encode(value)}`]
      }
  },
  bracket({ skipEmptyString, skipNull }: StringifyOptions = {}) {
    return (key: string) =>
      (collection: string[], value: Stringifiable, _index: number) => {
        if (shouldSkip(value, { skipEmptyString, skipNull })) {
          return collection
        }

        if (value === null) {
          return [...collection, `${encode(key)}[]`]
        }

        return [...collection, `${encode(key)}[]=${encode(value)}`]
      }
  },
  comma({ skipEmptyString, skipNull }: StringifyOptions = {}) {
    return (key: string) =>
      (collection: string[], value: Stringifiable, _index: number) => {
        if (shouldSkip(value, { skipEmptyString, skipNull })) {
          return collection
        }
        const _value = value === null ? '' : value

        if (!collection.length) {
          return [`${encode(key)}=${encode(_value)}`]
        }

        return [[collection, encode(_value)].join(',')]
      }
  },
  separator({
    arrayFormatSeparator = ',',
    skipEmptyString,
    skipNull,
  }: StringifyOptions = {}) {
    return (key: string) =>
      (collection: string[], value: Stringifiable, _index: number) => {
        if (shouldSkip(value, { skipEmptyString, skipNull })) {
          return collection
        }
        const _value = value === null ? '' : value

        if (!collection.length) {
          return [`${encode(key)}=${encode(_value)}`]
        }

        return [[collection, encode(_value)].join(arrayFormatSeparator)]
      }
  },
  'bracket-separator'({
    arrayFormatSeparator = ',',
    skipEmptyString,
    skipNull,
  }: StringifyOptions = {}) {
    return (key: string) =>
      (collection: string[], value: Stringifiable, _index: number) => {
        if (shouldSkip(value, { skipEmptyString, skipNull })) {
          return collection
        }
        const _value = value === null ? '' : value

        if (!collection.length) {
          return [`${encode(key)}[]=${encode(_value)}`]
        }

        return [[collection, encode(_value)].join(arrayFormatSeparator)]
      }
  },
  'colon-list-separator'({ skipEmptyString, skipNull }: StringifyOptions = {}) {
    return (key: string) =>
      (collection: string[], value: Stringifiable, _index: number) => {
        if (shouldSkip(value, { skipEmptyString, skipNull })) {
          return collection
        }

        if (value === null) {
          return [...collection, `${encode(key)}:list=`]
        }

        return [...collection, `${encode(key)}:list=${encode(value)}`]
      }
  },
  none({ skipEmptyString, skipNull }: StringifyOptions = {}) {
    return (key: string) =>
      (collection: string[], value: Stringifiable, _index: number) => {
        if (shouldSkip(value, { skipEmptyString, skipNull })) {
          return collection
        }

        if (value === null) {
          return [...collection, encode(key)]
        }

        return [...collection, `${encode(key)}=${encode(value)}`]
      }
  },
}
