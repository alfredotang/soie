/* eslint-disable @typescript-eslint/no-explicit-any */
import camelcaseKeys, { type CamelCaseKeys } from 'camelcase-keys'
import snakecaseKeys, { type SnakeCaseKeys } from 'snakecase-keys'

type ValidValue = readonly any[] | Record<string, any>
type TransformerEnable = boolean | undefined

type SnakeCaseTransformerResult<T, E extends TransformerEnable> = E extends true
  ? T extends ValidValue
    ? SnakeCaseKeys<T, true, readonly unknown[], ''>
    : T
  : T

type CamelCaseTransformerResult<T, E extends TransformerEnable> = E extends true
  ? T extends ValidValue
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
      ? (snakecaseKeys(value as any, {
          deep: true,
        }) as any)
      : value
  } catch (err) {
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
      ? (camelcaseKeys(value as any, {
          deep: true,
        }) as any)
      : value
  } catch {
    return value as CamelCaseTransformerResult<T, E>
  }
}
