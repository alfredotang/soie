/* eslint-disable @typescript-eslint/no-explicit-any */

export const errorWrapper = (callback: () => any) => {
  try {
    callback()
  } catch (_error) {
    return _error as any
  }
}

export const asyncErrorWrapper = async (callback: () => Promise<any>) => {
  try {
    await callback()
  } catch (_error) {
    return _error as any
  }
}
