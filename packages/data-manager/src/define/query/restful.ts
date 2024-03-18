import type { FetcherError, FetcherResult } from '@soie/fetcher'
import keyTransformer from '@soie/utils/key-transformer'
import querystring from 'query-string'

import type { Controller, Endpoint } from '@/data-manager/types'

const Restful = async <TResult>(
  {
    path,
    params,
    arrayFormat,
    transformer = {},
    requestInit,
  }: Endpoint<'Query', 'GET', 'Restful'>,
  controller: Controller<'Restful'>
): Promise<FetcherResult<TResult>> => {
  const url = querystring.stringifyUrl(
    {
      url: path,
      query: keyTransformer(params, {
        enabled: transformer.request?.enabled,
        changeCase: transformer.request?.changeCase,
        excludes: transformer.request?.excludes,
      }),
    },
    {
      arrayFormat,
    }
  )

  try {
    const response = await controller(url, requestInit)

    return keyTransformer(response, {
      changeCase: transformer.response?.changeCase,
      enabled: transformer.response?.enabled,
      excludes: transformer.response?.excludes,
    }) as FetcherResult<TResult>
  } catch (error) {
    throw keyTransformer(error as FetcherError, {
      changeCase: transformer.response?.changeCase,
      enabled: transformer.response?.enabled,
      excludes: transformer.response?.excludes,
    })
  }
}

export default Restful
