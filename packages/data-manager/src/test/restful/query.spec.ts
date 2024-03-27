import { createDataManager } from '@soie/data-manager'
import { asyncErrorWrapper } from '@soie/utils/test-utils'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const baseURL = 'https://api.afu.com/v1'

const server = setupServer(
  http.get(`${baseURL}/hello`, ({ request }) => {
    const { searchParams } = new URL(request.url)
    const hello_world = searchParams.get('hello_world')
    return HttpResponse.json({
      url: request.url,
      hello_world,
    })
  }),
  http.get(`${baseURL}/error`, () => {
    return new HttpResponse(
      JSON.stringify({ message: 'error', error_code: 123 }),
      { status: 400, headers: { status: 'no' } }
    )
  })
)
const d = createDataManager({ requestConfig: { baseURL } })

describe('dataManager restful query', () => {
  beforeAll(() => {
    server.listen()
  })
  afterAll(() => {
    server.close()
  })

  describe('fulfilled', () => {
    describe('is request url correct', () => {
      describe('transformer request params to snake case', () => {
        it('false', async () => {
          const { data } = await d.query<object>({
            path: '/hello',
            params: { helloWorld: 'hi' },
          })

          expect(data).toEqual({
            url: `${baseURL}/hello?helloWorld=hi`,
            hello_world: null,
          })
        })
        it('true', async () => {
          const { data } = await d.query<object>({
            path: '/hello',
            params: { helloWorld: 'hi' },
            transformer: {
              transformRequestToSnakeCase: true,
            },
          })
          expect(data).toEqual({
            url: `${baseURL}/hello?hello_world=hi`,
            hello_world: 'hi',
          })
        })
      })
    })
    describe('is response data correct', () => {
      describe('transformer response body to camel case', () => {
        it('false', async () => {
          const { data } = await d.query<object>({
            path: '/hello',
            params: { helloWorld: 'hi' },
            transformer: {
              transformRequestToSnakeCase: true,
            },
          })

          expect(data).toEqual({
            url: `${baseURL}/hello?hello_world=hi`,
            hello_world: 'hi',
          })
        })
        it('true', async () => {
          const { data } = await d.query<object>({
            path: '/hello',
            params: { helloWorld: 'hi' },
            transformer: {
              transformRequestToSnakeCase: true,
              transformResponseToCamelCase: true,
            },
          })

          expect(data).toEqual({
            url: `${baseURL}/hello?hello_world=hi`,
            helloWorld: 'hi',
          })
        })
      })
    })
  })

  describe('failed', () => {
    describe('transformer response body to camel case', () => {
      it('false', async () => {
        const error = await asyncErrorWrapper(
          async () =>
            await d.query<object>({
              path: '/error',
              params: { helloWorld: 'hi' },
            })
        )

        expect({
          message: error?.message,
          headerStatus: error?.headers.get('status'),
        }).toEqual({
          headerStatus: 'no',
          message: {
            message: 'error',
            error_code: 123,
          },
        })
      })
      it('true', async () => {
        const error = await asyncErrorWrapper(
          async () =>
            await d.query<object>({
              path: '/error',
              params: { helloWorld: 'hi' },
              transformer: {
                transformResponseToCamelCase: true,
              },
            })
        )

        expect({
          message: error?.message,
          headerStatus: error?.headers.get('status'),
        }).toEqual({
          headerStatus: 'no',
          message: {
            message: 'error',
            errorCode: 123,
          },
        })
      })
    })
  })
})
