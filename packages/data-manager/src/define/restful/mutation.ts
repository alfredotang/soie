import type { FetcherError, FetcherResult } from '@soie/fetcher'
import keyTransformer from '@soie/utils/key-transformer'

import type {
  Controller,
  Endpoint,
  KeyCaseTransformer,
} from '@/data-manager/types'

const createRestfulMutation =
  (
    controller: Controller<'Restful'>,
    defaultTransformer?: KeyCaseTransformer
  ) =>
  async <TResult>(
    endpoint: Endpoint<'Restful', 'Mutation'>
  ): Promise<FetcherResult<TResult>> => {
    const {
      transformRequestToSnakeCase,
      transformResponseToCamelCase,
    }: KeyCaseTransformer = {
      ...defaultTransformer,
      ...endpoint.transformer,
    }
    const body =
      endpoint.params instanceof FormData
        ? (endpoint.params as unknown as FormData)
        : JSON.stringify(
            keyTransformer(endpoint.params, {
              changeCase: 'snakecase',
              enabled: transformRequestToSnakeCase,
            })
          )

    try {
      const response = await controller(endpoint.path, {
        ...(endpoint.requestInit || {}),
        method: endpoint.method,
        body,
      })

      return keyTransformer(response, {
        enabled: transformResponseToCamelCase,
        changeCase: 'camelcase',
      }) as FetcherResult<TResult>
    } catch (error) {
      throw keyTransformer(error as FetcherError, {
        enabled: transformResponseToCamelCase,
        changeCase: 'camelcase',
      })
    }
  }

export default createRestfulMutation
