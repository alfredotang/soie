import { createDataManager } from '@soie/data-manager'

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

const { ls, ss } = createDataManager({ storagePrefix })

const testCases = [
  { protocol: 'LocalStorage', executor: ls },
  { protocol: 'SessionStorage', executor: ss },
] as const

describe('dataManager storage', () => {
  afterAll(() => {
    vi.clearAllMocks()
  })

  testCases.forEach(({ protocol, executor }) => {
    describe(protocol, () => {
      describe('query', () => {
        describe('is storage exist', () => {
          it('yes', () => {
            const data = executor.query({ path: 'hello' })
            expect(data).toEqual({ name: protocol })
          })
          it('no', () => {
            const data = executor.query({ path: 'world' })
            expect(data).toBe(null)
          })
        })
      })
      describe('mutation', () => {
        it('UPDATE', () => {
          const method = 'UPDATE'
          executor.mutation({
            path: method,
            method,
            params: { name: protocol, value: 123 },
          })
          const data = executor.query({ path: method })
          expect(data).toEqual({ name: protocol, value: 123 })
        })

        it('DELETE', () => {
          const method = 'DELETE'
          executor.mutation({
            path: method,
            method,
          })
          const data = executor.query({ path: method })
          expect(data).toBe(null)
        })
        it('CLEAR', async () => {
          executor.mutation({
            method: 'CLEAR',
          })

          const data1 = executor.query({ path: 'hello' })
          const data2 = executor.query({ path: 'UPDATE' })

          expect([data1, data2]).toEqual([null, null])
        })
      })
    })
  })
})
