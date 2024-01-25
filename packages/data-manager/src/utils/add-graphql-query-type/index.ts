const checks = ['query ', 'mutation ']

const addGraphqlQueryType = (query: string, type: 'query' | 'mutation') => {
  const hasType = checks.some(check =>
    query.replace(/\n/g, '').trimStart().startsWith(check)
  )

  if (hasType) return query.trimStart()

  return `${type} ${query.trimStart()}`
}

export default addGraphqlQueryType
