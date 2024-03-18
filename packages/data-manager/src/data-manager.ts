import { createGraphQL, createMutation, createQuery } from './define'
import createInstances from './instances'
import { Controller, DataManagerConfig, Protocol } from './types'

export const createDataManager = ({
  requestConfig,
  storagePrefix = 'data-manager',
  transformer,
}: DataManagerConfig = {}) => {
  const instances = createInstances(requestConfig)

  const controller = <T extends Protocol>(protocol: T) => {
    return instances[protocol] as Controller<T>
  }

  return {
    query: createQuery({
      controller,
      transformer,
      storagePrefix,
    }),
    mutation: createMutation({
      controller,
      transformer,
      storagePrefix,
    }),
    gql: createGraphQL({ controller, transformer }),
  }
}
