import type {
  KeyCaseTransformer,
  Protocol,
  StringifiableRecord,
  TypeSafeAny,
  TypeSafeAnyRecord,
} from './data-manager'

export type Endpoint<
  P extends Protocol,
  E extends ExecuteType,
> = P extends 'GraphQL'
  ? GraphQLEndpoint
  : P extends 'Restful'
    ? RestfulEndpoint<E>
    : never

export type ExecuteType = 'Query' | 'Mutation'
export type RestfulMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type Method = RestfulMethod

export type StringOrRegExp = string | RegExp

export type KeyCaseTransformExclude = {
  transformRequestExcludes?: StringOrRegExp[]
  transformResponseExcludes?: StringOrRegExp[]
}

export type EndpointTransformer = KeyCaseTransformer & KeyCaseTransformExclude

export type GraphQLEndpoint = {
  path: string
  params: {
    query: string
    variables?: TypeSafeAnyRecord
    operationName?: string
  }
  requestInit?: Omit<RequestInit, 'method' | 'body'>
  transformer?: Pick<
    EndpointTransformer,
    'transformResponseToCamelCase' | 'transformResponseExcludes'
  >
}

export type RestfulEndpoint<E extends ExecuteType> = E extends 'Query'
  ? RestfulEndpoints['query']
  : E extends 'Mutation'
    ? RestfulEndpoints['mutation']
    : never

export type RestfulEndpoints = {
  query: {
    path: string
    params?: StringifiableRecord
    requestInit?: Omit<RequestInit, 'method' | 'body'>
    transformer?: EndpointTransformer
    arrayFormat?:
      | 'bracket'
      | 'index'
      | 'comma'
      | 'separator'
      | 'bracket-separator'
      | 'colon-list-separator'
      | 'none'
    arrayFormatSeparator?: string
  }
  mutation: {
    path: string
    method: RestfulMethod
    params?: TypeSafeAny | FormData
    requestInit?: Omit<RequestInit, 'method' | 'body'>
    transformer?: EndpointTransformer
  }
}
