import type { FetcherError } from '@/fetcher/types'

export const getSafeMessage = (message: unknown): FetcherError['message'] => {
  try {
    if (typeof message === 'string') {
      return JSON.parse(message)
    }
    return 'error'
  } catch {
    return message as string
  }
}

export default getSafeMessage
