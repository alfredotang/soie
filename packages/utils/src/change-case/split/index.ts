import {
  DEFAULT_STRIP_REGEXP,
  SPLIT_LOWER_UPPER_REGEXP,
  SPLIT_REPLACE_VALUE_REGEXP,
  SPLIT_SEPARATE_NUMBER_REGEXP,
  SPLIT_UPPER_UPPER_REGEXP,
} from './constants'

export default function split(input: string) {
  const result = input
    .trim()
    .replace(SPLIT_SEPARATE_NUMBER_REGEXP, '\0$&\0')
    .replace(SPLIT_LOWER_UPPER_REGEXP, SPLIT_REPLACE_VALUE_REGEXP)
    .replace(SPLIT_UPPER_UPPER_REGEXP, SPLIT_REPLACE_VALUE_REGEXP)
    .replace(DEFAULT_STRIP_REGEXP, '\0')

  let start = 0
  let end = result.length

  while (result.charAt(start) === '\0') start++
  if (start === end) return []
  while (result.charAt(end - 1) === '\0') end--

  return result
    .slice(start, end)
    .split(/\0/g)
    .map(val => val.toLowerCase())
}
