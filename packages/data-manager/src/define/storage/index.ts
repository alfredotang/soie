import getTypeTag from '@soie/utils/get-type-tag'
import validationFlow from '@soie/utils/validation-flow'

import type {
  Controller,
  StorageProtocol,
  TypeSafeAny,
} from '@/data-manager/types'
import { buildStoragePath, isOwnStoragePath } from '@/data-manager/utils'

const createStorage = (
  storagePrefix: string,
  controller: Controller<StorageProtocol>,
  protocol: StorageProtocol
) => {
  const buildPath = (path: string = '') =>
    buildStoragePath({
      path,
      prefix: storagePrefix,
      protocol,
    })

  return {
    query<TResult>(path: string) {
      validationFlow([path, 'path is required'])
      const result = controller.getItem(buildPath(path))
      return result ? (JSON.parse(result) as TResult) : null
    },
    update(path: string, params: TypeSafeAny) {
      validationFlow(
        [path, `path is required`],
        [
          getTypeTag(params) !== 'Undefined',
          `params is required and can't be assigned to "undefined"`,
        ]
      )
      controller.setItem(buildPath(path), JSON.stringify(params))
    },
    delete(path: string) {
      validationFlow([path, `path is required`])
      controller.removeItem(buildPath(path))
    },
    clear() {
      Object.keys(controller)
        .filter(key =>
          isOwnStoragePath({ key, prefix: storagePrefix, protocol })
        )
        .forEach(key => {
          controller.removeItem(key)
        })
    },
  }
}

export default createStorage
