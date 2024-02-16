export default function getIntSafe(value: string, defaultValue = 0) {
  const result = parseInt(value, 10)
  if (result !== 0 && !result) return defaultValue

  return result
}
