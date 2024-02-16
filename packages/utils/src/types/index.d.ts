export type Stringifiable =
  | string
  | number
  | boolean
  | Array<string | number | boolean | object>
  | object
  | null

export type StringifiableRecord = Record<string, Stringifiable>
