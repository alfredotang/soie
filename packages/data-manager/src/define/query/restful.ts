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
  const url = encodeURI(
    querystring.stringifyUrl(
      {
        url: snakeCaseKeysTransformer(
          endpoint.path,
          endpoint.transformer?.transformRequestToSnakeCase
        ),
        query: endpoint.params,
      },
      {
        arrayFormat: endpoint.arrayFormat,
      }
    )
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
      ...camelCaseTransformer(
        error,
        endpoint.transformer?.transformResponseToCamelCase
      ),
      headers: error.headers,
    } as FetcherError
  }
}

export default Restful
