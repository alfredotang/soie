import keyTransformer from '.'

const headers = new Headers({
  helloWorld: 'a',
})

describe('keyTransformer', () => {
  describe('camelcase', () => {
    describe('is enabled', () => {
      describe('false', () => {
        it('should be returned origin input', () => {
          expect(
            keyTransformer(
              { hello_world: 'no', action_headers: headers },
              {
                changeCase: 'camelcase',
                enabled: false,
              }
            )
          ).toEqual({
            hello_world: 'no',
            action_headers: headers,
          })
        })
      })
      describe('true', () => {
        describe('has excludes case', () => {
          it('yes', () => {
            expect(
              keyTransformer(
                {
                  hello_world: 'no',
                  hello: {
                    action_url_1: true,
                  },
                  names: [
                    { action_url_1: true, full_name: '1' },
                    { action_url_1: false, full_name: '2' },
                  ],
                  action_headers: headers,
                },
                {
                  changeCase: 'camelcase',
                  excludes: ['action_url'],
                }
              )
            ).toEqual({
              helloWorld: 'no',
              hello: {
                action_url_1: true,
              },
              names: [
                { action_url_1: true, fullName: '1' },
                { action_url_1: false, fullName: '2' },
              ],
              actionHeaders: headers,
            })
          })
          it('no', () => {
            expect(
              keyTransformer(
                {
                  hello_world: 'no',
                  hello: {
                    action_url_1: true,
                  },
                  names: [
                    { action_url_1: true, full_name: '1' },
                    { action_url_1: false, full_name: '2' },
                  ],
                  action_headers: headers,
                },
                {
                  changeCase: 'camelcase',
                }
              )
            ).toEqual({
              helloWorld: 'no',
              hello: {
                actionUrl_1: true,
              },
              names: [
                { actionUrl_1: true, fullName: '1' },
                { actionUrl_1: false, fullName: '2' },
              ],
              actionHeaders: headers,
            })
          })
        })
      })
    })
    describe('is not object or array', () => {
      it('string', () => {
        expect(
          keyTransformer('hello_world', {
            changeCase: 'camelcase',
          })
        ).toBe('hello_world')
      })
      it('number', () => {
        expect(
          keyTransformer(2, {
            changeCase: 'camelcase',
          })
        ).toBe(2)
      })
      it('boolean', () => {
        expect(
          keyTransformer(true, {
            changeCase: 'camelcase',
          })
        ).toBe(true)
      })
    })
  })
  describe('snakecase', () => {
    describe('is enabled', () => {
      describe('false', () => {
        it('should be returned origin input', () => {
          expect(
            keyTransformer(
              { helloWorld: 'no', actionHeaders: headers },
              {
                changeCase: 'snakecase',
                enabled: false,
              }
            )
          ).toEqual({
            helloWorld: 'no',
            actionHeaders: headers,
          })
        })
      })
      describe('true', () => {
        describe('has excludes case', () => {
          it('yes', () => {
            expect(
              keyTransformer(
                {
                  helloWorld: 'no',
                  hello: {
                    actionUrl: '1',
                    locationList: [1, 2, 3],
                  },
                  names: [
                    { fullName: '1', nickName: '11' },
                    { fullName: '2', nickName: '21' },
                  ],
                  actionHeaders: headers,
                },
                {
                  changeCase: 'snakecase',
                  excludes: ['nickName'],
                }
              )
            ).toEqual({
              hello_world: 'no',
              hello: {
                action_url: '1',
                location_list: [1, 2, 3],
              },
              names: [
                { full_name: '1', nickName: '11' },
                { full_name: '2', nickName: '21' },
              ],
              action_headers: headers,
            })
          })
          it('no', () => {
            expect(
              keyTransformer(
                {
                  helloWorld: 'no',
                  hello: {
                    actionUrl: '1',
                    locationList: [1, 2, 3],
                  },
                  names: [
                    { fullName: '1', nickName: '11' },
                    { fullName: '2', nickName: '21' },
                  ],
                  actionHeaders: headers,
                },
                {
                  changeCase: 'snakecase',
                }
              )
            ).toEqual({
              hello_world: 'no',
              hello: {
                action_url: '1',
                location_list: [1, 2, 3],
              },
              names: [
                { full_name: '1', nick_name: '11' },
                { full_name: '2', nick_name: '21' },
              ],
              action_headers: headers,
            })
          })
        })
      })
    })
    describe('is not object or array', () => {
      it('string', () => {
        expect(
          keyTransformer('helloWorld', {
            changeCase: 'snakecase',
          })
        ).toBe('helloWorld')
      })
      it('number', () => {
        expect(
          keyTransformer(2, {
            changeCase: 'snakecase',
          })
        ).toBe(2)
      })
      it('boolean', () => {
        expect(
          keyTransformer(true, {
            changeCase: 'snakecase',
          })
        ).toBe(true)
      })
    })
  })
})
