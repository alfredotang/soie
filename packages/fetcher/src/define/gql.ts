import { createFetcher } from '@/fetcher/define'
import type { FetcherRequestConfig, GraphQLError } from '@/fetcher/types'
import { createGraphQLError } from '@/fetcher/utils'

const createGraphQLFetcher = (requestConfig?: FetcherRequestConfig) => {
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

      return {
        ...response,
        data: response.data.data as TResult,
      }
    } catch (error) {
      throw createGraphQLError(error)
    }
  }

  return graphqlFetcher
}

export default createGraphQLFetcher
