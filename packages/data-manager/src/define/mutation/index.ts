import type {
  Controller,
  Endpoint,
  KeyCaseTransformer,
  Method,
  MutationFunc,
  ProtocolWithoutGQL,
} from '@/data-manager/types'

import Restful from './restful'
import Storage from './storage'

const createMutation = ({
  storagePrefix,
  controller,
  transformer,
}: {
  storagePrefix: string
  controller: <P extends ProtocolWithoutGQL>(protocol: P) => Controller<P>
  transformer?: KeyCaseTransformer
}) => {
  const mutation = async <TResult>(
    endpoint: Endpoint<'Mutation', Method, ProtocolWithoutGQL>
  ) => {
    if (
      endpoint.protocol === 'LocalStorage' ||
      endpoint.protocol === 'SessionStorage'
    ) {
      return Storage(endpoint, controller(endpoint.protocol), storagePrefix)
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
