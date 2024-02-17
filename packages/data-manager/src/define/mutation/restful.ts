import type { FetcherError, FetcherResult } from '@soie/fetcher'

import type { Controller, Endpoint, Method } from '@/data-manager/types'
import {
  camelCaseTransformer,
  snakeCaseKeysTransformer,
} from '@/data-manager/utils'

const Restful = async <TResult>(
  endpoint: Endpoint<'Mutation', Method, 'Restful'>,
  controller: Controller<'Restful'>
): Promise<FetcherResult<TResult>> => {
  const body =
    endpoint.params instanceof FormData
      ? (endpoint.params as unknown as FormData)
      : JSON.stringify(
          snakeCaseKeysTransformer(
            endpoint.params,
            endpoint.transformer?.transformRequestToSnakeCase
          )
        )

  try {
    const response = await controller(endpoint.path, {
      ...(endpoint.requestInit || {}),
      method: endpoint.method,
      body,
    })

    return {
      ...response,
      data: camelCaseTransformer(
        response.data,
        endpoint.transformer?.transformResponseToCamelCase
      ) as TResult,
    }
  } catch (_error) {
    const error = _error as FetcherError
    throw {
      ...error,
      message: camelCaseTransformer(
        error.message,
        endpoint.transformer?.transformResponseToCamelCase &&
          typeof error.message !== 'string'
      ),
    }
  }
}

export default Restful
