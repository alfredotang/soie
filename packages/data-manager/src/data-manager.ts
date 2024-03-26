import { createGraphQL, createRestful, createStorage } from './define'
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

  const { query, mutation } = createRestful({
    controller: restfulController,
    transformer: defaultTransformer,
  })

  const gql = createGraphQL({
    controller: graphQLController,
    transformer: defaultTransformer,
  })
  const ls = createStorage({
    controller: localStorageController,
    storagePrefix,
    protocol: 'LocalStorage',
  })
  const ss = createStorage({
    controller: sessionStorageController,
    storagePrefix,
    protocol: 'SessionStorage',
  })

  return {
    query,
    mutation,
    gql,
    ls,
    ss,
  }
}
