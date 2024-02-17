import { createDataManager, type StorageProtocol } from '@soie/data-manager'

import { MOCK_STORAGE } from '@/data-manager/constants/storage'
import { buildStoragePath } from '@/data-manager/utils'

vi.mock('@/data-manager/constants/storage.ts', () => {
  const store = new Map<string, string>([
    ['hello', 'outer'],
    [`afu-ss-hello`, JSON.stringify({ name: 'SessionStorage' })],
    [`afu-ls-hello`, JSON.stringify({ name: 'LocalStorage' })],
    [`afu-ss-UPDATE`, JSON.stringify({ name: 'SessionStorage', value: 0 })],
    [`afu-ls-UPDATE`, JSON.stringify({ name: 'LocalStorage', value: 0 })],
    [`afu-ss-DELETE`, JSON.stringify({ name: 'SessionStorage', value: 0 })],
    [`afu-ls-DELETE`, JSON.stringify({ name: 'LocalStorage', value: 0 })],
  ])
  const storage = {
    getItem: (key: string) => store.get(key),
    setItem: (key: string, value: string) => {
      store.set(key, value)
      Object.defineProperty(storage, key, {
        writable: true,
        enumerable: true,
        configurable: true,
        value,
      })
    },
    removeItem: (key: string) => {
      store.delete(key)
      Object.defineProperty(storage, key, { enumerable: false })
    },
    clear: () => store.clear(),
  }

  Object.keys(storage).forEach(key => {
    Object.defineProperty(storage, key, { enumerable: false })
  })

  store.forEach((_value, key) => {
    Object.defineProperty(storage, key, {
      writable: true,
      enumerable: true,
      configurable: true,
    })
  })

  return {
    MOCK_STORAGE: storage,
  }
})

const storagePrefix = 'afu'

const protocols: StorageProtocol[] = ['LocalStorage', 'SessionStorage'] as const

const d = createDataManager({ storagePrefix })

describe('dataManager storage', () => {
  protocols.forEach(protocol => {
    describe(protocol, () => {
      describe('query', () => {
        describe('is storage exist', () => {
          it('yes', async () => {
            const data = await d.query({ protocol, path: 'hello' })
            expect(data).toEqual({ name: protocol })
          })
          it('no', async () => {
            const data = await d.query({ protocol, path: 'world' })
            expect(data).toBe(null)
          })
        })
      })
      describe('mutation', () => {
        it('UPDATE', async () => {
          const method = 'UPDATE'
          await d.mutation({
            protocol,
            path: method,
            method,
            params: { name: protocol, value: 123 },
          })
          const data = await d.query({ protocol, path: method })
          expect(data).toEqual({ name: protocol, value: 123 })
        })

        it('DELETE', async () => {
          const method = 'DELETE'
          await d.mutation({
            protocol,
            path: method,
            method,
          })
          const data = await d.query({ protocol, path: method })
          expect(data).toBe(null)
        })
        it('CLEAR', async () => {
          const method = 'CLEAR'
          await d.mutation({
            protocol,
            method,
          })

          const path = buildStoragePath({
            path: '',
            prefix: storagePrefix,
            protocol,
          })

          const { length } = Object.keys(MOCK_STORAGE).filter(key =>
            key.startsWith(path)
          )

          expect(length).toBe(0)
        })
      })
    })
  })
})
