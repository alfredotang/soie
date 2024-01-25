import type { FetcherResult } from '@soie/fetcher'

import type { HTTPProtocol, Protocol, StorageProtocol } from './data-manager'
import type { Endpoint, Method } from './endpoint'

export declare function QueryFunc<TResult, P extends Protocol>(
  endpoint: Endpoint<'Query', 'GET', P>
): P extends StorageProtocol
  ? Promise<TResult>
  : Promise<FetcherResult<TResult>>

export declare function QueryFunc<TResult>(
  endpoint: Endpoint<'Query', 'GET', HTTPProtocol>
): Promise<FetcherResult<TResult>>

export declare function QueryFunc<TResult>(
  endpoint: Endpoint<'Query', 'GET', StorageProtocol>
): Promise<TResult>

export declare function MutationFunc<TResult, P extends Protocol>(
  endpoint: Endpoint<'Mutation', Method, P>
): P extends StorageProtocol ? Promise<void> : Promise<FetcherResult<TResult>>

export declare function MutationFunc<TResult>(
  endpoint: Endpoint<'Mutation', Method, HTTPProtocol>
): Promise<FetcherResult<TResult>>

export declare function MutationFunc<TResult>(
  endpoint: Endpoint<'Mutation', Method, HTTPProtocol>
): Promise<FetcherResult<TResult>>

export declare function MutationFunc(
  endpoint: Endpoint<'Mutation', Method, StorageProtocol>
): Promise<void>
