import { MOCK_STORAGE } from '@/data-manager/constants/storage'
import type { StorageProtocol } from '@/data-manager/types'

const createStorageInstance = (protocol: StorageProtocol) => {
  if (typeof window === 'undefined') return MOCK_STORAGE
  const StorageMap = {
    LocalStorage: localStorage,
    SessionStorage: sessionStorage,
  }
  const storage = StorageMap[protocol]
  return storage
}

export default createStorageInstance
