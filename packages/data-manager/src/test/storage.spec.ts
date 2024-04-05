import { createDataManager } from '@soie/data-manager'

import { MOCK_STORAGE } from '@/data-manager/constants/storage'

vi.mock('@/data-manager/constants/storage.ts', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storage: any = {
    hello: 'outer',
    'afu-ss-hello': JSON.stringify({ name: 'SessionStorage' }),
    'afu-ls-hello': JSON.stringify({ name: 'LocalStorage' }),
    'afu-ss-update': JSON.stringify({ name: 'SessionStorage', value: 0 }),
    'afu-ls-update': JSON.stringify({ name: 'LocalStorage', value: 0 }),
    'afu-ss-delete': JSON.stringify({ name: 'SessionStorage', value: 0 }),
    'afu-ls-delete': JSON.stringify({ name: 'LocalStorage', value: 0 }),
    getItem: (key: string) => storage[key],
    setItem: (key: string, value: string) => {
      storage[key] = value
    },
    removeItem: (key: string) => {
      delete storage[key]
    },
  }

  return {
    MOCK_STORAGE: storage,
  }
})

const storagePrefix = 'afu'

const { ls, ss } = createDataManager({ storagePrefix })

const testCases = [
  { protocol: 'LocalStorage', executor: ls, prefix: 'afu-ls' },
  { protocol: 'SessionStorage', executor: ss, prefix: 'afu-ss' },
] as const

describe('dataManager storage', () => {
  afterAll(() => {
    vi.clearAllMocks()
  })

  testCases.forEach(({ protocol, executor, prefix }) => {
    describe(protocol, () => {
      describe('query', () => {
        describe('is storage exist', () => {
          it('yes', () => {
            const data = executor.query('hello')
            expect(data).toEqual({ name: protocol })
          })
          it('no', () => {
            const data = executor.query('world')
            expect(data).toBe(null)
          })
        })
      })
      describe('mutation', () => {
        it('update', () => {
          const path = 'update'
          executor.update(path, { name: protocol, value: 123 })
          const data = executor.query(path)
          expect(data).toEqual({ name: protocol, value: 123 })
        })

        it('DELETE', () => {
          const path = 'delete'
          executor.delete(path)
          const data = executor.query(path)
          expect(data).toBe(null)
        })
        describe('CLEAR', async () => {
          beforeAll(() => {
            executor.clear()
          })
          it('own key should be cleared', () => {
            const { length } = Object.keys(MOCK_STORAGE).filter(key =>
              key.startsWith(prefix)
            )
            expect(length).toBe(0)
          })
          it('outer key should be keep', () => {
            expect(MOCK_STORAGE['hello']).toBe('outer')
          })
        })
      })
    })
  })
})
