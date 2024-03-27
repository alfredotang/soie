import createAbortSignalErrorMessage from '.'

const properties = ['status', 'statusText', 'headers', 'message']
describe('createAbortSignalErrorMessage', () => {
  const result = createAbortSignalErrorMessage()
  properties.forEach(property => {
    it(`should return an object with ${property}`, () => {
      expect(result).toHaveProperty(property)
    })
  })
})
