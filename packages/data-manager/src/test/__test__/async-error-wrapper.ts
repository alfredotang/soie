/* eslint-disable @typescript-eslint/no-explicit-any */

const asyncErrorWrapper = async (callback: () => Promise<unknown>) => {
  try {
    await callback()
  } catch (_error) {
    return _error as any
  }
}

export default asyncErrorWrapper
