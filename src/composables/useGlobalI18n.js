/**
 * 全局国际化工具函数
 * @module useGlobalI18n
 */
import i18n from '@/locales'

/**
 * 创建全局 i18n 实例，提供完整的国际化功能
 * 主要用于需要切换语言的场景
 * @returns {Object} 包含语言设置
 * @example
 * const { locale } = useGlobalI18n()
 * // 切换语言
 * locale.value = 'en-US'
 */
export function useGlobalI18n() {
  return {
    locale: i18n.global.locale,
  }
}

/**
 * 为组件提供翻译方法
 * @returns {Function} 翻译函数
 * @example
 * const t = useGlobalT()
 * const message = t('common.login')
 */
export function useGlobalT() {
  return i18n.global.t
}
