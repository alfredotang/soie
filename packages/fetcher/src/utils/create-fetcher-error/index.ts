import {
  STATUS_CODE_DICT,
  STATUS_DESCRIPTION_DICT,
} from '@soie/utils/constants/http-status-code'
import getPropertySafe from '@soie/utils/get-property-safe'

import type { FetcherError } from '@/fetcher/types'
import getSafeMessage from '@/fetcher/utils/get-safe-message'

const createFetcherError = (error: unknown): FetcherError => {
  const status = getPropertySafe({
    target: error,
    propertyName: 'status',
    type: 'Number',
    defaultValue: STATUS_DESCRIPTION_DICT.INTERNAL_SERVER_ERROR,
  })

  const statusText = getPropertySafe({
    target: error,
    propertyName: 'statusText',
    type: 'String',
    defaultValue: STATUS_CODE_DICT[status],
  })

  const headers = getPropertySafe({
    target: error,
    propertyName: 'headers',
    type: 'Headers',
    defaultValue: new Headers(),
  })

  const _message = getPropertySafe({
    target: error,
    propertyName: 'message',
    type: 'String',
    defaultValue: 'error',
  })
  const message = getSafeMessage(_message)

  return {
    status,
    statusText,
    headers,
    message,
  }
}
export default createFetcherError
