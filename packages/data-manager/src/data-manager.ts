import {
  createGraphQL,
  createRestfulMutation,
  createRestfulQuery,
  StorageExecutor,
} from './define'
import createInstances from './instances'
import { DataManagerConfig, KeyCaseTransformer } from './types'

export const createDataManager = ({
  requestConfig,
  storagePrefix = 'data-manager',
  transformer: _transformer,
}: DataManagerConfig = {}) => {
  const defaultTransformer: KeyCaseTransformer = {
    transformRequestToSnakeCase: false,
    transformResponseToCamelCase: false,
    ..._transformer,
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
    ls: new StorageExecutor(
      storagePrefix,
      localStorageController,
      'LocalStorage'
    ),
    ss: new StorageExecutor(
      storagePrefix,
      sessionStorageController,
      'SessionStorage'
    ),
  }
}
