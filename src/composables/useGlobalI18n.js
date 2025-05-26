/**
 * 全局国际化工具函数
 * @module useGlobalI18n
 */
import i18n from '@/locales'

/**
 * 直接导出 i18n 实例的翻译方法
 * 用于全局属性和简单翻译场景
 * @example
 * // 在模板中使用
 * {{ $t('common.login') }}
 * // 在 JS 中使用
 * const message = globalT('common.login')
 */
export const globalT = i18n.global.t

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
