/**
 * Vue I18n 配置文件
 * 用于初始化国际化功能
 * @module i18n
 */
import { createI18n } from 'vue-i18n'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './config'
import zhCN from './zh-CN'
import enUS from './en-US'
import arSA from './ar-SA'

/**
 * 创建 i18n 实例
 * @example
 * // 在 main.js 中使用
 * app.use(i18n)
 */
const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: localStorage.getItem('language') || DEFAULT_LANGUAGE, // 默认语言
  fallbackLocale: DEFAULT_LANGUAGE, // 备用语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ar-SA': arSA,
  },
})

export default i18n
