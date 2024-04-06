import stringify from '@soie/utils/query-string/stringify'
import type {
  StringifiableRecord,
  StringifyOptions,
} from '@soie/utils/query-string/types'

type StringifyUrlParams = {
  url: string
  query?: StringifiableRecord
}

export default function stringifyUrl(
  { url, query }: StringifyUrlParams,
  options?: StringifyOptions
) {
  return [url, stringify(query, options)].filter(Boolean).join('?')
}
