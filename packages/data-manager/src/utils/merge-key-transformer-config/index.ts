import type {
  KeyCaseTransformer,
  KeyTransformerOptions,
} from '@/data-manager/types'

const mergeExcludeList = (
  defaultConfig: KeyTransformerOptions['excludes'],
  config: KeyTransformerOptions['excludes']
): KeyTransformerOptions['excludes'] => {
  if (!defaultConfig?.length && !config?.length) return []
  if (!defaultConfig?.length) return config
  if (!config?.length) return defaultConfig

  return [...new Set([...defaultConfig, ...config])]
}

const mergeKeyTransformerConfig = (
  defaultConfig: Partial<KeyCaseTransformer> | undefined,
  config: Partial<KeyCaseTransformer> | undefined
): KeyCaseTransformer => {
  return {
    request: {
      enabled:
        defaultConfig?.request?.enabled || config?.request?.enabled || false,
      changeCase:
        config?.request?.changeCase ||
        defaultConfig?.request?.changeCase ||
        undefined,
      excludes: mergeExcludeList(
        defaultConfig?.request?.excludes,
        config?.request?.excludes
      ),
    },
    response: {
      enabled:
        defaultConfig?.response?.enabled || config?.response?.enabled || false,
      changeCase:
        config?.response?.changeCase ||
        defaultConfig?.response?.changeCase ||
        undefined,
      excludes: mergeExcludeList(
        defaultConfig?.response?.excludes,
        config?.response?.excludes
      ),
    },
  }
}

export default mergeKeyTransformerConfig
