import split from '@soie/utils/change-case/split'

const camelCase = (input: string) =>
  split(input).reduce((acc, val, index) => {
    if (!index) return val.toLowerCase()

    return `${acc}${val[0].toUpperCase()}${val.slice(1).toLowerCase()}`
  }, '')

export default camelCase
