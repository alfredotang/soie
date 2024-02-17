import type { FetcherError, FetcherResult } from '@soie/fetcher'
import querystring from 'query-string'

import type { Controller, Endpoint } from '@/data-manager/types'
import {
  camelCaseTransformer,
  snakeCaseKeysTransformer,
} from '@/data-manager/utils'

const Restful = async <TResult>(
  endpoint: Endpoint<'Query', 'GET', 'Restful'>,
  controller: Controller<'Restful'>
): Promise<FetcherResult<TResult>> => {
  const url = querystring.stringifyUrl(
    {
      url: endpoint.path,
      query: snakeCaseKeysTransformer(
        endpoint.params,
        endpoint.transformer?.transformRequestToSnakeCase
      ),
    },
    {
      arrayFormat: endpoint.arrayFormat,
    }
  )

  try {
    const response = await controller(url, endpoint.requestInit)

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
