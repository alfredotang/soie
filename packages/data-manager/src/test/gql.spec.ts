import { createDataManager } from '@soie/data-manager'
import { asyncErrorWrapper } from '@soie/utils/test-utils'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const baseURL = 'https://api.afu.com/v1'
const gql = String.raw

const afuql = graphql.link(`${baseURL}/graphql`)

const server = setupServer(
  afuql.query('Hello', ({ variables }) => {
    return HttpResponse.json({
      data: {
        name: {
          full_name: variables.name,
          nick_name: 'yes',
        },
      },
    })
  }),
  afuql.query('Error', () => {
    return HttpResponse.json({
      errors: [{ message: 'Request failed' }],
    })
  }),
  afuql.mutation('Hello', ({ variables }) => {
    return HttpResponse.json({
      data: {
        name: {
          full_name: variables.name,
          nick_name: 'yes',
        },
      },
    })
  }),
  afuql.mutation('Error', ({ variables }) => {
    return HttpResponse.json({
      errors: [{ message: variables.message }],
    })
  })
)
const d = createDataManager({ requestConfig: { baseURL } })

describe('dataManager graphql', () => {
  beforeAll(() => {
    server.listen()
  })
  afterAll(() => {
    server.close()
  })

  describe('query', () => {
    describe('fulfilled', () => {
      describe('is response data correct', () => {
        describe('transformer response body to camel case', () => {
          it('false', async () => {
            const { data } = await d.gql<object>({
              path: '/graphql',
              params: {
                query: gql`
                  query Hello {
                    full_name
                  }
                `,
                variables: {
                  name: 'alfredo',
                },
              },
            })

            expect(data).toEqual({
              name: {
                full_name: 'alfredo',
                nick_name: 'yes',
              },
            })
          })
          describe('true', () => {
            describe('with transform excludes', () => {
              it('true', async () => {
                const { data } = await d.gql<object>({
                  path: '/graphql',
                  params: {
                    query: gql`
                      query Hello {
                        full_name
                      }
                    `,
                    variables: {
                      name: 'alfredo',
                    },
                  },
                  transformer: {
                    transformResponseToCamelCase: true,
                    transformResponseExcludes: ['nick_name'],
                  },
                })

                expect(data).toEqual({
                  name: {
                    fullName: 'alfredo',
                    nick_name: 'yes',
                  },
                })
              })
              it('false', async () => {
                const { data } = await d.gql<object>({
                  path: '/graphql',
                  params: {
                    query: gql`
                      query Hello {
                        full_name
                      }
                    `,
                    variables: {
                      name: 'alfredo',
                    },
                  },
                  transformer: {
                    transformResponseToCamelCase: true,
                  },
                })

                expect(data).toEqual({
                  name: {
                    fullName: 'alfredo',
                    nickName: 'yes',
                  },
                })
              })
            })
          })
        })
      })
    })

    it('failed', async () => {
      const error = await asyncErrorWrapper(async () =>
        d.gql<object>({
          path: '/graphql',
          params: {
            query: gql`
              query Error {
                name
              }
            `,
          },
        })
      )
      expect(error.errors).toEqual([{ message: 'Request failed' }])
    })
  })
  describe('mutation', () => {
    describe('fulfilled', () => {
      describe('is response data correct', () => {
        describe('transformer response body to camel case', () => {
          it('false', async () => {
            const { data } = await d.gql<object>({
              path: '/graphql',
              params: {
                query: gql`
                  mutation Hello {
                    full_name
                  }
                `,
                variables: {
                  name: 'Jacky',
                },
              },
            })

            expect(data).toEqual({
              name: {
                full_name: 'Jacky',
                nick_name: 'yes',
              },
            })
          })
          describe('with transform excludes', () => {
            it('true', async () => {
              const { data } = await d.gql<object>({
                path: '/graphql',
                params: {
                  query: gql`
                    mutation Hello {
                      full_name
                    }
                  `,
                  variables: {
                    name: 'Jacky',
                  },
                },
                transformer: {
                  transformResponseToCamelCase: true,
                  transformResponseExcludes: ['nick_name'],
                },
              })

              expect(data).toEqual({
                name: {
                  fullName: 'Jacky',
                  nick_name: 'yes',
                },
              })
            })
            it('false', async () => {
              const { data } = await d.gql<object>({
                path: '/graphql',
                params: {
                  query: gql`
                    mutation Hello {
                      full_name
                    }
                  `,
                  variables: {
                    name: 'Jacky',
                  },
                },
                transformer: {
                  transformResponseToCamelCase: true,
                },
              })

              expect(data).toEqual({
                name: {
                  fullName: 'Jacky',
                  nickName: 'yes',
                },
              })
            })
          })
        })
      })
    })

    it('failed', async () => {
      const error = await asyncErrorWrapper(
        async () =>
          await d.gql<object>({
            path: '/graphql',
            params: {
              query: gql`
                mutation Error {
                  name
                }
              `,
              variables: {
                message: 'Ops! Error',
              },
            },
          })
      )
      expect(error.errors).toEqual([{ message: 'Ops! Error' }])
    })
  })
})
