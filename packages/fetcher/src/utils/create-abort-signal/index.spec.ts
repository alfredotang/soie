import createAbortSignal from '.'

describe('createAbortSignal', () => {
  it('should return undefined if no signals are passed', () => {
    expect(createAbortSignal()).toBeUndefined()
  })

  it('should abort the controller if any signal is aborted', () => {
    const controller = new AbortController()
    const signal = controller.signal
    const abortSignal = createAbortSignal([signal])

    controller.abort()

    expect(abortSignal?.aborted).toBe(true)
  })

  it('should remove event listeners when the controller is aborted', () => {
    const controller = new AbortController()
    const signal = controller.signal
    const abortSignal = createAbortSignal([signal])

    controller.abort()

    expect(abortSignal?.aborted).toBe(true)
  })
})
