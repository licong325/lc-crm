/**
 * 阿拉伯文语言包
 * @module ar-SA
 * @example
 * // الاستخدام
 * $t('common.login') // Returns: 'تسجيل الدخول'
 * $t('common.copyright', { year: 2024 }) // Returns: '© 2024 Azal Admin. جميع الحقوق محفوظة'
 *
 * // التبديل إلى العربية
 * i18n.locale.value = 'ar-SA'
 *
 * // 注意：阿拉伯文是从右到左(RTL)的书写方向
 * // 切换到阿拉伯文时会自动设置 dir="rtl"
 */
export default {
  common: {
    login: 'تسجيل الدخول',
    logout: 'تسجيل خروج',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    loginButton: 'تسجيل الدخول',
    inputUsername: 'الرجاء إدخال اسم المستخدم',
    inputPassword: 'الرجاء إدخال كلمة المرور',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    loginFailed: 'فشل تسجيل الدخول',
    forgotPassword: 'نسيت كلمة المرور؟',
    welcomeBack: 'مرحبا بعودتك، يرجى تسجيل الدخول إلى حسابك',
    copyright: '© {year} Great Li CRM. جميع الحقوق محفوظة.',
    // ... الترجمات الأخرى
  },
  menu: {
    home: 'الصفحة الرئيسية',
    manage: 'إدارة',
    // ... 菜单翻译
  },
}
