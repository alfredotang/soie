import type { FetcherResult, GraphQLFetcherError } from '@soie/fetcher'

import type {
  Controller,
  GraphQLEndpoint,
  KeyCaseTransformer,
  Protocol,
} from '@/data-manager/types'
import { camelCaseTransformer } from '@/data-manager/utils'

const GraphQL = async <TResult>(
  endpoint: GraphQLEndpoint,
  controller: Controller<'GraphQL'>
): Promise<FetcherResult<TResult>> => {
  try {
    const response = await controller(endpoint.path, {
      ...endpoint.requestInit,
      body: JSON.stringify(endpoint.params),
    })

    return {
      ...response,
      data: camelCaseTransformer(
        response.data,
        endpoint.transformer?.transformResponseToCamelCase
      ) as TResult,
    }
  } catch (_error) {
    const error = _error as GraphQLFetcherError
    throw {
      ...camelCaseTransformer(
        error,
        endpoint.transformer?.transformResponseToCamelCase
      ),
      headers: error.headers,
    } as GraphQLFetcherError
  }
}

const createGraphQL =
  ({
    controller,
    transformer,
  }: {
    controller: <P extends Protocol>(protocol: P) => Controller<P>
    transformer?: KeyCaseTransformer
  }) =>
  <TResult>(endpoint: GraphQLEndpoint) =>
    GraphQL<TResult>(
      {
        ...endpoint,
        transformer: {
          ...transformer,
          ...endpoint.transformer,
        },
      },
      controller('GraphQL')
    )

export default createGraphQL
