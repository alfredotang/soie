const createAbortSignal = (
  _signals?: Array<AbortSignal | undefined | null>
) => {
  const signals = _signals?.filter(Boolean)
  if (!signals?.length) return

  const controller = new AbortController()

  function onAbort() {
    controller.abort()
    if (!signals?.length) return
    for (const signal of signals) {
      signal?.removeEventListener('abort', onAbort)
    }
  }

  for (const signal of signals) {
    if (signal?.aborted) {
      onAbort()
      break
    }
    signal?.addEventListener('abort', onAbort)
  }

  return controller.signal
}

export default createAbortSignal
