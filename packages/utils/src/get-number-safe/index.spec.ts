import getNumberSafe from '.'

describe('getNumberSafe', () => {
  describe('"1"', () => {
    it('should be returned 1', () => {
      expect(getNumberSafe('1')).toBe(1)
    })
  })
  describe('"1.1"', () => {
    it('should be returned 1.1', () => {
      expect(getNumberSafe('1.1')).toBe(1.1)
    })
  })
  describe('"s"', () => {
    describe('should be returned default value', () => {
      describe('not defined default value', () => {
        it('should be returned 0', () => {
          expect(getNumberSafe('s')).toBe(0)
        })
      })
      describe('defined default value 1.2', () => {
        it('should be returned 12', () => {
          expect(getNumberSafe('s', 1.2)).toBe(1.2)
        })
      })
    })
  })
})
