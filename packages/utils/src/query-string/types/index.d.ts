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
