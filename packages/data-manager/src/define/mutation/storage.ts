import type {
  Controller,
  Endpoint,
  Method,
  StorageProtocol,
} from '@/data-manager/types'
import { buildStoragePath } from '@/data-manager/utils'

const Storage = <M extends Method>(
  endpoint: Endpoint<'Mutation', M, StorageProtocol>,
  controller: Controller<StorageProtocol>,
  storagePrefix: string
) => {
  const path = buildStoragePath({
    path: endpoint.method === 'CLEAR' ? '' : endpoint.path,
    prefix: storagePrefix,
    protocol: endpoint.protocol,
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

  return Promise.resolve()
}

export default Storage
