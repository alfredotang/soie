import getSafeMessage from '.'

describe('getSafeMessage', () => {
  describe('message can not be pared by JSON.pares', () => {
    it('should returned org string', () => {
      expect(getSafeMessage('{ "hello:')).toBe('{ "hello:')
    })
  })
  describe('message is not string', () => {
    it('should returned "error"', () => {
      expect(getSafeMessage(2)).toBe('error')
    })
  })
  describe('message can be pared by JSON.pares', () => {
    it('should returned object', () => {
      expect(getSafeMessage(JSON.stringify({ hello: 'world' }))).toEqual({
        hello: 'world',
      })
    })
  })
})
