import type {
  Controller,
  Endpoint,
  KeyCaseTransformer,
  Protocol,
  QueryFunc,
} from '@/data-manager/types'

import GraphQL from './graphql'
import Restful from './restful'
import Storage from './storage'

const createQuery = ({
  storagePrefix,
  controller,
  transformer,
}: {
  storagePrefix: string
  controller: <P extends Protocol>(protocol: P) => Controller<P>
  transformer?: KeyCaseTransformer
}) => {
  const query: typeof QueryFunc = async <TResult, P extends Protocol>(
    endpoint: Endpoint<'Query', 'GET', P>
  ) => {
    if (
      endpoint.protocol === 'LocalStorage' ||
      endpoint.protocol === 'SessionStorage'
    ) {
      return Storage<TResult>(
        endpoint,
        controller(endpoint.protocol) as Controller<'LocalStorage'>,
        storagePrefix
      )
    }

    if (endpoint.protocol === 'GraphQL') {
      return GraphQL<TResult>(
        {
          ...endpoint,
          transformer: {
            ...transformer,
            ...endpoint.transformer,
          },
        },
        controller(endpoint.protocol)
      )
    }

    return Restful<TResult>(
      {
        ...endpoint,
        transformer: {
          ...transformer,
          ...endpoint.transformer,
        },
      },
      controller('Restful')
    )
  }

  return query
}

export default createQuery
