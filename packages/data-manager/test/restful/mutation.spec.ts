import { createDataManager, type RestfulMethod } from '@soie/data-manager'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const baseURL = 'https://api.afu.com/v1'
const methods: RestfulMethod[] = ['POST', 'PATCH', 'PUT', 'DELETE']
const httpMethods = ['post', 'put', 'patch', 'delete'] as const

const server = setupServer(
  ...httpMethods.map(method =>
    http[method](`${baseURL}/hello`, async ({ request }) => {
      if (method === 'delete') {
        return HttpResponse.json({})
      }

      const body = await request.json()
      return HttpResponse.json(body)
    })
  ),
  ...httpMethods.map(method =>
    http[method](`${baseURL}/form`, async ({ request }) => {
      if (method === 'delete') {
        return HttpResponse.json({})
      }

      const body = await request.formData()
      return HttpResponse.json(body.get('hello'))
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
          }
        )
    )
  )
)
const d = createDataManager({ requestConfig: { baseURL } })

describe('dataManager restful mutation', () => {
  beforeAll(() => {
    server.listen()
  })
  afterAll(() => {
    server.close()
  })

  describe('fulfilled', () => {
    methods
      .filter(method => method !== 'DELETE')
      .forEach(method => {
        describe(method, () => {
          describe('is response data correct', () => {
            describe('transformer request params to snake case', () => {
              it('false', async () => {
                const { data } = await d.mutation<object>({
                  path: '/hello',
                  method,
                  params: { helloWorld: 'hi' },
                })

                expect(data).toEqual({
                  helloWorld: 'hi',
                })
              })
              it('true', async () => {
                const { data } = await d.mutation<object>({
                  path: '/hello',
                  method,
                  params: { helloWorld: 'hi' },
                  transformer: {
                    transformRequestToSnakeCase: true,
                  },
                })

                expect(data).toEqual({
                  hello_world: 'hi',
                })
              })
            })
            describe('transformer response body to camel case', () => {
              it('false', async () => {
                const { data } = await d.mutation<object>({
                  path: '/hello',
                  method,
                  params: { hello_world: 'hi' },
                })

                expect(data).toEqual({
                  hello_world: 'hi',
                })
              })
              it('true', async () => {
                const { data } = await d.mutation<object>({
                  path: '/hello',
                  method,
                  params: { hello_world: 'hi' },
                  transformer: {
                    transformResponseToCamelCase: true,
                  },
                })

                expect(data).toEqual({
                  helloWorld: 'hi',
                })
              })
            })
            it('form data', async () => {
              const params = new FormData()
              params.append('hello', 'world')
              const { data } = await d.mutation<string>({
                path: '/form',
                method,
                params,
              })
              expect(data).toBe('world')
            })
          })
        })
      })
    describe('DELETE', () => {
      it('is response data correct', async () => {
        const res = await d.mutation<void>({
          path: '/hello',
          method: 'DELETE',
        })
        expect(res.status).toBe(200)
      })
    })
  })
  describe('failed', () => {
    methods.forEach(method => {
      describe(method, () => {
        describe('is response data correct', () => {
          describe('transformer response body to camel case', () => {
            it('false', () => {
              d.mutation<object>({
                path: '/error',
                method,
              }).catch(error => {
                expect(error).toEqual({
                  status: 400,
                  statusText: 'error',
                  headers: new Headers(),
                  message: {
                    message: 'error',
                    error_code: 123,
                  },
                })
              })
            })
            it('true', async () => {
              d.mutation<object>({
                path: '/error',
                method,
                transformer: {
                  transformResponseToCamelCase: true,
                },
              }).catch(error => {
                expect(error).toEqual({
                  status: 400,
                  statusText: 'error',
                  headers: new Headers(),
                  message: {
                    message: 'error',
                    errorCode: 123,
                  },
                })
              })
            })
          })
        })
      })
    })
  })
})
