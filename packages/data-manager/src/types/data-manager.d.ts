import type {
  createFetcher,
  createGraphQLFetcher,
  FetcherError,
  FetcherRequestConfig,
  FetcherResult,
} from '@soie/fetcher'
import type { StringifiableRecord } from '@soie/utils/query-string'
import type { TypeSafeAny, TypeSafeAnyRecord } from '@soie/utils/types'

export {
  FetcherError,
  FetcherResult,
  StringifiableRecord,
  TypeSafeAny,
  TypeSafeAnyRecord,
}

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
export type RestfulProtocol = 'Restful'
export type GraphQLProtocol = 'GraphQL'
export type Protocol = StorageProtocol | RestfulProtocol | GraphQLProtocol

export type Controller<T extends Protocol> = T extends 'Restful'
  ? ReturnType<typeof createFetcher>
  : T extends 'GraphQL'
    ? ReturnType<typeof createGraphQLFetcher>
    : T extends StorageProtocol
      ? Storage
      : never
