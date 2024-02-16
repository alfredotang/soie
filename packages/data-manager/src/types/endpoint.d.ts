import type {
  KeyCaseTransformer,
  ProtocolWithoutGQL,
  RestProtocol,
  StorageProtocol,
} from './data-manager'

export type ExecuteType = 'Query' | 'Mutation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Stringifiable = any

type StringifiableRecord = Record<string, Stringifiable>

export type StorageMutationMethod = 'DELETE' | 'UPDATE' | 'CLEAR'
export type RestfulMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type Method = RestfulMethod | StorageMutationMethod
export type ParamsRecord = StringifiableRecord
export type GraphQLParams = {
  query: string
  variables?: Record<string, Stringifiable>
  operationName?: string
}

export type GraphQLEndpoint = {
  path: string
  params: GraphQLParams
  requestInit?: Omit<RequestInit, 'method' | 'body'>
  transformer?: {
    transformResponseToCamelCase?: boolean
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
}

export type MutationRestEndpoint = {
  path: string
  method: RestfulMethod
  params?: ParamsRecord
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
          params: Stringifiable | ParamsRecord
        }
      : M extends 'CLEAR'
        ? object
        : never
