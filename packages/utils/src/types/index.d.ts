export type Stringifiable =
  | string
  | number
  | bigint
  | boolean
  | Array<string | number | boolean | object | bigint>
  | object
  | null

export type StringifiableRecord = Record<string, Stringifiable>
