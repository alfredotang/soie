import {
  createFetcher,
  createGraphQLFetcher,
  type FetcherRequestConfig,
} from '@soie/fetcher'

import storageInstances from './storage'

const createInstances = (requestConfig?: FetcherRequestConfig) => {
  return {
    restfulController: createFetcher(requestConfig),
    localStorageController: storageInstances.LocalStorage,
    sessionStorageController: storageInstances.SessionStorage,
    graphQLController: createGraphQLFetcher(requestConfig),
  }
}

export default createInstances
