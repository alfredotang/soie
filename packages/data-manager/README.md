# @soie/data-manager

The **@soie/data-manager** library is designed to encapsulate Restful, GraphQL, localStorage, and sessionStorage, providing a simple way to handle asynchronous events.

## Table of Contents
- [@soie/data-manager](#soiedata-manager)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration Options](#configuration-options)
    - [createDataManager](#createdatamanager)
  - [Restful](#restful)
    - [Query](#query)
      - [Usage](#usage)
      - [Using with TypeScript](#using-with-typescript)
    - [Mutation](#mutation)
      - [usage](#usage-1)
      - [using with typeScript](#using-with-typescript-1)
  - [Storage](#storage)
    - [LocalStorage](#localstorage)
      - [Query](#query-1)
        - [Usage](#usage-2)
        - [Using with TypeScript](#using-with-typescript-2)
      - [Mutation](#mutation-1)
        - [usage](#usage-3)
        - [using with typeScript](#using-with-typescript-3)
    - [SessionStorage](#sessionstorage)
      - [Query](#query-2)
        - [Usage](#usage-4)
        - [Using with TypeScript](#using-with-typescript-4)
      - [Mutation](#mutation-2)
        - [usage](#usage-5)
        - [using with typeScript](#using-with-typescript-5)
  - [GraphQL](#graphql)
    - [Usage](#usage-6)
    - [Using with TypeScript](#using-with-typescript-6)

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
### Query
**endpoint**
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
### Mutation
**endpoint**
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

#### usage
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

#### using with typeScript
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
### LocalStorage
#### Query
**endpoint**
  - **path**
    - storage key
    - **type**: string
    ```js
    const { data } = dataManager.ls.query('theme')

    // storage key will be generated to 
    // `${storagePrefix}-ls-theme`
    ```
##### Usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager ({
  storagePrefix: 'hello'
})

const getTheme = () => {
  const data = dataManager.ls.query('theme')
  return data
}
```
- **response**
  - **data**
    - `string` or `JSON` for storage
##### Using with TypeScript
```ts
import { createDataManager } from '@soie/data-manager'

type Theme = {
  // ...
}

const dataManager = createDataManager ({
  storagePrefix: 'hello'
})

const getTheme = (): Theme => {
  const data = dataManager.ls.query<Theme>('theme')
  return data
}
```
#### Mutation
**endpoint**
  - **path**
    - Storage key
    - **type**: string
    ```js
    dataManager.ls.mutation({
      method: 'UPDATE',
      path: 'theme',
      params: {
        primary: '#FF5534'
      }
    })

    // Storage key will be generated to 
    // `${storagePrefix}-ls-theme`
    ```
  - **method**
    - **type**: `'UPDATE' | 'CLEAR' | 'DELETE'`
    - `UPDATE`: storage.setItem
    - `DELETE`: storage.deleteItem
    - `CLEAR`: clear all storage by prefix is `${storagePrefix}`
  - **params**
    - When using `UPDATE`, you need to pass value

##### usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager({
  storagePrefix: 'hello'
})

const setTheme = () => {
  dataManager.ls.mutation({ 
    method: 'UPDATE',
    path: 'theme',
    params: {
      primary: "#FF5533"
    },
  })
}

const deleteTheme = () => {
  dataManager.ls.mutation({ 
    method: 'DELETE',
    path: 'theme',
  })
}

const clearAllLocalStorage = () => {
  dataManager.ls.mutation({ 
    method: 'CLEAR',
  })
}
```

- **Response**: `void`

##### using with typeScript
```ts
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager({
  storagePrefix: 'hello'
})

const setTheme = () => {
  dataManager.ls.mutation<void>({ 
    method: 'UPDATE',
    path: 'theme',
    params: {
      primary: "#FF5533"
    },
  })
}

const deleteTheme = () => {
  dataManager.ls.mutation<void>({ 
    method: 'DELETE',
    path: 'theme',
  })
}

const clearAllLocalStorage = () => {
  dataManager.ls.mutation<void>({ 
    method: 'CLEAR',
  })
}
```
### SessionStorage
#### Query
**endpoint**
  - **path**
    - storage key
    - **type**: string
    ```js
    const { data } = dataManager.ss.query('theme')

    // storage key will be generated to 
    // `${storagePrefix}-ss-theme`
    ```
##### Usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager ({
  storagePrefix: 'hello'
})

const getTheme = () => {
  const data = dataManager.ss.query('theme')
  return data
}
```
- **response**
  - **data**
    - `string` or `JSON` for storage
##### Using with TypeScript
```ts
import { createDataManager } from '@soie/data-manager'

type Theme = {
  // ...
}

const dataManager = createDataManager ({
  storagePrefix: 'hello'
})

const getTheme = (): Theme => {
  const data = dataManager.ss.query<Theme>('theme')
  return data
}
```
#### Mutation
**endpoint**
  - **path**
    - Storage key
    - **type**: string
    ```js
    dataManager.ss.mutation({
      method: 'UPDATE',
      path: 'theme',
      params: {
        primary: '#FF5534'
      }
    })

    // Storage key will be generated to 
    // `${storagePrefix}-ss-theme`
    ```
  - **method**
    - **type**: `'UPDATE' | 'CLEAR' | 'DELETE'`
    - `UPDATE`: storage.setItem
    - `DELETE`: storage.deleteItem
    - `CLEAR`: clear all storage by prefix is `${storagePrefix}`
  - **params**
    - When using `UPDATE`, you need to pass value

##### usage
```js
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager({
  storagePrefix: 'hello'
})

const setTheme = () => {
  dataManager.ss.mutation({ 
    method: 'UPDATE',
    path: 'theme',
    params: {
      primary: "#FF5533"
    },
  })
}

const deleteTheme = () => {
  dataManager.ss.mutation({ 
    method: 'DELETE',
    path: 'theme',
  })
}

const clearAllLocalStorage = () => {
  dataManager.ss.mutation({ 
    method: 'CLEAR',
  })
}
```

- **Response**: `void`

##### using with typeScript
```ts
import { createDataManager } from '@soie/data-manager'

const dataManager = createDataManager({
  storagePrefix: 'hello'
})

const setTheme = () => {
  dataManager.ss.mutation<void>({ 
    method: 'UPDATE',
    path: 'theme',
    params: {
      primary: "#FF5533"
    },
  })
}

const deleteTheme = () => {
  dataManager.ss.mutation<void>({ 
    method: 'DELETE',
    path: 'theme',
  })
}

const clearAllLocalStorage = () => {
  dataManager.ss.mutation<void>({ 
    method: 'CLEAR',
  })
}
```
---
## GraphQL
**endpoint**
  - **path**
    - **type**: string
  - **params**
    ```js
    const { data } = await dataManager.gql({
      path: 'https://someapi/graphql',
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
    ```
    - **query**: graphql query schema
    - **variables**: graphql query variables, optional
    - **operationName**: graphql operation name, optional

  - **transformer**
    - only transform key case in this request
      - **transformResponseToCamelCase**: transform your response body's key into camel case
    - `transformRequestToSnakeCase` is not provided because that will impact graphql query
    - **default**: by global `transformer`
  - **requestInit**
    - [RequestInit MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)

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
    - The status message corresponding
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
