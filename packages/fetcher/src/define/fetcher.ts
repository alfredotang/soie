import type { FetcherRequestConfig, FetcherResult } from '@/fetcher/types'
import {
  createAbortSignal,
  createAbortSignalErrorMessage,
  createFetcherError,
} from '@/fetcher/utils'

const createFetcher = ({
  headers: defaultHeaders = {},
  baseURL = '',
  timeout,
}: FetcherRequestConfig = {}) => {
  const request = async <TResult>(
    _url: string,
    init?: RequestInit
  ): Promise<FetcherResult<TResult>> => {
    const timeoutAbortSignal = timeout
      ? AbortSignal.timeout(timeout)
      : undefined

    const url = _url.startsWith('/') ? `${baseURL}${_url}` : _url
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...defaultHeaders,
          ...(init?.headers || {}),
        },
        signal: createAbortSignal([timeoutAbortSignal, init?.signal]),
      })
      if (!response.ok) {
        throw {
          status: response.status,
          statusTest: response.statusText,
          message: await response.clone().text(),
          ok: false,
          headers: response.headers,
        }
      }
      const data = (await response.clone().json()) as TResult
      return {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
        data,
      }
    } catch (error) {
      if (timeoutAbortSignal?.aborted) {
        throw createAbortSignalErrorMessage()
      }
      if (init?.signal?.aborted) {
        throw createAbortSignalErrorMessage()
      }
      throw createFetcherError(error)
    }
  }

  return request
}

export default createFetcher
