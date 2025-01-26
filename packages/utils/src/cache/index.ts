import type { TypeSafeAny } from '@soie/utils/types'

export default class Cache {
  private CacheMap: Map<string, { ttl: number; value: TypeSafeAny }> = new Map()
  private ttl: number
  private verbose: boolean

  constructor({
    ttl = 0,
    verbose = false,
  }: { ttl?: number; verbose?: boolean } = {}) {
    this.ttl = ttl
    this.verbose = verbose
  }

  public get<T>(key: string) {
    const cache = this.CacheMap.get(key)
    if (cache) {
      const now = Date.now()
      if (now <= cache.ttl) {
        if (this.verbose) {
          console.log(`%c[Cache hit] ${key}`, 'color: skyblue')
          console.log(
            `%c[Cache ttl] ${Math.round((cache.ttl - now) / 60) / 1000}s`,
            'color: hotpink'
          )
        }
        return cache.value as T
      }
      this.CacheMap.delete(key)
    }
    if (this.verbose) console.log(`%c[Cache miss] ${key}`, 'color: orange')
    return undefined
  }

  public set<T extends TypeSafeAny>(key: string, value: T) {
    this.CacheMap.set(key, {
      ttl: Date.now() + this.ttl,
      value,
    })
  }

  public remove(key: string) {
    this.CacheMap.delete(key)
  }
}
