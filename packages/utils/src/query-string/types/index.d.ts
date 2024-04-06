export type ArrayFormat =
  | 'index'
  | 'bracket'
  | 'comma'
  | 'separator'
  | 'bracket-separator'
  | 'colon-list-separator'
  | 'none'

export type StringifyOptions = {
  arrayFormat?: ArrayFormat
  arrayFormatSeparator?: string
  skipNull?: boolean
  skipEmptyString?: boolean
}

export type Encodiable = string | number | boolean
export type Stringifiable = Encodiable | null | undefined

export type StringifyInput = Record<string, Stringifiable | Stringifiable[]>
