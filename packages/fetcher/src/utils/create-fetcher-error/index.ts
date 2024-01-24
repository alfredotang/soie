import type { FetcherError } from '@/fetcher/types'
import getSafeMessage from '@/fetcher/utils/get-safe-message'

const createFetcherError = (_error: unknown): FetcherError => {
  if (typeof _error === 'object' && _error) {
    let status, statusText, message, headers
    if ('status' in _error) {
      status = _error.status as number
    }

    if ('statusText' in _error) {
      statusText = _error.statusText as string
    }

    if ('headers' in _error) {
      headers = _error.headers as Headers
    }

    if ('message' in _error) {
      message = getSafeMessage(_error.message)
    }

    return {
      status: status || 500,
      statusText: statusText || 'error',
      headers: headers || new Headers(),
      message: message || 'error',
    }
  }

  return {
    status: 500,
    statusText: 'error',
    headers: new Headers(),
    message: 'error',
  }
}
export default createFetcherError
