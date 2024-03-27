import { getReasonPhrase, StatusCodes } from 'http-status-codes'

import type { FetcherError } from '@/fetcher/types'

const createAbortSignalErrorMessage = (): FetcherError => {
  const status = StatusCodes.REQUEST_TIMEOUT
  const message = 'AbortError: The operation was aborted'
  return {
    status,
    statusText: getReasonPhrase(status),
    headers: new Headers(),
    message,
  }
}

export default createAbortSignalErrorMessage
