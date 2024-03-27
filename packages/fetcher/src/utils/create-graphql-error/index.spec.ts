import createGraphQLError from '.'

// write your tests here
describe('createGraphQLError', () => {
  it('should return an object with errors array', () => {
    const error = createGraphQLError('error')
    expect(error.errors).toEqual([])
  })

  it('should return the same object if it has errors array', () => {
    const error = createGraphQLError({ errors: ['error'] })
    expect(error.errors).toEqual(['error'])
  })
})
