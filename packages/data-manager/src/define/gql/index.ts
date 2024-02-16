import type { FetcherResult, GraphQLFetcherError } from '@soie/fetcher'
import getTypeTag from '@soie/utils/get-type-tag'
import validationFlow from '@soie/utils/validation-flow'

import type {
  Controller,
  GraphQLEndpoint,
  KeyCaseTransformer,
  Protocol,
} from '@/data-manager/types'
import { camelCaseTransformer } from '@/data-manager/utils'

const endpointValidation = (endpoint: GraphQLEndpoint) => {
  validationFlow(
    [endpoint.path, 'path is required'],
    [endpoint.params?.query, 'params.query is required'],
    [
      getTypeTag(endpoint.params?.query) === 'String',
      'params.query should be string',
    ]
  )
}

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
  <TResult>(endpoint: GraphQLEndpoint) => {
    endpointValidation(endpoint)
    return GraphQL<TResult>(
      {
        ...endpoint,
        transformer: {
          ...transformer,
          ...endpoint.transformer,
        },
      },
      controller('GraphQL')
    )
  }

export default createGraphQL
