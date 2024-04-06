import split from '@soie/utils/change-case/split'

export const noCase = (input: string, delimiter: string = ' ') =>
  split(input).join(delimiter)

export default noCase
