import type { FetcherError, FetcherResult } from '@soie/fetcher'
import keyTransformer from '@soie/utils/key-transformer'
import querystring from 'query-string'

import type {
  Controller,
  Endpoint,
  KeyCaseTransformer,
} from '@/data-manager/types'

const createRestfulQueryExecutor =
  (
    controller: Controller<'Restful'>,
    defaultTransformer?: KeyCaseTransformer
  ) =>
  async <TResult>(
    endpoint: Endpoint<'Restful', 'Query', never>
  ): Promise<FetcherResult<TResult>> => {
    const {
      transformRequestToSnakeCase,
      transformResponseToCamelCase,
    }: KeyCaseTransformer = {
      ...defaultTransformer,
      ...endpoint.transformer,
    }
    const url = querystring.stringifyUrl(
      {
        url: endpoint.path,
        query: keyTransformer(endpoint.params, {
          enabled: transformRequestToSnakeCase,
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

export default createRestfulQueryExecutor
