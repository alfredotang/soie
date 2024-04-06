export const SPLIT_LOWER_UPPER_REGEXP = /([\p{Ll}\d])(\p{Lu})/gu
export const SPLIT_UPPER_UPPER_REGEXP = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu
export const DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu
export const SPLIT_REPLACE_VALUE_REGEXP = '$1\0$2'
export const SPLIT_SEPARATE_NUMBER_REGEXP = /\d/gu
