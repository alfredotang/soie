import type {
  Controller,
  Endpoint,
  KeyCaseTransformer,
  Method,
  MutationFunc,
  Protocol,
} from '@/data-manager/types'

import GraphQL from './graphql'
import Restful from './restful'
import Storage from './storage'

const createMutation = ({
  storagePrefix,
  controller,
  transformer,
}: {
  storagePrefix: string
  controller: <P extends Protocol>(protocol: P) => Controller<P>
  transformer?: KeyCaseTransformer
}) => {
  const mutation = async <TResult>(
    endpoint: Endpoint<'Mutation', Method, Protocol>
  ) => {
    if (
      endpoint.protocol === 'LocalStorage' ||
      endpoint.protocol === 'SessionStorage'
    ) {
      return Storage(endpoint, controller(endpoint.protocol), storagePrefix)
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

  return mutation as typeof MutationFunc
}

export default createMutation
