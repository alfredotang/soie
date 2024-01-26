# @soie/fetcher

The **@soie/fetcher** library is a straightforward set of [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) utilities. It facilitates easy usage of both RESTful and GraphQL HTTP requests and is compatible with all modern browsers and Node.js 18+.

## Table of content
- [@soie/fetcher](#soiefetcher)
  - [Table of content](#table-of-content)
  - [Installation](#installation)
  - [createFetcher](#createfetcher)
    - [Configuration Options](#configuration-options)
    - [`fetcher(url: string, init?: RequestInit)`](#fetcherurl-string-init-requestinit)
    - [Using with TypeScript](#using-with-typescript)
  - [createGraphQLFetcher](#creategraphqlfetcher)
    - [Configuration Options](#configuration-options-1)
    - [`graphQLFetcher(url: string, init?: RequestInit excluding 'method')`](#graphqlfetcherurl-string-init-requestinit-excluding-method)
    - [Using with TypeScript](#using-with-typescript-1)


## Installation
Using npm:
```bash
npm i @soie/fetcher
```
Using yarn:
```bash
yarn add @soie/fetcher
```
Using pnpm:
```bash
pnpm add @soie/fetcher
```
## createFetcher
### Configuration Options
- **timeout**
  - Specifies the timeout in milliseconds before a request times out. If the request takes longer than the timeout, it will be aborted.
  - **type**: number
  - **default**: undefined
- **baseURL**
  - Prepends the baseURL to the URL unless the URL is absolute.
  - **type**: string
  - **default**: `''`
- **headers**
  - Allows you to add headers to every request. It can be a Headers object or an object literal with string values.
  - **type**: `Header` or object literal with String `{ "key": "value"}`
  - **default**: undefined

### `fetcher(url: string, init?: RequestInit)`
- **url**
- **init**
  - [RequestInit MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
```js
import { createFetcher } from '@soie/fetcher'

const fetcher = createFetcher({
  timeout: 3000,
  baseURL: 'https://pokeapi.co/api/v2',
  headers: {
    Authorization: `Bearer ${your token}`,
  }
})

const getPokemonList = async () => {
  const { data } = await fetcher('/pokemon')
  return data
}
```
- **response**
  - No need to use `response.json()`, as the fetcher maps response data into:
  - **status**
    - The status code of the response
    - **type**: number
  - **statusText**
    - The status message corresponding to the status code
    - **type**: string
  - **header**
    - The [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) object associated with the response.
    - **type**: [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
    - Use `headers.get('your header key')` to get the header's value.
  - **data**
    - The API response body in JSON format
- **errors**
  - If there is a request error, it will always return an `error` object
  - **status**
    - The status code of the response
    - **type**: number
  - **statusText**
    - The status message corresponding to the status code
    - **type**: string
  - **header**
    - The [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) object associated with the response.
    - **type**: [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
    - Use `headers.get('your header key')` to get the header's value
  - **message**
    - If `response.message` can be parsed by `JSON.parse`, it will return the parsed object; otherwise, it returns a string

### Using with TypeScript
```ts
import { createFetcher } from '@soie/fetcher'

type PokemonList = {
  // ...
}

const fetcher = createFetcher({
  timeout: 3000,
  baseURL: 'https://pokeapi.co/api/v2',
  headers: {
    Authorization: `Bearer ${your token}`,
  }
})

const getPokemonList = async (): Promise<PokemonList> => {
  const { data } = await fetcher<PokemonList>('/pokemon')
  return data
}
```
## createGraphQLFetcher
### Configuration Options
```js
import { createGraphQLFetcher } from '@soie/fetcher'

const graphQLFetcher = createGraphQLFetcher({
  timeout: 3000,
  baseURL: 'https://beta.pokeapi.co',
  headers: {
    Authorization: `Bearer ${your token}`,
  }
})
```
- **timeout**
  - Specifies the timeout in milliseconds before a request times out
  - If the request takes longer than the timeout, it will be aborted.
  - **type**: number
  - **default**: undefined
- **baseURL**
  - Prepends the baseURL to the URL unless the URL is absolute.
  - **type**: string
  - **default**: `''`
- **headers**
  - Allows you to add headers to every request. It can be a Headers object or an object literal with string values.
  - **type**: `Header` or object literal with String `{ "key": "value"}`
  - **default**: undefined

### `graphQLFetcher(url: string, init?: RequestInit excluding 'method')`
- **url**
- **init**
  - [RequestInit MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
  - In `graphQLFetcher`, `method` is always set to `POST`, so you don't need to pass it.
```js
import { createGraphQLFetcher } from '@soie/fetcher'

const graphQLFetcher = createGraphQLFetcher({
  timeout: 3000,
  baseURL: 'https://beta.pokeapi.co',
  headers: {
    Authorization: `Bearer ${your token}`,
  }
})

const getPokemonLocationAlola = async () => {
  
  const { data } = await graphQLFetcher(
    '/graphql/v1beta', 
    { 
      body: JSON.stringify({
        query: `
          query locationAlola($region: String) {
            region: pokemon_v2_region(where: {name: {_eq: $region}}) {
              name
            }
          }
        `,
        variables: { 
          region: 'alola'
        },
        operationName: 'locationAlola'
      })
    }
  )
  return data
}
```
- **response**
  - No need to use `response.json()`, as the fetcher maps response data into:
  - **status**
    - The status code of the response
    - **type**: number
  - **statusText**
    - The status message corresponding to the status code
    - **type**: string
  - **header**
    - The [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) object associated with the response.
    - **type**: [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
    - Use `headers.get('your header key')` to get the header's value
  - **data**
    - The API response body in JSON format
- **errors**
  - If there is a request error, it will always return an `error` object
  - **status**
    - The status code of the response
    - **type**: number
  - **statusText**
    - The status message corresponding to the status code
    - **type**: string
  - **header**
    - The [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) object associated with the response.
    - **type**: [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
    - Use `headers.get('your header key')` to get the header's value
  - **message**
    - If `response.message` can be parsed by `JSON.parse`, it will return the parsed object; otherwise, it returns a string
  - **errors**
    - Returns [GraphQL errors](https://spec.graphql.org/October2021/#sec-Errors) or `[]`
      - **message**   
      - **locations**
      - **path**
      - **extensions**

### Using with TypeScript
```ts
import { createGraphQLFetcher } from '@soie/fetcher'

type PokemonLocationAlola = {
  // ...
}

const graphQLFetcher = createGraphQLFetcher({
  timeout: 3000,
  baseURL: 'https://beta.pokeapi.co',
  headers: {
    Authorization: `Bearer ${your token}`,
  }
})

const getPokemonLocationAlola = async (): Promise<PokemonLocationAlola> => {
  
  const { data } = await graphQLFetcher<PokemonLocationAlola>(
    '/graphql/v1beta', 
    { 
      body: JSON.stringify({
        query: `
          query locationAlola($region: String) {
            region: pokemon_v2_region(where: {name: {_eq: $region}}) {
              name
            }
          }
        `,
        variables: { 
          region: 'alola'
        },
        operationName: 'locationAlola'
      })
    }
  )
  return data
}
```