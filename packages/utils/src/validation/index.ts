export default function validation(
  condition: unknown,
  message: string,
  enabled = true
) {
  if (condition || !enabled) return

  throw TypeError(message)
}
