type Stringifiable = string | boolean | number | null | undefined
type StringifiableRecord = Record<
  string,
  Stringifiable | readonly Stringifiable[]
>

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
