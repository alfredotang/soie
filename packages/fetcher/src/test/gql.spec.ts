import { createGraphQLFetcher } from '@soie/fetcher'
import { asyncErrorWrapper } from '@soie/utils/test-utils'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const baseURL = 'https://api.afu.com/v1'

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

const fq = createGraphQLFetcher({ baseURL: baseURL })
const gql = String.raw

describe('fetcher graphql', () => {
  beforeAll(() => {
    server.listen()
  })
  afterAll(() => {
    server.close()
  })

  describe('query', () => {
    it('fulfilled', async () => {
      const { data } = await fq<object>('/graphql', {
        body: JSON.stringify({
          query: gql`
            query Hello {
              full_name
            }
          `,
          variables: {
            name: 'alfredo',
          },
        }),
      })

      expect(data).toEqual({
        full_name: 'alfredo',
      })
    })

    it('failed', async () => {
      const error = await asyncErrorWrapper(async () =>
        fq<object>('/graphql', {
          body: JSON.stringify({
            query: gql`
              query Error {
                name
              }
            `,
          }),
        })
      )
      expect(error.errors).toEqual([{ message: 'Request failed' }])
    })
  })
  describe('mutation', () => {
    it('fulfilled', async () => {
      const { data } = await fq<object>('/graphql', {
        body: JSON.stringify({
          query: gql`
            mutation Hello {
              full_name
            }
          `,
          variables: {
            name: 'Jacky',
          },
        }),
      })

      expect(data).toEqual({
        full_name: 'Jacky',
      })
    })

    it('failed', async () => {
      const error = await asyncErrorWrapper(
        async () =>
          await fq<object>('/graphql', {
            body: JSON.stringify({
              query: gql`
                mutation Error {
                  name
                }
              `,
              variables: {
                message: 'Ops! Error',
              },
            }),
          })
      )
      expect(error.errors).toEqual([{ message: 'Ops! Error' }])
    })
  })
})
