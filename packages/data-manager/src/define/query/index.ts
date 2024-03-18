import validationFlow from '@soie/utils/validation-flow'

import type {
  Controller,
  Endpoint,
  KeyCaseTransformer,
  ProtocolWithoutGQL,
  QueryFunc,
} from '@/data-manager/types'
import { mergeKeyTransformerConfig } from '@/data-manager/utils'

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
    validationFlow(
      [
        ['LocalStorage', 'SessionStorage', 'Restful', undefined].includes(
          endpoint.protocol
        ),
        `
        The protocol parameter should be specified as either "LocalStorage", "SessionStorage", or "Restful". If you choose "Restful", there's no need to pass the protocol parameter.`,
      ],
      [endpoint.path, 'path is required']
    )
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
        transformer: mergeKeyTransformerConfig(
          transformer,
          endpoint.transformer
        ),
      },
      controller('Restful')
    )
  }

  return query
}

export default createQuery
