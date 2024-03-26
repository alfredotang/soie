import type { Controller, StorageProtocol } from '@/data-manager/types'

import createStorageMutationExecutor from './mutation'
import createStorageQueryExecutor from './query'

const createStorage = ({
  storagePrefix,
  controller,
  protocol,
}: {
  storagePrefix: string
  controller: Controller<StorageProtocol>
  protocol: StorageProtocol
}) => {
  return {
    query: createStorageQueryExecutor({ storagePrefix, controller, protocol }),
    mutation: createStorageMutationExecutor({
      storagePrefix,
      controller,
      protocol,
    }),
  }
}

export default createStorage
