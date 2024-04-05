# @soie/data-manager

The **@soie/data-manager** library is designed to encapsulate Restful, GraphQL, localStorage, and sessionStorage, providing a simple way to handle asynchronous events.

## Table of Contents
- [@soie/data-manager](#soiedata-manager)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration Options](#configuration-options)
    - [createDataManager](#createdatamanager)
  - [Restful](#restful)
    - [query](#query)
      - [Usage](#usage)
      - [Using with TypeScript](#using-with-typescript)
    - [mutation](#mutation)
      - [Usage](#usage-1)
      - [Using with typeScript](#using-with-typescript-1)
  - [Storage](#storage)
    - [query](#query-1)
      - [Usage](#usage-2)
      - [Using with TypeScript](#using-with-typescript-2)
    - [update](#update)
      - [Usage](#usage-3)
    - [delete](#delete)
      - [Usage](#usage-4)
    - [clear](#clear)
      - [Usage](#usage-5)
  - [GraphQL](#graphql)
    - [Usage](#usage-6)
    - [Using with TypeScript](#using-with-typescript-3)

## Installation
Using npm:
```bash
npm i @soie/data-manager
```
Using yarn:
```bash
yarn add @soie/data-manager
```
Using pnpm:
```bash
pnpm add @soie/data-manager
```

---

## Configuration Options
### createDataManager
- **requestConfig**
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
- **storagePrefix**
  - Your `localStorage` or `sessionStorage` key prefix, default is `'data-manager'`
    - `localStorage`: `{storagePrefix}-ls-{your-key}`
    - `sessionStorage`: `{storagePrefix}-ss-{your-key}`
  - **type**: string
  - **default**: `'data-manager'`
- **transformer**
  - global transform key case for every request
    - **transformRequestToSnakeCase**: transform your request body or query string key into snake case
    - **transformResponseToCamelCase**: transform your response body's key into camel case
  - **default**:
    - `transformRequestToSnakeCase`: `false`
    - `transformResponseToCamelCase`: `false`

---
## Restful
### query
- **endpoint**
  - **path**
    - **type**: string
  - **params**
    - **type**: any javascript `object`
    - **default**: `undefined`
    ```js 
     const { data } = await dataManager.query({ 
        path: 'https://some-api',
        params: {
          limit: 10,
          offset: 0,
        } 
    })
    // it will be generated to 'https://some-api?limit=10&offset=0'
    ```
  - **arrayFormat**
    - [array format](https://www.npmjs.com/package/query-string#arrayformat-1)
    - **type**: `'bracket' | 'index' | 'comma' | 'separator' | 'bracket-separator' | 'colon-list-separator' | 'none'`
    - **default**: `'none'`
  - **transformer**
    - only transform key case in this request
      - **transformRequestToSnakeCase**: transform your request body or query string key into snake case
      - **transformResponseToCamelCase**: transform your response body's key into camel case
    - **default**: by global `transformer`
  - **requestInit**
    - [RequestInit MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
- **response**
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

#### Usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager ({
  requestConfig: {
    timeout: 3000,
    baseURL: 'https://pokeapi.co/api/v2',
    headers: {
      Authorization: `Bearer ${your token}`,
    }
  },
  transformer: {
    transformRequestToSnakeCase: true,
    transformResponseToCamelCase: true,
  }
})

const getPokemonList = async () => {
  const { data } = await dataManager.query({ 
    path: '/pokemon',
    params: {
      limit: 10,
      offset: 0,
    } 
  })
  return data
}
```
#### Using with TypeScript
```ts
import { createDataManager } from '@soie/data-manager'

type PokemonList = {
  // ...
}

const dataManager = createDataManager ({
  requestConfig: {
    timeout: 3000,
    baseURL: 'https://pokeapi.co/api/v2',
    headers: {
      Authorization: `Bearer ${your token}`,
    }
  },
  transformer: {
    transformRequestToSnakeCase: true,
    transformResponseToCamelCase: true,
  }
})

const getPokemonList = async (): Promise<PokemonList> => {
  const { data } = await dataManager.query<PokemonList>({ 
    path: '/pokemon',
    params: {
      limit: 10,
      offset: 0,
    } 
  })
  return data
}
```
### mutation
- **endpoint**
  - **path**
    - **type**: string
  - **params**
    - Request body
    - **type**: Any JavaScript `object`
    - **default**: `undefined`
  - **method**
    - Request method
    - **type**: `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'`
  - **transformer**
    - Only transforms key case in this request
      - **transformRequestToSnakeCase**: Transforms your request body or query string key into snake case
      - **transformResponseToCamelCase**: Transforms your response body's key into camel case
    - **default**: Global `transformer`
  - **requestInit**
    - [RequestInit MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
- **response**
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

#### Usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager({
  requestConfig: {
    timeout: 3000,
    baseURL: 'https://some-api/api',
    headers: {
      Authorization: `Bearer ${your token}`,
    }
  },
  transformer: {
    transformRequestToSnakeCase: true,
    transformResponseToCamelCase: true,
  }
})

const postPokemonName = async () => {
  await dataManager.mutation({ 
    path: '/pokemon',
    method: 'POST',
    params: {
      name: 'Hello'
    } 
  })
}
```
#### Using with typeScript
```ts
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager({
  requestConfig: {
    timeout: 3000,
    baseURL: 'https://some-api/api',
    headers: {
      Authorization: `Bearer ${your token}`,
    }
  },
  transformer: {
    transformRequestToSnakeCase: true,
    transformResponseToCamelCase: true,
  }
})

const postPokemonName = async () => {
  await dataManager.mutation<void>({ 
    path: '/pokemon',
    method: 'POST',
    params: {
      name: 'Hello'
    } 
  })
}
```
---
## Storage
### query
- **endpoint**
  - **path**
    - storage key, will be generated to
      - localStorage
        - `${storagePrefix}-ls-${ your key }`
      - sessionStorage
        - `${storagePrefix}-ss-${ your key }`
- **return**
  - **data**
    - `string` or `JSON` for storage
#### Usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager ({
  storagePrefix: 'hello'
})

// localStorage
const getLocalTheme = () => {
  const data = dataManager.ls.query('theme')
  return data
}

// sessionStorage
const getSessionTheme = () => {
  const data = dataManager.ss.query('theme')
  return data
}
```
#### Using with TypeScript
```ts
import { createDataManager } from '@soie/data-manager'

type Theme = {
  // ...
}

const dataManager = createDataManager ({
  storagePrefix: 'hello'
})

// localStorage
const getLocalTheme = () => {
  const data = dataManager.ls.query<Theme>('theme')
  return data
}

// sessionStorage
const getSessionTheme = () => {
  const data = dataManager.ss.query<Theme>('theme')
  return data
}
```
### update
- **endpoint**
  - **path**
    - storage key, will be generated to
      - localStorage
        - `${storagePrefix}-ls-${ your key }`
      - sessionStorage
        - `${storagePrefix}-ss-${ your key }`
  - **params**
    - any javascript `object`
- **return**: `void`
#### Usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager({
  storagePrefix: 'hello'
})

// localStorage
const setLocalTheme = () => {
  dataManager.ls.update(
    'theme', 
    {
      primary: "#FF5533"
    },
  )
}

// sessionStorage
const setSessionTheme = () => {
  dataManager.ss.update(
    'theme', 
    {
      primary: "#FF5533"
    },
  )
}
```
### delete
- **endpoint**
  - **path**
    - storage key, will be generated to
      - localStorage
        - `${storagePrefix}-ls-${ your key }`
      - sessionStorage
        - `${storagePrefix}-ss-${ your key }`
- **return**: `void`
#### Usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager({
  storagePrefix: 'hello'
})

// localStorage
const deleteLocalTheme = () => {
  dataManager.ls.delete('theme')
}

// sessionStorage
const deleteSessionTheme = () => {
  dataManager.ss.delete('theme')
}
```
### clear
- clear all storage by prefix is 
  - localStorage
    - `${storagePrefix}-ls`
  - sessionStorage
    - `${storagePrefix}-ss`
- **return**: `void`
#### Usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager({
  storagePrefix: 'hello'
})

// localStorage
const clearAllLocalStorage = () => {
  dataManager.ls.clear()
}

// sessionStorage
const clearAllSessionStorage = () => {
  dataManager.ss.clear()
}
```
---
## GraphQL
- **endpoint**
  - **path**
    - **type**: string
  - **params**
    - **query**: graphql query schema
    - **variables**: graphql query variables `optional`
    - **operationName**: graphql operation name `optional`

  - **transformer**
    - only transform key case in this request
      - **transformResponseToCamelCase**: transform your response body's key into camel case
    - `transformRequestToSnakeCase` is not provided because that will impact graphql query
    - **default**: by global `transformer`
  - **requestInit**
    - [RequestInit MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
- **response**
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
    - The status message corresponding
  - **message**
    - If `response.message` can be parsed by `JSON.parse`, it will return the parsed object; otherwise, it returns a string
  - **errors**
    - Returns [GraphQL errors](https://spec.graphql.org/October2021/#sec-Errors) or `[]`
      - **message**   
      - **locations**
      - **path**
      - **extensions**

### Usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager ({
  requestConfig: {
    timeout: 3000,
    baseURL: 'https://beta.pokeapi.co',
    headers: {
      Authorization: `Bearer ${your token}`,
    }
  }
})

// query
const getPokemonLocation = async () => {
  const { data } = await dataManager.gql({
    path: '/graphql/v1beta',
    params: { 
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
    } 
  })
  return data
}

// mutation
const postPokemonLocation = async () => {
  await dataManager.gql({
    path: '/graphql',
    params: { 
      query: `
        mutation locationAlola($region: String) {
          region: pokemon_v2_region(where: {name: {_eq: $region}}) {
            name
          }
        }
      `,
      variables: { 
        region: 'alola'
      },
      operationName: 'locationAlola'
    } 
  })
}

```
### Using with TypeScript
```ts
import { createDataManager } from '@soie/data-manager'

type PokemonLocation = {
  //...
}

const dataManager = createDataManager (
  requestConfig: {
    {
      timeout: 3000,
      baseURL: 'https://beta.pokeapi.co',
      headers: {
        Authorization: `Bearer ${your token}`,
      }
    }
  }
)

// query
const getPokemonLocation = async (): Promise<PokemonLocation> => {
  const { data } = await dataManager.gql<PokemonLocation>({
    path: '/graphql/v1beta',
    params: { 
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
    } 
  })
  return data
}

// mutation
const postPokemonLocation = async () => {
  await dataManager.gql<void>({
    path: '/graphql',
    params: { 
      query: `
        mutation locationAlola($region: String) {
          region: pokemon_v2_region(where: {name: {_eq: $region}}) {
            name
          }
        }
      `,
      variables: { 
        region: 'alola'
      },
      operationName: 'locationAlola'
    } 
  })
}
```
