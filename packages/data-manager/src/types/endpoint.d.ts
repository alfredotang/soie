import type { Stringifiable, StringifiableRecord } from '@soie/utils/types'

import type { KeyCaseTransformer } from './data-manager'

export type ExecuteType = 'Query' | 'Mutation'
export type { Stringifiable, StringifiableRecord }

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
> = P extends 'GraphQL'
  ? GraphQLEndpoint
  : P extends 'Restful'
    ? RestfulEndpoint<E>
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
