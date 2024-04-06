import getTypeTag from '@soie/utils/get-type-tag'
import type { TypeSafeAny } from '@soie/utils/types'
import validationFlow from '@soie/utils/validation-flow'

import type { Controller, StorageProtocol } from '@/data-manager/types'
import { buildStoragePath } from '@/data-manager/utils'

export default class StorageExecutor {
  private storagePrefix: string
  private controller: Controller<StorageProtocol>
  private protocol: StorageProtocol

  private buildPath(path: string = '') {
    return buildStoragePath({
      path,
      prefix: this.storagePrefix,
      protocol: this.protocol,
    })
  }

  private isOwnStorage = (key: string) => {
    const path = this.buildPath()
    return key.startsWith(path)
  }

  constructor(
    storagePrefix: string,
    controller: Controller<StorageProtocol>,
    protocol: StorageProtocol
  ) {
    this.storagePrefix = storagePrefix
    this.controller = controller
    this.protocol = protocol
  }

  public query<TResult>(path: string) {
    validationFlow([path, 'path is required'])
    const result = this.controller.getItem(this.buildPath(path))
    return result ? (JSON.parse(result) as TResult) : null
  }

  public update(path: string, params: TypeSafeAny) {
    validationFlow(
      [path, `path is required`],
      [
        getTypeTag(params) !== 'Undefined',
        `params is required and can't be assigned to "undefined"`,
      ]
    )
    this.controller.setItem(this.buildPath(path), JSON.stringify(params))
  }

  public delete(path: string) {
    validationFlow([path, `path is required`])
    this.controller.removeItem(this.buildPath(path))
  }

  public clear() {
    Object.keys(this.controller)
      .filter(this.isOwnStorage)
      .forEach(key => {
        this.controller.removeItem(key)
      })
  }
}
