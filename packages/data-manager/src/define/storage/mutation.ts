import getTypeTag from '@soie/utils/get-type-tag'
import validationFlow from '@soie/utils/validation-flow'

import {
  Controller,
  Endpoint,
  StorageMutationMethod,
  StorageProtocol,
} from '@/data-manager/types'
import { buildStoragePath } from '@/data-manager/utils'

const storageEndpointValidation = (
  endpoint: Endpoint<StorageProtocol, 'Mutation', StorageMutationMethod>,
  protocol: StorageProtocol
) => {
  const methods: StorageMutationMethod[] = ['CLEAR', 'DELETE', 'UPDATE']

  validationFlow(
    [
      methods.includes(endpoint.method),
      `${protocol} protocol supports only: "CLEAR", "DELETE", "UPDATE"`,
    ],
    [
      endpoint.method !== 'CLEAR' && endpoint.path,
      `path is required'`,
      endpoint.method !== 'CLEAR',
    ],
    [
      endpoint.method === 'UPDATE' &&
        getTypeTag(endpoint.params) !== 'Undefined',
      `${protocol} ${endpoint.method}'s params is required and can't be assigned to "undefined"`,
      endpoint.method === 'UPDATE',
    ]
  )
}

const createStorageMutationExecutor =
  ({
    controller,
    storagePrefix,
    protocol,
  }: {
    controller: Controller<StorageProtocol>
    storagePrefix: string
    protocol: StorageProtocol
  }) =>
  (endpoint: Endpoint<StorageProtocol, 'Mutation', StorageMutationMethod>) => {
    storageEndpointValidation(endpoint, protocol)
    const path = buildStoragePath({
      path: endpoint.method === 'CLEAR' ? '' : endpoint.path,
      prefix: storagePrefix,
      protocol,
    })

    if (endpoint.method === 'DELETE') {
      controller.removeItem(path)
    }

    if (endpoint.method === 'UPDATE') {
      controller.setItem(path, JSON.stringify(endpoint.params))
    }

    if (endpoint.method === 'CLEAR') {
      const isOwnStorage = (key: string) => new RegExp(`^${path}`).test(key)

      Object.keys(controller)
        .filter(isOwnStorage)
        .forEach(key => {
          controller.removeItem(key)
        })
    }
  }

export default createStorageMutationExecutor
