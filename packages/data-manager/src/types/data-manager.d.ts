import type {
  createFetcher,
  createGraphQLFetcher,
  FetcherRequestConfig,
} from '@soie/fetcher'

export type DataManagerConfig = {
  requestConfig?: FetcherRequestConfig

  storagePrefix?: string
  transformer?: KeyCaseTransformer
}

export type KeyCaseTransformer = {
  transformRequestToSnakeCase?: boolean
  transformResponseToCamelCase?: boolean
}

export type StorageProtocol = 'LocalStorage' | 'SessionStorage'
export type HTTPProtocol = 'Restful' | 'GraphQL'
export type Protocol = StorageProtocol | HTTPProtocol

export type Controller<T extends Protocol> = T extends 'Restful'
  ? ReturnType<typeof createFetcher>
  : T extends 'GraphQL'
    ? ReturnType<typeof createGraphQLFetcher>
    : T extends StorageProtocol
      ? Storage
      : never
