import type {
  KeyCaseTransformer,
  Protocol,
  StorageProtocol,
} from './data-manager'

export type ExecuteType = 'Query' | 'Mutation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StringifiableRecord = Record<string, any>

export type StorageMutationMethod = 'DELETE' | 'UPDATE' | 'CLEAR'
export type RestfulMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type Method = RestfulMethod | StorageMutationMethod
export type ParamsRecord = StringifiableRecord
export type GraphQLParams = {
  query: string
  variables?: Record<string, unknown>
  operationName?: string
}

export type Endpoint<
  E extends ExecuteType,
  M extends Method,
  P extends Protocol = 'Restful',
> = EndpointExecutor<E, P, M>

export type EndpointExecutor<
  E extends ExecuteType,
  P extends Protocol,
  M extends Method,
> = E extends 'Query'
  ? QueryProtocolEndpoint<P>
  : E extends 'Mutation'
    ? MutationProtocolEndpoint<P, M>
    : never

export type QueryProtocolEndpoint<P extends Protocol> = P extends 'Restful'
  ? QueryEndpoints['restful'] & { protocol?: P }
  : P extends StorageProtocol
    ? QueryEndpoints['storage'] & { protocol: P }
    : P extends 'GraphQL'
      ? QueryEndpoints['graphql'] & { protocol: P }
      : never

export type MutationProtocolEndpoint<
  P extends Protocol,
  M extends Method,
> = P extends 'Restful'
  ? MutationEndpoints['restful'] & { protocol?: P; method: M }
  : P extends 'GraphQL'
    ? MutationEndpoints['graphql'] & { protocol: P }
    : P extends StorageProtocol
      ? M extends StorageMutationMethod
        ? MutationStorageEndpoints<M> & { protocol: P; method: M }
        : never
      : never

export type QueryEndpoints = {
  restful: {
    path: string
    params?: ParamsRecord
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
  graphql: {
    path: string
    params: GraphQLParams
    requestInit?: Omit<RequestInit, 'method' | 'body'>
    transformer?: {
      transformResponseToCamelCase?: boolean
    }
  }
}

export type MutationEndpoints = {
  restful: {
    path: string
    method: RestfulMethod
    params?: ParamsRecord
    requestInit?: Omit<RequestInit, 'method' | 'body'>
    transformer?: KeyCaseTransformer
  }
  graphql: {
    path: string
    params: GraphQLParams
    requestInit?: Omit<RequestInit, 'method' | 'body'>
    transformer?: {
      transformResponseToCamelCase?: boolean
    }
  }
}

export type MutationStorageEndpoints<M extends StorageMutationMethod> =
  M extends 'DELETE'
    ? {
        path: string
      }
    : M extends 'UPDATE'
      ? {
          path: string
          params: Stringifiable | ParamsRecord
        }
      : M extends 'CLEAR'
        ? object
        : never
