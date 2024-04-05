import type { FetcherResult, GraphQLFetcherError } from '@soie/fetcher'
import keyTransformer from '@soie/utils/key-transformer'

import type { Controller, Endpoint } from '@/data-manager/types'

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
    const { transformResponseToCamelCase } = {
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
      }) as FetcherResult<TResult>
    } catch (_error) {
      const error = _error as GraphQLFetcherError
      throw error
    }
  }
