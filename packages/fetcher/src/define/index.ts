import type {
  FetcherRequestConfig,
  FetcherResult,
  GraphQLError,
} from '@/fetcher/types'
import {
  createAbortSignal,
  createAbortSignalErrorMessage,
  createFetcherError,
  createGraphQLError,
} from '@/fetcher/utils'

export const createFetcher = ({
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
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...defaultHeaders,
          ...(init?.headers || {}),
        },
        signal: createAbortSignal([timeoutAbortSignal, init?.signal]),
      })
      if (!response.ok) {
        throw {
          status: response.status,
          statusTest: response.statusText,
          message: await response.text(),
          ok: false,
        }
      }
      const data = (await response.json()) as TResult
      return {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
        data,
      }
    } catch (error) {
      if (timeoutAbortSignal?.aborted) {
        throw createAbortSignalErrorMessage('Time Out')
      }
      if (init?.signal?.aborted) {
        throw createAbortSignalErrorMessage()
      }
      throw createFetcherError(error)
    }
  }

  return request
}

export const createGraphQLFetcher = (requestConfig?: FetcherRequestConfig) => {
  const fetcher = createFetcher(requestConfig)
  const graphqlFetcher = async <TResult>(
    path: string,
    init?: Omit<RequestInit, 'method'>
  ) => {
    try {
      const response = await fetcher<{ data: TResult; errors: GraphQLError }>(
        path,
        {
          ...init,
          method: 'POST',
        }
      )
      if (response.data.errors) {
        const {
          status,
          statusText,
          headers,
          data: { errors },
        } = response
        throw {
          status,
          statusText,
          headers,
          errors,
          message: 'GraphQL Error',
        }
      }

      return Promise.resolve({
        ...response,
        data: response.data?.data as TResult,
      })
    } catch (error) {
      throw createGraphQLError(error)
    }
  }

  return graphqlFetcher
}
