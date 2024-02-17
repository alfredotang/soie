import { createDataManager } from '@soie/data-manager'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const baseURL = 'https://api.afu.com/v1'
const gql = String.raw

const afuql = graphql.link(`${baseURL}/graphql`)

const server = setupServer(
  afuql.query('Hello', ({ variables }) => {
    return HttpResponse.json({
      data: {
        full_name: variables.name,
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
        full_name: variables.name,
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
              full_name: 'alfredo',
            })
          })
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
              },
            })

            expect(data).toEqual({
              fullName: 'alfredo',
            })
          })
        })
      })
    })

    it('failed', () => {
      d.gql<object>({
        path: '/graphql',
        params: {
          query: gql`
            query Error {
              name
            }
          `,
        },
      }).catch(error => {
        expect(error.errors).toEqual([{ message: 'Request failed' }])
      })
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
              full_name: 'Jacky',
            })
          })
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
              },
            })

            expect(data).toEqual({
              fullName: 'Jacky',
            })
          })
        })
      })
    })

    it('failed', () => {
      d.gql<object>({
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
      }).catch(error => {
        expect(error.errors).toEqual([{ message: 'Ops! Error' }])
      })
    })
  })
})
