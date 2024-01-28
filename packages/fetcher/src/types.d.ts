// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StringifiableRecord = Record<string, any>

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
  message: string | StringifiableRecord
}

export type GraphQLError = {
  message?: string
  locations?: Array<{ line: number; column: number }>
  path?: string[]
  extensions?: StringifiableRecord
}

export type GraphQLFetcherError = FetcherError & {
  errors: GraphQLError[]
}
