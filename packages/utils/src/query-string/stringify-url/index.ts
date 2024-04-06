import stringify from '@soie/utils/query-string/stringify'
import type { StringifyOptions } from '@soie/utils/query-string/types'
import type { StringifiableRecord } from '@soie/utils/types'

export default function stringifyUrl({
  url,
  query,
  options,
}: {
  url: string
  query?: StringifiableRecord
  options?: StringifyOptions
}) {
  return [url, stringify(query, options)].filter(Boolean).join('?')
}
