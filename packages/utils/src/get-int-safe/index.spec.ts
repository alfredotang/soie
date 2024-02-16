import getIntSafe from '.'

describe('getIntSafe', () => {
  describe('"1"', () => {
    it('should be returned 1', () => {
      expect(getIntSafe('1')).toBe(1)
    })
  })
  describe('"s"', () => {
    describe('should be returned default value', () => {
      describe('not defined default value', () => {
        it('should be returned 0', () => {
          expect(getIntSafe('s')).toBe(0)
        })
      })
      describe('defined default value 12', () => {
        it('should be returned 12', () => {
          expect(getIntSafe('s', 12)).toBe(12)
        })
      })
    })
  })
})
