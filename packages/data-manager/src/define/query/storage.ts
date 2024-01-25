import type {
  Controller,
  Endpoint,
  StorageProtocol,
} from '@/data-manager/types'
import { buildStoragePath } from '@/data-manager/utils'

const Storage = <TResult>(
  endpoint: Endpoint<'Query', 'GET', StorageProtocol>,
  controller: Controller<StorageProtocol>,
  storagePrefix: string
): Promise<TResult | null> => {
  const path = buildStoragePath({
    path: endpoint.path,
    prefix: storagePrefix,
    protocol: endpoint.protocol,
  })
  const result = controller.getItem(path)

  return Promise.resolve(result ? JSON.parse(result) : null)
}

export default Storage
