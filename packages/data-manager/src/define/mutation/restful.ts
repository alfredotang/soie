import type { FetcherError, FetcherResult } from '@soie/fetcher'
import keyTransformer from '@soie/utils/key-transformer'

import type { Controller, Endpoint, Method } from '@/data-manager/types'

const Restful = async <TResult>(
  endpoint: Endpoint<'Mutation', Method, 'Restful'>,
  controller: Controller<'Restful'>
): Promise<FetcherResult<TResult>> => {
  const body =
    endpoint.params instanceof FormData
      ? (endpoint.params as unknown as FormData)
      : JSON.stringify(
          keyTransformer(endpoint.params, {
            changeCase: 'snakecase',
            enabled: endpoint.transformer?.transformRequestToSnakeCase,
          })
        )

  try {
    const response = await controller(endpoint.path, {
      ...(endpoint.requestInit || {}),
      method: endpoint.method,
      body,
    })

    return keyTransformer(response, {
      enabled: endpoint.transformer?.transformResponseToCamelCase,
      changeCase: 'camelcase',
    }) as FetcherResult<TResult>
  } catch (error) {
    throw keyTransformer(error as FetcherError, {
      enabled: endpoint.transformer?.transformResponseToCamelCase,
      changeCase: 'camelcase',
    })
  }
}

export default Restful
