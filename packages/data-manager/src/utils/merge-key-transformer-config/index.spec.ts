import mergeKeyTransformerConfig from '.'

describe('mergeKeyTransformerConfig', () => {
  it('is correct', () => {
    expect(
      mergeKeyTransformerConfig(
        {
          request: { enabled: false, excludes: ['hello'] },
          response: { enabled: false, excludes: ['hello'] },
        },
        {
          request: {
            enabled: true,
            excludes: ['hello', 'world'],
            changeCase: 'snakecase',
          },
          response: {
            enabled: true,
            excludes: ['hello', 'world'],
            changeCase: 'camelcase',
          },
        }
      )
    ).toEqual({
      request: {
        enabled: true,
        excludes: ['hello', 'world'],
        changeCase: 'snakecase',
      },
      response: {
        enabled: true,
        excludes: ['hello', 'world'],
        changeCase: 'camelcase',
      },
    })
  })
})
