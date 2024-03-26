import {
  Controller,
  KeyCaseTransformer,
  RestfulProtocol,
} from '@/data-manager/types'

import createRestfulMutationExecutor from './mutation'
import createRestfulQueryExecutor from './query'

const createRestful = ({
  controller,
  transformer,
}: {
  controller: Controller<RestfulProtocol>
  transformer?: KeyCaseTransformer
}) => {
  return {
    query: createRestfulQueryExecutor(controller, transformer),
    mutation: createRestfulMutationExecutor(controller, transformer),
  }
}

export default createRestful
