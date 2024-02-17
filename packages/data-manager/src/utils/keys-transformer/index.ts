/* eslint-disable @typescript-eslint/no-explicit-any */
import camelcaseKeys, { type CamelCaseKeys } from 'camelcase-keys'
import snakecaseKeys, { type SnakeCaseKeys } from 'snakecase-keys'

type TransformerEnable = boolean | undefined

type SnakeCaseTarget = Parameters<typeof snakecaseKeys>[0]
type SnakeCaseTransformerResult<T, E extends TransformerEnable> = E extends true
  ? T extends SnakeCaseTarget
    ? SnakeCaseKeys<T, true, readonly unknown[], ''>
    : T
  : T

type CamelCaseTarget = Parameters<typeof snakecaseKeys>[0]
type CamelCaseTransformerResult<T, E extends TransformerEnable> = E extends true
  ? T extends CamelCaseTarget
    ? CamelCaseKeys<
        T,
        true,
        boolean,
        boolean,
        readonly unknown[],
        readonly string[],
        ''
      >
    : T
  : T

export const snakeCaseKeysTransformer = <
  T,
  E extends TransformerEnable = undefined,
>(
  value: T,
  enable?: E
): SnakeCaseTransformerResult<T, E> => {
  try {
    return enable
      ? snakecaseKeys(value as any, {
          deep: true,
        })
      : value
  } catch (err) {
    console.error('transformer key to snake case error', err)
    return value as SnakeCaseTransformerResult<T, E>
  }
}

export const camelCaseTransformer = <
  T,
  E extends TransformerEnable = undefined,
>(
  value: T,
  enable?: E
): CamelCaseTransformerResult<T, E> => {
  try {
    return enable
      ? camelcaseKeys(value as any, {
          deep: true,
        })
      : value
  } catch (err) {
    console.error('transformer key to camel case error', err)
    return value as CamelCaseTransformerResult<T, E>
  }
}

camelCaseTransformer(new Headers(), true)
