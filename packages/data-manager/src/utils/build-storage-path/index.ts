import type { StorageProtocol } from '@/data-manager/types'

const StorageKeyMap = {
  LocalStorage: 'ls',
  SessionStorage: 'ss',
}

const buildStoragePath = ({
  path,
  prefix,
  protocol,
}: {
  protocol: StorageProtocol
  path: string
  prefix: string
}) => {
  const type = StorageKeyMap[protocol]
  return [prefix, type, path].filter(Boolean).join('-')
}

export default buildStoragePath
