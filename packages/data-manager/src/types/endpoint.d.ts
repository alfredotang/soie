import type { Stringifiable, StringifiableRecord } from '@soie/utils/types'
import type { StringifiableRecord as QueryStringStringifiableRecord } from 'query-string'

import type {
  KeyCaseTransformer,
  ProtocolWithoutGQL,
  RestProtocol,
  StorageProtocol,
} from './data-manager'

export type ExecuteType = 'Query' | 'Mutation'
export type {
  QueryStringStringifiableRecord,
  Stringifiable,
  StringifiableRecord,
}

export type StorageMutationMethod = 'DELETE' | 'UPDATE' | 'CLEAR'
export type RestfulMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type Method = RestfulMethod | StorageMutationMethod
export type GraphQLParams = {
  query: string
  variables?: StringifiableRecord
  operationName?: string
}

export type GraphQLEndpoint = {
  path: string
  params: GraphQLParams
  requestInit?: Omit<RequestInit, 'method' | 'body'>
  transformer?: {
    response: KeyCaseTransformer['response']
  }
}

export type Endpoint<
  E extends ExecuteType,
  M extends Method,
  P extends ProtocolWithoutGQL = RestProtocol,
> = EndpointExecutor<E, P, M>

export type EndpointExecutor<
  E extends ExecuteType,
  P extends ProtocolWithoutGQL,
  M extends Method,
> = E extends 'Query'
  ? QueryProtocolEndpoint<P>
  : E extends 'Mutation'
    ? MutationProtocolEndpoint<P, M>
    : never

export type QueryProtocolEndpoint<P extends ProtocolWithoutGQL> =
  P extends RestProtocol
    ? QueryEndpoints['restful'] & { protocol?: P }
    : P extends StorageProtocol
      ? QueryEndpoints['storage'] & { protocol: P }
      : never

export type MutationProtocolEndpoint<
  P extends ProtocolWithoutGQL,
  M extends Method,
> = P extends RestProtocol
  ? MutationRestEndpoint & { protocol?: P; method: M }
  : P extends StorageProtocol
    ? M extends StorageMutationMethod
      ? MutationStorageEndpoints<M> & { protocol: P; method: M }
      : never
    : never

export type QueryEndpoints = {
  restful: {
    path: string
    params?: QueryStringStringifiableRecord
    requestInit?: Omit<RequestInit, 'method' | 'body'>
    transformer?: KeyCaseTransformer
    arrayFormat?:
      | 'bracket'
      | 'index'
      | 'comma'
      | 'separator'
      | 'bracket-separator'
      | 'colon-list-separator'
      | 'none'
  }
  storage: {
    path: string
  }
}

export type MutationRestEndpoint = {
  path: string
  method: RestfulMethod
  params?: StringifiableRecord | FormData
  requestInit?: Omit<RequestInit, 'method' | 'body'>
  transformer?: KeyCaseTransformer
}

export type MutationStorageEndpoints<M extends StorageMutationMethod> =
  M extends 'DELETE'
    ? {
        path: string
      }
    : M extends 'UPDATE'
      ? {
          path: string
          params: Stringifiable | StringifiableRecord
        }
      : M extends 'CLEAR'
        ? object
        : never
