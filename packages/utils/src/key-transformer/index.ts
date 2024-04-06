import { camelCase, snakeCase } from '@soie/utils/change-case'
import getTypeTag from '@soie/utils/get-type-tag'

type ChangeCase = 'camelcase' | 'snakecase'
type StringOrRegExp = string | RegExp
export type Options = {
  changeCase?: ChangeCase
  excludes?: Array<StringOrRegExp>
  enabled?: boolean
}

const isObject = (value: unknown) => getTypeTag(value) === 'Object'

const isMatchedExclude = (key: string, excludes: Array<StringOrRegExp>) => {
  if (!excludes?.length) return false

  return excludes.some(item => {
    const reg = new RegExp(item)
    return reg.test(key)
  })
}

const transform = <T>({
  input,
  changer,
  excludes,
}: {
  input: T
  changer: (input: string) => string
  excludes: Array<StringOrRegExp>
}): T => {
  if (Array.isArray(input)) {
    return input.map(item => transform({ input: item, changer, excludes })) as T
  }

  if (isObject(input)) {
    const result: Record<string, unknown> = {}

    Object.entries(input as object).forEach(([key, value]) => {
      if (isObject(value) || Array.isArray(value)) {
        value = transform({ input: value, changer, excludes })
      }
      const newKey = isMatchedExclude(key, excludes) ? key : changer(key)
      result[newKey] = value
    })

    return result as T
  }

  return input
}

export default function keyTransFormer<T>(input: T, options: Options) {
  const { changeCase = '', enabled = true, excludes = [] } = options

  if (!enabled || !changeCase) return input

  return transform({
    input,
    excludes,
    changer: changeCase === 'camelcase' ? camelCase : snakeCase,
  })
}
