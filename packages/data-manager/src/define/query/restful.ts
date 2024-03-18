import type { FetcherError, FetcherResult } from '@soie/fetcher'
import keyTransformer from '@soie/utils/key-transformer'
import querystring from 'query-string'

import type { Controller, Endpoint } from '@/data-manager/types'

const Restful = async <TResult>(
  endpoint: Endpoint<'Query', 'GET', 'Restful'>,
  controller: Controller<'Restful'>
): Promise<FetcherResult<TResult>> => {
  const url = querystring.stringifyUrl(
    {
      url: endpoint.path,
      query: keyTransformer(endpoint.params, {
        enabled: endpoint.transformer?.transformRequestToSnakeCase,
        changeCase: 'snakecase',
      }),
    },
    {
      arrayFormat: endpoint.arrayFormat,
    }
  )

  try {
    const response = await controller(url, endpoint.requestInit)

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
