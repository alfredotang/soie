export default function getNumberSafe(value: string, defaultValue = 0) {
  const result = parseFloat(value)
  if (result !== 0 && !result) return defaultValue

  return result
}
