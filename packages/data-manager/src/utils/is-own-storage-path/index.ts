import type { StorageProtocol } from '@/data-manager/types'
import buildStoragePath from '@/data-manager/utils/build-storage-path'

export default function isOwnStoragePath({
  key,
  prefix,
  protocol,
}: {
  key: string
  prefix: string
  protocol: StorageProtocol
}) {
  const path = buildStoragePath({ path: '', prefix, protocol })
  return key.startsWith(path)
}
