import type { TypeSafeAnyRecord } from '@soie/utils/types'

type FetcherResponse = {
  status: number
  statusText: string
  headers: Headers
}

export type FetcherRequestConfig = {
  headers?: HeadersInit
  baseURL?: string
  timeout?: number
}

export type FetcherResult<TResult> = FetcherResponse & {
  data: TResult
}

export type FetcherError = FetcherResponse & {
  message: string | TypeSafeAnyRecord
}

export type GraphQLError = {
  message?: string
  locations?: Array<{ line: number; column: number }>
  path?: string[]
  extensions?: TypeSafeAnyRecord
}

export type GraphQLFetcherError = FetcherError & {
  errors: GraphQLError[]
}
