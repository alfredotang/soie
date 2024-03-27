import { createFetcher } from '@soie/fetcher'
import { asyncErrorWrapper } from '@soie/utils/test-utils'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const baseURL = 'https://api.afu.com/v1'

const methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] as const
const httpMethods = ['get', 'post', 'put', 'patch', 'delete'] as const

const server = setupServer(
  ...httpMethods.map(method =>
    http[method](`${baseURL}/hello`, async ({ request }) => {
      if (method === 'get') {
        return HttpResponse.json({ method: 'get' })
      }
      const body = await request.json()
      return HttpResponse.json(body)
    })
  ),
  ...httpMethods.map(method =>
    http[method](
      `${baseURL}/error`,
      () =>
        new HttpResponse(
          JSON.stringify({ message: 'error', error_code: 123 }),
          {
            status: 400,
            headers: {
              status: 'no',
            },
          }
        )
    )
  )
)

const fetcher = createFetcher({ baseURL })

describe('fetcher', () => {
  beforeAll(() => {
    server.listen()
  })
  afterAll(() => {
    server.close()
  })

  describe('fulfilled', () => {
    describe('GET', () => {
      it('is response data correct', async () => {
        const { data } = await fetcher<{ method: string }>('/hello')

        expect(data).toEqual({ method: 'get' })
      })
    })
    methods
      .filter(item => item !== 'GET')
      .forEach(method => {
        describe(method, () => {
          it('is response data correct', async () => {
            const { data } = await fetcher<{ method: string }>('/hello', {
              method,
              body: JSON.stringify({ method: method.toLowerCase() }),
            })

            expect(data).toEqual({ method: method.toLowerCase() })
          })
        })
      })
  })

  describe('rejected', () => {
    methods.forEach(method => {
      describe(method, () => {
        it('is error message correct', async () => {
          const error = await asyncErrorWrapper(
            async () =>
              await fetcher('/error', {
                method,
              })
          )
          expect({
            message: error.message,
            status: error.status,
            statusText: error.statusText,
          }).toEqual({
            message: { message: 'error', error_code: 123 },
            status: 400,
            statusText: 'Bad Request',
          })
        })
      })
    })
  })
})
