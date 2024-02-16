export type TypeTag =
  | 'Number'
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Array'
  | 'Object'
  | 'Undefined'
  | 'Null'
  | 'Symbol'
  | 'Function'
  | 'Promise'
  | 'NaN'

export default function getTypeTag(value: unknown): TypeTag {
  if (typeof value === 'number' && isNaN(value)) return 'NaN'
  const _type = Object.prototype.toString
    .call(value)
    .replace(/(\[object|\]|\s)/g, '')

  return _type as TypeTag
}
