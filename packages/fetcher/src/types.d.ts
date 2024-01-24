type GeneraData = number | string | boolean
type GeneraObj = Record<
  string,
  GeneraData | Array<GeneraData | Record<string, GeneraData>>
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
  message: string | Record<string, GeneraObj>
}

export type GraphQLError = {
  message?: string
  locations?: Array<{ line: number; column: number }>
  path?: string[]
  extensions?: Record<string, GeneraObj>
}

export type GraphQLFetcherError = FetcherError & {
  errors: GraphQLError[]
}
