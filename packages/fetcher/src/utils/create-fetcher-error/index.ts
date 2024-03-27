import getPropertySafe from '@soie/utils/get-property-safe'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

import type { FetcherError } from '@/fetcher/types'
import getSafeMessage from '@/fetcher/utils/get-safe-message'

const createFetcherError = (error: unknown): FetcherError => {
  const status = getPropertySafe({
    target: error,
    propertyName: 'status',
    type: 'Number',
    defaultValue: StatusCodes.INTERNAL_SERVER_ERROR as number,
  })

  const statusText = getPropertySafe({
    target: error,
    propertyName: 'statusText',
    type: 'String',
    defaultValue: getReasonPhrase(status),
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
