import getTypeTag, { type TypeTag } from '@soie/utils/get-type-tag'

const getPropertySafe = <T>({
  target,
  propertyName,
  type,
  defaultValue,
}: {
  target: unknown
  propertyName: string
  type: TypeTag
  defaultValue: T
}): T => {
  if (
    target &&
    typeof target === 'object' &&
    propertyName in target &&
    getTypeTag(target[propertyName as keyof typeof target]) === type
  ) {
    return target[propertyName as keyof typeof target]
  }

  return defaultValue
}

export default getPropertySafe
