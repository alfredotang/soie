import {
  createGraphQL,
  createRestfulMutation,
  createRestfulQuery,
  createStorage,
} from './define'
import createInstances from './instances'
import { DataManagerConfig, KeyCaseTransformer } from './types'

export const createDataManager = ({
  requestConfig,
  storagePrefix = 'data-manager',
  transformer,
}: DataManagerConfig = {}) => {
  const defaultTransformer: KeyCaseTransformer = {
    transformRequestToSnakeCase: false,
    transformResponseToCamelCase: false,
    ...transformer,
  }

  const {
    restfulController,
    localStorageController,
    sessionStorageController,
    graphQLController,
  } = createInstances(requestConfig)

  return {
    query: createRestfulQuery(restfulController, defaultTransformer),
    mutation: createRestfulMutation(restfulController, defaultTransformer),
    gql: createGraphQL(graphQLController, defaultTransformer),
    ls: createStorage(storagePrefix, localStorageController, 'LocalStorage'),
    ss: createStorage(
      storagePrefix,
      sessionStorageController,
      'SessionStorage'
    ),
  }
}
