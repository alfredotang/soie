import {
  STATUS_CODE_DICT,
  STATUS_DESCRIPTION_DICT,
} from '@soie/utils/constants/http-status-code'

import type { FetcherError } from '@/fetcher/types'

const createAbortSignalErrorMessage = (): FetcherError => {
  const status = STATUS_DESCRIPTION_DICT.REQUEST_TIMEOUT
  const message = 'AbortError: The operation was aborted'
  return {
    status,
    statusText: STATUS_CODE_DICT[status],
    headers: new Headers(),
    message,
  }
}

export default createAbortSignalErrorMessage
