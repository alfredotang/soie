import { createMutation, createQuery } from './define'
import createInstances from './instances'
import {
  Controller,
  DataManagerConfig,
  KeyCaseTransformer,
  Protocol,
} from './types'

export const gql = String.raw

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

  const instances = createInstances(requestConfig)

  const controller = <T extends Protocol>(protocol: T) => {
    return instances[protocol] as Controller<T>
  }

  return {
    query: createQuery({
      controller,
      transformer: defaultTransformer,
      storagePrefix,
    }),
    mutation: createMutation({
      controller,
      transformer: defaultTransformer,
      storagePrefix,
    }),
  }
}
