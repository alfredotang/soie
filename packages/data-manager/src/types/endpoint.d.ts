import type { Stringifiable, StringifiableRecord } from '@soie/utils/types'
import type { StringifiableRecord as QueryStringStringifiableRecord } from 'query-string'

import type { KeyCaseTransformer, StorageProtocol } from './data-manager'

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

export type Endpoint<
  P extends Protocol,
  E extends ExecuteType,
  M extends Method,
> = P extends 'GraphQL'
  ? GraphQLEndpoint
  : P extends 'Restful'
    ? RestfulEndpoint<E>
    : P extends StorageProtocol
      ? StorageEndpoint<E, M>
      : never

export type GraphQLEndpoint = {
  path: string
  params: GraphQLParams
  requestInit?: Omit<RequestInit, 'method' | 'body'>
  transformer?: {
    transformResponseToCamelCase?: boolean
  }
}

export type RestfulEndpoint<E extends ExecuteType> = E extends 'Query'
  ? RestfulEndpoints['query']
  : E extends 'Mutation'
    ? RestfulEndpoints['mutation']
    : never

export type RestfulEndpoints = {
  query: {
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
  mutation: {
    path: string
    method: RestfulMethod
    params?: StringifiableRecord | FormData
    requestInit?: Omit<RequestInit, 'method' | 'body'>
    transformer?: KeyCaseTransformer
  }
}

export type StorageEndpoint<
  E extends ExecuteType,
  M extends StorageMutationMethod,
> = E extends 'Query'
  ? string
  : E extends 'Mutation'
    ? StorageMutationEndpoints<M>
    : never

export type StorageMutationEndpoints<M extends StorageMutationMethod> =
  M extends 'DELETE'
    ? {
        path: string
        method: M
      }
    : M extends 'UPDATE'
      ? {
          path: string
          method: M
          params: Stringifiable | StringifiableRecord
        }
      : M extends 'CLEAR'
        ? { method: M }
        : never
