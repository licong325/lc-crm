/**
 * 语言配置文件
 * @module languageConfig
 */

// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
  {
    key: 'zh-CN',
    label: '中文',
    abbr: 'ZH',
  },
  {
    key: 'en-US',
    label: 'English',
    abbr: 'EN',
  },
  {
    key: 'ar-SA',
    label: 'العربية',
    abbr: 'AR',
    dir: 'rtl', // 从右到左书写方向
  },
]

// 默认语言
export const DEFAULT_LANGUAGE = 'zh-CN'

// 获取语言配置
export function getLanguageConfig(key) {
  return SUPPORTED_LANGUAGES.find((lang) => lang.key === key)
}

// 获取语言缩写
export function getLanguageAbbr(key) {
  return getLanguageConfig(key)?.abbr || 'ZH'
}
