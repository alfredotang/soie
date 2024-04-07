import type { FetcherResult, GraphQLFetcherError } from '@soie/fetcher'
import getTypeTag from '@soie/utils/get-type-tag'
import keyTransformer from '@soie/utils/key-transformer'
import validationFlow from '@soie/utils/validation-flow'

import type { Controller, Endpoint } from '@/data-manager/types'

const endpointValidation = (endpoint: Endpoint<'GraphQL', never>) => {
  validationFlow(
    [endpoint.path, 'path is required'],
    [endpoint.params?.query, 'params.query is required'],
    [
      getTypeTag(endpoint.params?.query) === 'String',
      'params.query must be string',
    ]
  )
}

export const createGraphQL =
  (
    controller: Controller<'GraphQL'>,
    defaultTransformer?: {
      transformResponseToCamelCase?: boolean | undefined
    }
  ) =>
  async <TResult>(
    endpoint: Endpoint<'GraphQL', never>
  ): Promise<FetcherResult<TResult>> => {
    endpointValidation(endpoint)
    const { transformResponseToCamelCase, transformResponseExcludes } = {
      ...defaultTransformer,
      ...endpoint.transformer,
    }
    try {
      const response = await controller(endpoint.path, {
        ...endpoint.requestInit,
        body: JSON.stringify(endpoint.params),
      })

      return keyTransformer(response, {
        enabled: transformResponseToCamelCase,
        changeCase: 'camelcase',
        excludes: transformResponseExcludes,
      }) as FetcherResult<TResult>
    } catch (_error) {
      const error = _error as GraphQLFetcherError
      throw error
    }
  }
