import type {
  createFetcher,
  createGraphQLFetcher,
  FetcherError,
  FetcherRequestConfig,
} from '@soie/fetcher'
import type { Options as KeyTransformerOptions } from '@soie/utils/key-transformer'

export { FetcherError, KeyTransformerOptions }

export type DataManagerConfig = {
  requestConfig?: FetcherRequestConfig
  storagePrefix?: string
  transformer?: KeyCaseTransformer
}

export type KeyCaseTransformer = {
  request?: KeyTransformerOptions
  response?: KeyTransformerOptions
}

export type StorageProtocol = 'LocalStorage' | 'SessionStorage'
export type RestProtocol = 'Restful'
export type GraphQLProtocol = 'GraphQL'
export type Protocol = StorageProtocol | RestProtocol | GraphQLProtocol
export type ProtocolWithoutGQL = StorageProtocol | RestProtocol

export type Controller<T extends Protocol> = T extends 'Restful'
  ? ReturnType<typeof createFetcher>
  : T extends 'GraphQL'
    ? ReturnType<typeof createGraphQLFetcher>
    : T extends StorageProtocol
      ? Storage
      : never
