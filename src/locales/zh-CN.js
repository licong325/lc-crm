/**
 * 中文语言包
 * @module zh-CN
 * @description 默认语言包，包含所有界面文字的中文翻译
 *
 * @example
 * // 基础用法
 * $t('common.login') // 返回: '登录'
 * $t('common.copyright', { year: 2024 }) // 返回: '© 2024 Azal Admin...'
 *
 * // 切换到中文
 * i18n.locale.value = 'zh-CN'
 */
export default {
  common: {
    login: '登录',
    loginButton: '登 录',
    username: '用户名',
    password: '密码',
    rememberMe: '记住我',
    inputUsername: '请输入用户名',
    inputPassword: '请输入密码',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    forgotPassword: '忘记密码？',
    welcomeBack: '欢迎回来，请登录您的账号',
    logout: '退出登录',
    copyright: '© {year} Great Li CRM. 版权所有。',
  },
  menu: {
    // 菜单项
    home: '首页',
    manage: '管理',
  },
}
