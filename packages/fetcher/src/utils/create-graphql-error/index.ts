import type { GraphQLFetcherError } from '@/fetcher/types'
import createFetcherError from '@/fetcher/utils/create-fetcher-error'

const createGraphQLError = (_error: unknown): GraphQLFetcherError => {
  if (typeof _error === 'object' && _error && 'errors' in _error) {
    return _error as GraphQLFetcherError
  }

  return {
    ...createFetcherError(_error),
    errors: [],
  }
}

export default createGraphQLError
