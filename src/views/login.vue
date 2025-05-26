<script setup>
import { useUserStore } from '@/stores/user.js'
import { User, Lock, RefreshRight } from '@element-plus/icons-vue'
import { useGlobalT } from '@/composables/useGlobalI18n'

const t = useGlobalT()
const router = useRouter()
const userStore = useUserStore()
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
  captchaId: '',
})

const loading = ref(false)
const captchaSvg = ref('')

const getCaptcha = async () => {
  try {
    captchaSvg.value =
      '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0,0,120,40"><path fill="#934ed9" d="M91.88 34.38L92.00 34.50L90.44 34.46L90.36 34.38Q87.33 34.37 86.48 32.47L86.42 32.42L86.44 32.44Q87.60 31.63 88.90 30.64L88.80 30.55L88.85 30.60Q89.39 32.56 91.94 32.42L91.82 32.31L91.82 32.31Q92.64 32.38 93.56 32.18L93.65 32.26L93.63 32.24Q94.47 31.79 94.40 30.94L94.27 30.81L94.37 30.92Q94.20 29.83 92.60 29.21L92.63 29.24L89.15 27.80L89.26 27.91Q87.17 26.71 86.87 23.55L86.95 23.63L86.86 23.54Q86.68 21.63 88.62 21.12L88.62 21.12L88.55 21.05Q89.55 21.00 92.20 21.00L92.08 20.87L92.17 20.96Q96.42 20.87 97.24 23.11L97.36 23.23L97.24 23.11Q96.65 23.58 96.01 23.99L96.15 24.13L94.84 24.93L94.78 24.87Q94.39 23.22 91.50 23.01L91.55 23.07L91.56 23.07Q90.99 23.05 90.07 23.42L90.07 23.42L90.10 23.45Q89.50 23.66 89.50 24.65L89.47 24.62L89.59 24.74Q89.75 25.55 91.38 26.16L91.47 26.25L91.57 26.35Q92.42 26.59 94.80 27.57L94.77 27.55L94.71 27.48Q96.44 28.33 96.61 30.61L96.65 30.65L96.65 30.64Q96.60 31.11 96.54 31.99L96.59 32.04L96.65 32.10Q96.54 32.81 96.03 33.39L96.03 33.39L96.15 33.51Q94.64 34.42 91.92 34.42ZM96.22 36.78L96.15 36.70L96.16 36.72Q96.96 36.73 98.18 36.46L98.18 36.46L98.28 36.56Q99.13 35.85 98.96 34.76L98.92 34.72L98.90 34.70Q98.89 34.24 98.61 32.81L98.74 32.94L98.66 32.86Q98.20 30.25 96.60 29.17L96.54 29.11L96.50 29.07Q96.17 27.96 95.05 27.31L95.03 27.29L94.90 27.16Q93.80 26.81 91.59 25.96L91.69 26.06L91.55 25.92Q91.76 25.58 92.00 25.48L91.99 25.48L92.08 25.57Q92.53 25.06 93.10 25.03L93.20 25.12L93.16 25.09Q93.78 24.96 94.46 25.19L94.52 25.26L94.49 25.29L94.64 25.34L94.80 25.33L94.81 25.37L94.91 25.47Q95.93 25.95 96.10 27.07L96.05 27.02L96.00 26.97Q97.14 26.24 98.83 24.74L98.74 24.65L98.83 24.73Q98.63 24.13 97.75 23.07L97.68 23.01L97.63 22.96Q96.58 20.51 92.02 20.41L92.14 20.53L92.22 20.60Q89.28 20.45 87.51 20.96L87.44 20.89L87.56 21.01Q86.34 21.56 86.54 23.43L86.40 23.28L86.51 23.40Q86.49 24.39 87.30 26.26L87.46 26.42L87.40 26.36Q87.81 27.27 88.72 27.92L88.69 27.89L88.81 28.00Q89.39 29.30 90.54 29.91L90.64 30.01L90.58 29.95Q91.47 30.23 92.32 30.57L92.31 30.56L93.93 31.15L93.88 31.10Q93.64 32.16 91.91 32.06L91.82 31.97L92.01 32.16Q91.49 32.08 90.40 31.80L90.53 31.94L90.43 31.70L90.24 31.71L90.40 31.88Q89.63 31.55 89.05 30.22L88.96 30.13L88.96 30.13Q87.15 31.61 86.16 32.63L86.01 32.48L86.11 32.58Q86.31 33.32 87.23 34.04L87.29 34.10L87.15 34.23L87.07 34.15Q88.46 36.15 92.23 36.49L92.25 36.51L92.20 36.46Q93.37 36.61 96.26 36.81Z"/><path fill="#c362e4" d="M76.14 18.49L76.10 18.46L76.16 18.52Q74.58 14.82 69.04 14.99L69.13 15.09L68.95 14.91Q65.14 15.13 63.37 16.43L63.41 16.46L63.33 16.39Q61.11 17.87 61.11 21.54L61.10 21.53L61.27 23.37L61.21 23.31Q61.23 31.21 69.28 31.21L69.23 31.16L69.27 31.20Q71.01 31.11 72.34 30.39L72.51 30.57L72.45 30.51Q74.13 29.64 73.99 27.97L73.84 27.81L73.87 27.85Q73.70 25.97 70.40 25.16L70.54 25.29L68.80 25.29L68.63 25.13Q67.78 25.12 66.93 25.15L66.93 25.16L67.09 25.32Q66.94 24.32 66.91 22.62L66.90 22.60L66.97 22.68Q73.81 22.69 77.55 22.38L77.63 22.46L77.62 22.45Q77.57 23.18 77.57 23.89L77.43 23.76L77.57 23.90Q77.46 24.50 77.49 25.21L77.49 25.21L77.62 25.34Q76.60 25.31 76.60 25.31L76.53 25.23L76.55 25.25Q75.27 25.20 75.61 25.20L75.59 25.18L75.62 25.21Q76.73 26.80 77.07 28.56L77.05 28.55L76.90 28.39Q76.98 29.01 76.98 29.42L77.08 29.52L77.11 29.56Q76.99 33.59 69.14 33.59L69.23 33.68L69.14 33.59Q62.78 33.58 60.47 31.71L60.64 31.88L60.48 31.73Q58.77 29.67 58.77 25.15L58.73 25.12L58.77 25.15Q58.84 24.27 58.71 21.86L58.67 21.83L58.57 21.73Q58.45 19.64 58.49 18.41L58.62 18.55L58.53 18.46Q58.67 15.94 59.89 14.51L59.79 14.41L59.82 14.44Q62.07 12.58 66.42 12.41L66.45 12.44L68.86 12.40L68.92 12.46Q71.66 12.34 74.72 12.72L74.73 12.73L74.75 12.75Q78.00 13.07 78.85 15.96L78.98 16.09L78.94 16.06Q77.99 16.84 76.12 18.47ZM77.35 20.41L77.58 20.54L77.38 20.35Q78.55 19.47 80.21 17.70L80.15 17.64L80.18 17.67Q80.00 16.92 79.12 15.39L79.10 15.36L79.00 15.27Q78.09 13.03 74.69 12.45L74.58 12.34L74.64 12.40Q72.67 12.23 68.83 11.96L68.89 12.02L66.56 12.20L66.41 12.05Q61.76 12.20 59.45 13.97L59.45 13.97L59.44 13.96Q58.40 15.60 58.29 18.35L58.21 18.27L58.21 18.27Q58.26 17.91 58.47 22.81L58.37 22.71L58.45 22.79Q58.42 23.95 58.49 26.40L58.53 26.44L58.60 26.51Q58.74 30.45 60.30 32.19L60.29 32.18L60.29 32.18Q60.52 32.82 61.30 33.60L61.33 33.63L61.39 33.69Q63.86 35.24 68.79 35.54L68.82 35.57L71.55 35.89L71.40 35.74Q72.83 35.84 74.63 35.74L74.76 35.88L74.70 35.81Q75.97 35.72 77.84 35.24L77.93 35.34L77.95 35.35Q79.65 34.88 79.61 32.81L79.47 32.66L79.55 32.74Q79.48 31.55 78.52 29.07L78.63 29.18L78.54 29.08Q78.43 28.43 77.95 27.71L77.82 27.58L77.92 27.68Q78.33 27.58 79.39 27.75L79.45 27.82L79.41 27.78Q79.09 24.50 79.13 23.89L79.16 23.93L79.29 24.05Q78.86 23.96 78.48 23.93L78.52 23.96L78.56 24.01Q78.18 23.93 77.84 24.00L77.92 24.07L77.75 23.91Q77.91 23.08 77.98 22.13L77.79 21.94L77.88 22.03Q72.29 22.49 66.68 22.39L66.71 22.42L66.58 22.29Q66.68 23.17 66.68 23.98L66.62 23.92L66.61 25.48L66.67 25.54Q67.09 25.62 67.47 25.59L67.55 25.67L67.43 25.55Q67.70 25.45 68.11 25.45L68.25 25.59L68.14 25.48Q68.17 25.92 68.20 26.36L68.27 26.43L68.19 26.34Q68.27 26.83 68.23 27.27L68.16 27.20L68.24 27.28Q69.09 27.18 70.01 27.15L70.00 27.14L70.08 27.22Q70.96 27.17 71.87 27.21L71.82 27.15L71.85 27.19Q72.79 27.41 73.57 27.75L73.65 27.83L73.67 27.88L73.51 27.73Q73.76 29.19 72.26 30.01L72.22 29.97L72.20 29.95Q70.79 30.85 69.26 30.85L69.18 30.77L69.35 30.94Q65.77 30.80 63.60 29.23L63.64 29.28L63.58 29.21Q62.80 27.48 62.94 25.21L62.95 25.22L62.92 25.19Q63.29 21.00 64.93 19.22L64.88 19.16L64.85 19.13Q66.56 17.41 70.74 17.14L70.69 17.09L70.58 16.98Q73.87 16.80 75.60 18.39L75.65 18.44L75.64 18.43Q75.72 18.54 75.82 18.71L75.85 18.74L76.03 18.82L75.99 18.79Q76.54 19.43 77.05 20.42L76.94 20.31L77.42 20.49Z"/><path fill="#4fe775" d="M37.42 10.51L37.43 10.51L37.40 10.49Q40.74 12.71 44.99 12.91L44.94 12.87L45.06 12.98Q49.14 13.09 52.95 11.52L52.94 11.52L52.90 11.47Q52.75 12.04 52.07 14.52L51.99 14.44L52.06 14.51Q49.57 15.39 46.92 15.52L46.91 15.51L46.92 15.52Q44.38 15.77 41.80 15.13L41.80 15.13L41.72 15.05Q42.26 18.20 42.43 21.46L42.52 21.56L42.57 21.60Q44.31 21.75 45.74 21.72L45.77 21.75L45.66 21.63Q46.80 21.69 48.94 21.59L48.87 21.51L49.01 21.66Q48.95 22.21 48.95 22.82L48.87 22.74L48.86 23.92L48.96 24.02Q46.80 24.00 42.52 24.07L42.48 24.03L42.46 24.01Q42.48 27.71 41.97 31.27L41.93 31.24L41.93 31.24Q44.41 30.79 46.85 30.89L46.72 30.75L46.83 30.86Q49.25 30.94 51.56 31.69L51.52 31.64L51.48 31.61Q51.54 32.32 51.78 33.00L51.84 33.06L52.19 34.35L52.27 34.44Q49.32 33.18 46.26 33.18L46.40 33.32L46.24 33.16Q42.02 33.29 38.21 35.30L38.18 35.26L38.19 35.27Q40.15 29.08 39.91 22.72L40.02 22.83L39.92 22.73Q39.67 16.32 37.29 10.38ZM37.62 35.79L37.64 35.82L37.77 35.94Q38.84 35.25 39.52 34.94L39.59 35.02L39.52 34.94Q39.25 35.52 38.74 36.88L38.78 36.92L38.91 37.05Q42.90 35.23 47.42 35.47L47.39 35.43L47.39 35.44Q51.98 35.68 55.55 38.09L55.63 38.16L55.56 38.10Q54.58 35.90 53.97 34.16L53.84 34.03L53.87 34.07Q53.09 33.62 52.20 33.32L52.05 33.16L52.08 33.19Q51.85 32.07 51.71 31.36L51.58 31.23L51.66 31.31Q48.87 30.39 46.05 30.39L46.19 30.53L46.11 30.45Q45.13 30.49 44.11 30.59L44.08 30.56L44.12 30.60Q44.17 29.43 44.21 28.34L44.11 28.25L44.21 26.04L44.29 26.11Q45.82 25.95 47.42 25.98L47.54 26.11L47.46 26.02Q49.11 26.07 50.70 26.21L50.72 26.22L50.68 26.18Q50.74 25.46 50.74 24.61L50.60 24.47L50.56 22.73L49.98 22.93L50.03 22.99Q49.61 23.01 49.20 23.01L49.24 23.04L49.08 22.88Q49.07 22.26 49.21 21.11L49.39 21.28L49.32 21.22Q47.76 21.30 46.71 21.33L46.80 21.41L46.82 21.44Q45.88 21.35 44.25 21.28L44.42 21.45L44.37 21.40Q44.25 20.09 44.08 17.57L44.18 17.68L44.01 17.50Q44.94 17.62 45.82 17.62L45.91 17.70L45.99 17.78Q50.19 17.77 53.49 16.07L53.34 15.93L53.42 16.01Q53.86 13.83 54.64 11.85L54.75 11.96L54.72 11.94Q53.55 12.71 52.81 13.01L52.75 12.96L52.67 12.88Q53.11 12.36 53.52 10.97L53.43 10.88L53.41 10.86Q49.27 12.77 44.92 12.50L45.03 12.61L44.96 12.54Q40.29 12.33 36.86 9.78L36.69 9.61L36.87 9.79Q39.35 15.91 39.62 22.71L39.72 22.80L39.59 22.67Q39.99 29.87 37.75 35.92Z"/><path fill="#86e8b7" d="M21.08 15.23L21.10 15.26L19.73 15.38L19.60 15.25Q17.70 15.46 17.49 17.26L17.39 17.15L17.51 17.28Q17.30 17.78 17.34 18.66L17.46 18.79L17.36 18.69Q17.42 20.45 18.54 21.64L18.63 21.72L18.55 21.65Q19.79 22.95 21.49 22.82L21.37 22.70L21.32 22.64Q23.30 22.66 23.98 21.85L23.83 21.69L24.00 21.86Q24.82 20.91 25.05 18.90L25.10 18.95L25.15 19.00Q25.25 16.86 24.13 16.11L24.28 16.26L24.12 16.10Q23.52 15.57 21.14 15.30ZM26.36 23.37L26.43 23.44L25.33 25.53L25.32 25.52Q22.87 29.77 19.50 33.41L19.47 33.38L19.58 33.48Q18.01 33.51 15.60 34.23L15.65 34.28L15.64 34.27Q20.50 28.76 23.32 24.48L23.20 24.36L23.22 24.38Q22.30 24.96 20.84 25.02L20.76 24.94L20.83 25.02Q18.07 25.07 16.71 23.30L16.79 23.39L16.70 23.30Q15.79 22.04 14.80 17.96L14.72 17.89L14.83 17.99Q14.65 17.41 14.52 16.58L14.58 16.64L14.60 16.66Q14.42 15.78 14.42 15.37L14.38 15.33L14.47 15.42Q14.41 13.77 15.37 13.23L15.38 13.24L15.38 13.25Q16.40 12.50 18.07 12.50L18.26 12.69L18.13 12.56Q21.00 12.57 21.00 12.57L20.95 12.52L21.11 12.68Q22.90 12.57 24.02 12.74L24.10 12.82L24.07 12.79Q25.90 12.96 26.72 13.40L26.83 13.51L26.81 13.49Q28.05 14.19 28.22 15.75L28.26 15.78L28.21 15.74Q28.15 15.88 27.98 18.26L28.11 18.39L27.95 18.23Q27.59 20.12 27.39 20.86L27.39 20.86L27.42 20.90Q27.19 22.27 26.51 23.52ZM28.07 25.52L28.11 25.56L28.20 25.65Q29.12 23.72 29.59 19.88L29.45 19.73L29.47 19.75Q29.76 17.83 29.73 17.05L29.64 16.97L29.67 17.00Q29.72 15.41 28.67 14.60L28.72 14.65L28.35 14.45L28.34 14.44Q28.15 13.81 27.34 13.23L27.38 13.27L27.37 13.27Q25.24 12.29 20.96 12.15L20.91 12.11L20.91 12.11Q20.15 12.20 17.98 12.20L17.90 12.13L18.05 12.28Q16.42 12.21 15.10 12.82L15.13 12.86L15.14 12.86Q14.02 13.48 14.09 15.11L14.06 15.08L14.18 15.21Q14.25 15.92 14.42 17.72L14.43 17.73L14.41 17.71Q14.95 20.05 15.19 20.80L15.16 20.77L15.21 20.82Q15.66 22.43 16.51 23.58L16.68 23.76L16.60 23.68Q16.76 23.90 17.10 24.24L17.22 24.36L17.27 24.41Q17.47 24.79 18.05 25.60L18.02 25.57L18.05 25.60Q19.41 26.86 21.15 27.03L20.97 26.86L20.99 26.88Q19.26 29.23 17.87 30.92L17.99 31.05L14.73 34.93L14.70 34.89Q16.73 34.24 18.19 33.93L18.11 33.85L18.20 33.94Q17.55 34.75 16.16 36.28L16.15 36.27L16.08 36.20Q18.95 35.51 21.74 35.47L21.65 35.38L21.68 35.42Q23.69 33.04 27.56 26.58L27.66 26.68L27.53 26.62L27.58 26.67Q27.94 26.14 28.24 25.70ZM22.85 17.41L22.88 17.45L22.77 17.33Q23.42 17.34 23.83 17.44L23.78 17.39L23.83 17.45Q24.27 17.40 24.61 17.50L24.59 17.49L24.74 17.64Q24.67 17.81 24.74 18.18L24.78 18.22L24.84 18.28Q24.82 18.57 24.72 18.91L24.73 18.92L24.75 18.94Q24.72 20.47 23.66 21.46L23.80 21.59L23.66 21.45Q22.90 22.46 21.44 22.43L21.32 22.31L21.41 22.40Q21.00 22.36 19.64 22.09L19.69 22.14L19.69 22.14Q19.55 21.42 19.55 20.78L19.38 20.61L19.49 20.71Q19.42 20.48 19.42 20.28L19.37 20.22L19.32 20.17Q19.40 18.28 21.44 17.56L21.48 17.60L21.42 17.55Q22.04 17.35 22.79 17.35Z"/><path d="M8 39 C70 32,58 9,119 26" stroke="#5ba3ea" fill="none"/><path d="M4 13 C80 35,68 28,102 14" stroke="#afe37c" fill="none"/></svg>'
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

onMounted(() => {
  getCaptcha()
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名、密码和验证码')
    return
  }

  loading.value = true
  try {
    await userStore.login(loginForm.username, loginForm.password)
    ElMessage.success(t('common.loginSuccess'))
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message || t('common.loginFailed'))
    getCaptcha()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <LanguageSwitch />
    <div class="login-background">
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="shape shape3"></div>
    </div>
    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="logo" />
        </div>
        <h2>{{ $t('common.welcomeBack') }}</h2>
        <p>{{ $t('common.welcomeBack') }}</p>
      </div>
      <el-form :model="loginForm" class="login-form">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('common.inputUsername')"
            :prefix-icon="User"
            size="large" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            :placeholder="$t('common.inputPassword')"
            :prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <div class="captcha-container">
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              size="large"
              @keyup.enter="handleLogin" />
            <div class="captcha-wrapper" @click="getCaptcha">
              <span v-html="captchaSvg"> </span>
              <el-icon class="refresh-icon"><RefreshRight /></el-icon>
            </div>
          </div>
        </el-form-item>
        <div class="form-footer">
          <el-checkbox>{{ $t('common.rememberMe') }}</el-checkbox>
          <el-link type="primary">{{ $t('common.forgotPassword') }}</el-link>
        </div>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleLogin"
          class="login-button">
          {{ $t('common.login') }}
        </el-button>
      </el-form>
      <div class="login-footer">
        <p>© {{ new Date().getFullYear() }} Great Li CRM. {{ $t('common.copyright') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: url('@/assets/images/login_bg.jpg') center center / cover no-repeat;

  .login-box {
    width: 720px;
    padding: 50px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(12px);
    z-index: 1;
    position: relative;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(20px);
    opacity: 0;
    animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 24px;
      padding: 2px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0.1) 100%
      );
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask-composite: exclude;
      -webkit-mask-composite: destination-out;
      pointer-events: none;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .logo {
      margin-bottom: 24px;
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        animation: logoRotate 20s linear infinite;
      }
    }
  }

  .login-header {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      font-size: 32px;
      background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
      -webkit-background-clip: text;
      color: transparent;
      margin: 0 0 8px;
      font-weight: 500;
      opacity: 0;
      animation: fadeIn 0.6s ease forwards 0.3s;
    }

    p {
      color: #4a4a4a;
      font-size: 16px;
      margin-top: 8px;
      opacity: 0;
      animation: fadeIn 0.6s ease forwards 0.4s;
    }
  }

  .login-form {
    :deep(.el-input) {
      --el-input-height: 42px;
      opacity: 0;
      animation: fadeIn 0.6s ease forwards 0.5s;

      .el-input__wrapper {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
        backdrop-filter: blur(4px);

        input {
          color: #1a1a1a;
          &::placeholder {
            color: rgba(0, 0, 0, 0.6);
          }
        }

        .el-input__prefix-icon {
          color: rgba(0, 0, 0, 0.6);
        }

        &:hover,
        &.is-focus {
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }
      }
    }

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 32px 0;
      opacity: 0;
      animation: fadeIn 0.6s ease forwards 0.6s;

      :deep(.el-checkbox) {
        .el-checkbox__label {
          color: #1a1a1a;
        }
        .el-checkbox__input {
          .el-checkbox__inner {
            background-color: rgba(255, 255, 255, 0.2);
            border-color: rgba(0, 0, 0, 0.3);
          }
        }
      }

      :deep(.el-link) {
        color: #1a1a1a;
        font-weight: 500;

        &:hover {
          color: #000000;
        }
      }
    }

    .captcha-container {
      display: flex;
      gap: 16px;
      align-items: center;
      width: 100%;

      :deep(.el-input) {
        flex: 2;

        .el-input__wrapper {
          width: 100%;
        }
      }

      .captcha-wrapper {
        flex: 1.2;
        min-width: 120px;
        height: 42px;
        background: rgba(255, 255, 255, 0.75);
        border-radius: 12px;
        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.3),
          0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 1px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.08),
            rgba(255, 255, 255, 0.02)
          );
          border-radius: 12px;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.85);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }

        span {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        svg {
          height: 38px;
          max-width: 100%;
          border-radius: 6px;
          filter: contrast(1.05) brightness(0.98);
        }

        .refresh-icon {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(0, 0, 0, 0.5);
          font-size: 16px;
          opacity: 0;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.75);
          border-radius: 50%;
          padding: 4px;
          z-index: 2;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

          &:hover {
            color: rgba(0, 0, 0, 0.8);
            background: rgba(255, 255, 255, 0.85);
          }
        }
      }
    }

    .login-button {
      width: 100%;
      height: 42px;
      font-size: 16px;
      border-radius: 12px;
      background: rgba(44, 62, 80, 0.9);
      border: none;
      transition: all 0.3s ease;
      opacity: 0;
      animation: fadeIn 0.6s ease forwards 0.7s;
      backdrop-filter: blur(4px);
      position: relative;
      overflow: hidden;
      margin-top: 8px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: 0.5s;
      }

      &:hover {
        background: rgba(44, 62, 80, 1);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(44, 62, 80, 0.2);

        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .login-footer {
    text-align: center;
    margin-top: 24px;
    color: #4a4a4a;
    font-size: 12px;
    opacity: 0;
    animation: fadeIn 0.6s ease forwards 0.8s;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes logoRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
