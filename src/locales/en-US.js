/**
 * 英文语言包
 * @module en-US
 * @example
 * // Usage
 * $t('common.login') // Returns: 'Login'
 * $t('common.copyright', { year: 2024 }) // Returns: '© 2024 Azal Admin...'
 *
 * // Switch to English
 * i18n.locale.value = 'en-US'
 */
export default {
  common: {
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember me',
    loginButton: 'Login',
    inputUsername: 'Please input username',
    inputPassword: 'Please input password',
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    forgotPassword: 'Forgot password?',
    welcomeBack: 'Welcome back, please login to your account',
    copyright: '© {year} Great Li CRM. All rights reserved.',
    // ... 其他公共翻译
  },
  menu: {
    home: 'Home',
    manage: 'Manage',
    // ... 菜单翻译
  },
}
