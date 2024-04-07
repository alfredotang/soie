import { MOCK_STORAGE } from '@/data-manager/constants/storage'

const isServer = typeof window === 'undefined'

const storageInstances = {
  LocalStorage: isServer ? MOCK_STORAGE : localStorage,
  SessionStorage: isServer ? MOCK_STORAGE : sessionStorage,
}

export default storageInstances
