import type { StorageProtocol } from '@/data-manager/types'

const MOCK_STORAGE = {
  getItem: (_key: string) => {},
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
  clear: () => {},
} as Storage

const StorageMap = {
  LocalStorage: typeof window !== 'undefined' ? localStorage : MOCK_STORAGE,
  SessionStorage: typeof window !== 'undefined' ? sessionStorage : MOCK_STORAGE,
}

const createStorageInstance = (protocol: StorageProtocol) => {
  const storage = StorageMap[protocol]
  return storage
}

export default createStorageInstance
