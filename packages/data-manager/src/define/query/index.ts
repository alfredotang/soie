import type {
  Controller,
  Endpoint,
  KeyCaseTransformer,
  ProtocolWithoutGQL,
  QueryFunc,
} from '@/data-manager/types'

import Restful from './restful'
import Storage from './storage'

const createQuery = ({
  storagePrefix,
  controller,
  transformer,
}: {
  storagePrefix: string
  controller: <P extends ProtocolWithoutGQL>(protocol: P) => Controller<P>
  transformer?: KeyCaseTransformer
}) => {
  const query: typeof QueryFunc = async <TResult, P extends ProtocolWithoutGQL>(
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
