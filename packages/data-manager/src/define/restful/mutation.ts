import type { FetcherError, FetcherResult } from '@soie/fetcher'
import getTypeTag from '@soie/utils/get-type-tag'
import keyTransformer from '@soie/utils/key-transformer'
import validationFlow from '@soie/utils/validation-flow'

import type {
  Controller,
  Endpoint,
  EndpointTransformer,
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
    const body =
      getTypeTag(endpoint.params) === 'FormData'
        ? (endpoint.params as unknown as FormData)
        : JSON.stringify(
            keyTransformer(endpoint.params, {
              changeCase: 'snakecase',
              enabled: transformRequestToSnakeCase,
              excludes: transformRequestExcludes,
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

export default createRestfulMutation
