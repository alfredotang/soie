import type { FetcherResult, GraphQLFetcherError } from '@soie/fetcher'

import type { Controller, Endpoint } from '@/data-manager/types'
import { addGraphqlQueryType, camelCaseTransformer } from '@/data-manager/utils'

const GraphQL = async <TResult>(
  endpoint: Endpoint<'Mutation', 'POST', 'GraphQL'>,
  controller: Controller<'GraphQL'>
): Promise<FetcherResult<TResult>> => {
  try {
    const response = await controller(endpoint.path, {
      ...endpoint.requestInit,
      body: JSON.stringify({
        ...endpoint.params,
        query: addGraphqlQueryType(endpoint.params.query, 'mutation'),
      }),
    })

    return Promise.resolve({
      ...response,
      data: camelCaseTransformer(
        response.data,
        endpoint.transformer?.transformResponseToCamelCase
      ) as TResult,
    })
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

export default GraphQL
