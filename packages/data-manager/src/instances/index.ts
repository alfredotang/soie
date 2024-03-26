import {
  createFetcher,
  createGraphQLFetcher,
  type FetcherRequestConfig,
} from '@soie/fetcher'

import createStorageInstance from './storage'

const createInstances = (requestConfig?: FetcherRequestConfig) => {
  return {
    restfulController: createFetcher(requestConfig),
    localStorageController: createStorageInstance('LocalStorage'),
    sessionStorageController: createStorageInstance('SessionStorage'),
    graphQLController: createGraphQLFetcher(requestConfig),
  }
}

export default createInstances
