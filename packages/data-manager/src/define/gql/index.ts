import type { FetcherResult, GraphQLFetcherError } from '@soie/fetcher'
import getTypeTag from '@soie/utils/get-type-tag'
import keyTransformer from '@soie/utils/key-transformer'
import validationFlow from '@soie/utils/validation-flow'

import type {
  Controller,
  GraphQLEndpoint,
  KeyCaseTransformer,
  Protocol,
} from '@/data-manager/types'
import { mergeKeyTransformerConfig } from '@/data-manager/utils'

const endpointValidation = (endpoint: GraphQLEndpoint) => {
  validationFlow(
    [endpoint.path, 'path is required'],
    [endpoint.params?.query, 'params.query is required'],
    [
      getTypeTag(endpoint.params?.query) === 'String',
      'params.query should be string',
    ]
  )
}

const GraphQL = async <TResult>(
  { path, params, transformer, requestInit }: GraphQLEndpoint,
  controller: Controller<'GraphQL'>
): Promise<FetcherResult<TResult>> => {
  try {
    const response = await controller(path, {
      ...requestInit,
      body: JSON.stringify(params),
    })

    const { enabled, excludes, changeCase } = transformer?.response || {}

    return keyTransformer(response, {
      enabled,
      changeCase,
      excludes,
    }) as FetcherResult<TResult>
  } catch (_error) {
    const error = _error as GraphQLFetcherError
    throw error
  }
}

const createGraphQL =
  ({
    controller,
    transformer: defaultTransformer,
  }: {
    controller: <P extends Protocol>(protocol: P) => Controller<P>
    transformer?: KeyCaseTransformer
  }) =>
  <TResult>(endpoint: GraphQLEndpoint) => {
    endpointValidation(endpoint)
    const transformer = mergeKeyTransformerConfig(
      defaultTransformer,
      endpoint.transformer
    )

    return GraphQL<TResult>(
      { ...endpoint, transformer: { response: transformer.response } },
      controller('GraphQL')
    )
  }

export default createGraphQL
