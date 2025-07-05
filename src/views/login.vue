<script setup>
import { useUserStore } from '@/stores/user.js'
import { User, Lock, RefreshRight } from '@element-plus/icons-vue'
import { useGlobalT } from '@/composables/useGlobalI18n'
import { getCaptcha, checkCaptcha } from '@/api/system/captcha'
import { login } from '@/api/system/login'
const t = useGlobalT()
const router = useRouter()
const userStore = useUserStore()
const loginForm = reactive({
  username: 'licong',
  password: 'licong',
  captcha: '',
})
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})
const loginFormRef = ref(null)
const loading = ref(false)
const captchaId = ref('')
const captchaImage = ref('')

// 定义全部路由权限数组
const allRouteNames = [
  'home',
  'manage',
  'adminUsers',
  'permissions',
  'official',
  'officialLinks',
  'linkConfig',
  'blacklist',
  'blacklistUsers',
  'blacklistChatrooms',
  'disableBroadcast',
  'blacklistRecords',
  'posts',
  'userPosts',
  'deleteRecords',
  'rewards',
  'giveRewards',
  'rewardRecords',
  'rewardConfig',
  'userInfo',
  'userQuery',
  'modifyRecords',
  'ranking',
  'rankingClickableUID',
  'functionAll',
  'billiards',
  'billiards2',
  'screenshot',
]

const _getCaptcha = async () => {
  getCaptcha().then((res) => {
    console.log('res', res)
    captchaId.value = res.captchaId
    captchaImage.value = res.captchaImage
  })
}

onMounted(() => {
  _getCaptcha()
})

const handleLogin = async () => {
  loginFormRef.value.validate().then(async () => {
    loading.value = true
    try {
      const data = {
        captchaId: captchaId.value,
        captchaText: loginForm.captcha,
      }
      const res = await checkCaptcha(data)
      console.log('res', res)
      if (!res.valid) return
      login({
        username: loginForm.username,
        password: loginForm.password,
      }).then((res) => {
        console.log('res', res)
        // 存储token
        userStore.setToken(res.token)
        userStore.setUserInfo(res.user)
        // 使用全部权限数组，而不是接口返回的权限
        userStore.setRoutes(allRouteNames)
        ElMessage.success(t('common.loginSuccess'))
        router.push('/home')
      })
    } finally {
      loading.value = false
    }
  })
}

const restLogin = async () => {
  console.log('restLogin')

  loginForm.username = 'admin'
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })
  loginForm.password = '123456'
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })
  loginForm.captcha = '123456'
  loading.value = true
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  }).then(() => {
    loading.value = false
    // 存储token
    userStore.setToken('kjcnjkcznzkfhineeiuhnmx')
    // 设置默认用户信息
    userStore.setUserInfo({
      username: 'admin',
      nickname: '超级管理员',
      avatar: '',
      roles: ['admin'],
    })
    // 同样使用全部权限数组
    userStore.setRoutes(allRouteNames)

    ElMessage.success('登录成功')
    router.push('/home')
  })
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
      <el-form ref="loginFormRef" :model="loginForm" class="login-form" :rules="loginRules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('common.inputUsername')"
            :prefix-icon="User"
            size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            :placeholder="$t('common.inputPassword')"
            :prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <div class="captcha-input">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                size="large"
                @keyup.enter="handleLogin" />
            </div>
            <div class="captcha-wrapper" @click="_getCaptcha" v-html="captchaImage"></div>
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
        <div>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="restLogin"
            class="login-button">
            离线登录
          </el-button>
        </div>
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

      .captcha-input {
        width: calc(100% - 120px);
        :deep(.el-input) {
          width: 100%;
        }
      }

      .captcha-wrapper {
        width: 120px;
        height: 44px;
        background: #f5f7fa;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        :deep(svg) {
          width: 100%;
          height: 100%;
        }

        &:hover {
          width: 280px;
          height: 124px;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.15);
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
