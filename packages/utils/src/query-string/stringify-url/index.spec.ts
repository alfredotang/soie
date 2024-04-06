import stringifyUrl from '.'

describe('query-string stringify-url', () => {
  const url = 'https://example.com'

  it('should return url without query', () => {
    expect(stringifyUrl({ url })).toBe(url)
  })

  it('should return url with query', () => {
    expect(stringifyUrl({ url, query: { a: 'b' } })).toBe(`${url}?a=b`)
  })
})
