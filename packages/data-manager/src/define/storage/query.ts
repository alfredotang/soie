import validationFlow from '@soie/utils/validation-flow'

import { Controller, Endpoint, StorageProtocol } from '@/data-manager/types'
import { buildStoragePath } from '@/data-manager/utils'

const storageEndpointValidation = (
  endpoint: Endpoint<StorageProtocol, 'Query', never>
) => {
  validationFlow([endpoint.path, 'path is required'])
}

const createStorageQueryExecutor =
  ({
    controller,
    storagePrefix,
    protocol,
  }: {
    controller: Controller<StorageProtocol>
    storagePrefix: string
    protocol: StorageProtocol
  }) =>
  <TResult>(endpoint: Endpoint<StorageProtocol, 'Query', never>) => {
    storageEndpointValidation(endpoint)
    const path = buildStoragePath({
      path: endpoint.path,
      prefix: storagePrefix,
      protocol,
    })
    const result = controller.getItem(path)
    return result ? (JSON.parse(result) as TResult) : null
  }

export default createStorageQueryExecutor
