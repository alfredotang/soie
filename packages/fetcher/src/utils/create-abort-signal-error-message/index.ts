import type { FetcherError } from '@/fetcher/types'

const createAbortSignalErrorMessage = (message?: string): FetcherError => {
  const statusText = 'AbortError: The operation was aborted'
  return {
    status: 500,
    statusText,
    headers: new Headers(),
    message: message || statusText,
  }
}

export default createAbortSignalErrorMessage
