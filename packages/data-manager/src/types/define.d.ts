import type { FetcherResult } from '@soie/fetcher'

import type { ProtocolWithoutGQL, StorageProtocol } from './data-manager'
import type { Endpoint, Method, StorageMutationMethod } from './endpoint'

export declare function QueryFunc<TResult, P extends ProtocolWithoutGQL>(
  endpoint: Endpoint<'Query', 'GET', P>
): P extends StorageProtocol
  ? Promise<TResult>
  : Promise<FetcherResult<TResult>>

export declare function QueryFunc<TResult>(
  endpoint: Endpoint<'Query', 'GET', 'Restful'>
): Promise<FetcherResult<TResult>>

export declare function QueryFunc<TResult>(
  endpoint: Endpoint<'Query', 'GET', StorageProtocol>
): Promise<TResult>

export declare function MutationFunc<TResult, P extends ProtocolWithoutGQL>(
  endpoint: Endpoint<'Mutation', Method, P>
): P extends StorageProtocol ? Promise<void> : Promise<FetcherResult<TResult>>

export declare function MutationFunc<TResult>(
  endpoint: Endpoint<'Mutation', Method, 'Restful'>
): Promise<FetcherResult<TResult>>

export declare function MutationFunc<M extends StorageMutationMethod>(
  endpoint: Endpoint<'Mutation', M, StorageProtocol>
): Promise<void>
