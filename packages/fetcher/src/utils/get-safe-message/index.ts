import type { FetcherError } from '@/fetcher/types'

export const getSafeMessage = (message: unknown): FetcherError['message'] => {
  try {
    if (typeof message === 'string') {
      return JSON.parse(message)
    }
    return 'error'
  } catch {
    if (typeof message === 'string') {
      return message
    }
    return 'error'
  }
}

export default getSafeMessage
