import { errorWrapper } from '@soie/utils/test-utils'

import validationFlow from '.'

describe('validationFlow', () => {
  it('pass', () => {
    expect(
      validationFlow(
        [true, 'boolean'],
        [NaN, 'number', false],
        ['string', 'string']
      )
    ).toBe(undefined)
  })
  it('failed', () => {
    expect(
      errorWrapper(() => {
        validationFlow([true, 'boolean'], [NaN, 'number'], ['string', 'string'])
      })
    ).toEqual(new TypeError('number'))
  })
})
