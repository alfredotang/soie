import type { FetcherError, FetcherResult } from '@soie/fetcher'
import keyTransformer from '@soie/utils/key-transformer'

import type { Controller, Endpoint, Method } from '@/data-manager/types'

const Restful = async <TResult>(
  {
    path,
    params,
    requestInit,
    transformer = {},
    method,
  }: Endpoint<'Mutation', Method, 'Restful'>,
  controller: Controller<'Restful'>
): Promise<FetcherResult<TResult>> => {
  const body =
    params instanceof FormData
      ? (params as unknown as FormData)
      : JSON.stringify(
          keyTransformer(params, {
            changeCase: transformer.request?.changeCase,
            enabled: transformer.request?.enabled,
            excludes: transformer.request?.excludes,
          })
        )

  try {
    const response = await controller(path, {
      ...requestInit,
      method,
      body,
    })

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
