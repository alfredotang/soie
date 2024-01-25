import {
  createFetcher,
  createGraphQLFetcher,
  type FetcherRequestConfig,
} from '@soie/fetcher'

import createStorageInstance from './storage'

const createInstances = (requestConfig?: FetcherRequestConfig) => {
  return {
    Restful: createFetcher(requestConfig),
    LocalStorage: createStorageInstance('LocalStorage'),
    SessionStorage: createStorageInstance('SessionStorage'),
    GraphQL: createGraphQLFetcher(requestConfig),
  }
}

export default createInstances
