import getTypeTag from '@soie/utils/get-type-tag'
import validation from '@soie/utils/validation'
import validationFlow from '@soie/utils/validation-flow'

import type {
  Controller,
  Endpoint,
  KeyCaseTransformer,
  Method,
  MutationFunc,
  ProtocolWithoutGQL,
  RestfulMethod,
  StorageMutationMethod,
  StorageProtocol,
} from '@/data-manager/types'

import Restful from './restful'
import Storage from './storage'

const storageEndpointValidation = (
  endpoint: Endpoint<'Mutation', Method, StorageProtocol>
) => {
  const methods: StorageMutationMethod[] = ['CLEAR', 'DELETE', 'UPDATE']

  validationFlow(
    [
      methods.includes(endpoint.method),
      `${endpoint.protocol} protocol supports only: "CLEAR", "DELETE", "UPDATE"`,
    ],
    [
      endpoint.method !== 'CLEAR' && endpoint.path,
      `path is required'`,
      endpoint.method !== 'CLEAR',
    ],
    [
      endpoint.method === 'UPDATE' &&
        getTypeTag(endpoint.params) !== 'Undefined',
      `${endpoint.protocol} ${endpoint.method}'s params is required and can't be assigned to "undefined"`,
      endpoint.method === 'UPDATE',
    ]
  )
}

const restfulEndpointValidation = (
  endpoint: Endpoint<'Mutation', Method, 'Restful'>
) => {
  const methods: RestfulMethod[] = ['GET', 'DELETE', 'POST', 'PATCH', 'PUT']

  validation(
    methods.includes(endpoint.method),
    `Restful protocol supports only: "GET", "POST", "DELETE", "PATCH", "PUT".`
  )
}

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
    validationFlow(
      [
        ['LocalStorage', 'SessionStorage', 'Restful', undefined].includes(
          endpoint.protocol
        ),
        `The protocol parameter should be specified as either "LocalStorage", "SessionStorage", or "Restful". If you choose "Restful", there's no need to pass the protocol parameter.`,
      ],
      [endpoint.method, 'method is required']
    )
    if (
      endpoint.protocol === 'LocalStorage' ||
      endpoint.protocol === 'SessionStorage'
    ) {
      storageEndpointValidation(endpoint)
      return Storage(endpoint, controller(endpoint.protocol), storagePrefix)
    }

    restfulEndpointValidation(endpoint)
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
