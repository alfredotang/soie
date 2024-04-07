import type { FetcherError, FetcherResult } from '@soie/fetcher'
import keyTransformer from '@soie/utils/key-transformer'
import { stringifyUrl } from '@soie/utils/query-string'
import validationFlow from '@soie/utils/validation-flow'

import type {
  Controller,
  Endpoint,
  EndpointTransformer,
  KeyCaseTransformer,
} from '@/data-manager/types'

const createRestfulQuery =
  (
    controller: Controller<'Restful'>,
    defaultTransformer?: KeyCaseTransformer
  ) =>
  async <TResult>(
    endpoint: Endpoint<'Restful', 'Query'>
  ): Promise<FetcherResult<TResult>> => {
    validationFlow([endpoint.path, 'path is required'])
    const {
      transformRequestToSnakeCase,
      transformResponseToCamelCase,
      transformRequestExcludes,
      transformResponseExcludes,
    }: EndpointTransformer = {
      ...defaultTransformer,
      ...endpoint.transformer,
    }
    const url = stringifyUrl(
      {
        url: endpoint.path,
        query: keyTransformer(endpoint.params, {
          enabled: transformRequestToSnakeCase,
          changeCase: 'snakecase',
          excludes: transformRequestExcludes,
        }),
      },
      {
        arrayFormat: endpoint.arrayFormat,
        arrayFormatSeparator: endpoint.arrayFormatSeparator,
      }
    )

    try {
      const response = await controller(url, endpoint.requestInit)

      return keyTransformer(response, {
        enabled: transformResponseToCamelCase,
        changeCase: 'camelcase',
        excludes: transformResponseExcludes,
      }) as FetcherResult<TResult>
    } catch (error) {
      throw keyTransformer(error as FetcherError, {
        enabled: transformResponseToCamelCase,
        changeCase: 'camelcase',
        excludes: transformResponseExcludes,
      })
    }
  }

export default createRestfulQuery
