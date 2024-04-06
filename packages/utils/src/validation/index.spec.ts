import { errorWrapper } from '@soie/utils/test-utils'

import validation from '.'

describe('validation', () => {
  const msg = 'validation'
  it('pass', () => {
    expect(validation(true, msg)).toBe(undefined)
  })
  it('failed', () => {
    expect(
      errorWrapper(() => {
        validation(false, msg)
      })
    ).toEqual(new TypeError(msg))
  })
})
