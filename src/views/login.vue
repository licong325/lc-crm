<script setup>
import { useUserStore } from '@/stores/user.js'
import { User, Lock } from '@element-plus/icons-vue'
const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  username: 'admin',
  password: '123456',
})

const loading = ref(false)

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    await userStore.login(loginForm.username, loginForm.password)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
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
        <h2>Azal Admin</h2>
        <p>欢迎回来，请登录您的账号</p>
      </div>
      <el-form :model="loginForm" class="login-form">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin" />
        </el-form-item>
        <div class="form-footer">
          <el-checkbox>记住我</el-checkbox>
          <el-link type="primary">忘记密码？</el-link>
        </div>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleLogin"
          class="login-button">
          {{ loading ? '登录中...' : '登录' }}
        </el-button>
      </el-form>
      <div class="login-footer">
        <p>© {{ new Date().getFullYear() }} Azal Admin. All rights reserved.</p>
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
  background: linear-gradient(135deg, #a18cd1 0%, #93a5cf 100%);

  .login-background {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
      animation: float 6s ease-in-out infinite;
    }

    .shape1 {
      width: 400px;
      height: 400px;
      top: -150px;
      right: -100px;
      background: linear-gradient(45deg, #c471ed 0%, #f7797d 100%);
      opacity: 0.1;
    }

    .shape2 {
      width: 300px;
      height: 300px;
      bottom: -150px;
      left: -50px;
      background: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
      opacity: 0.1;
      animation-delay: -3s;
    }

    .shape3 {
      width: 240px;
      height: 240px;
      bottom: 200px;
      right: 280px;
      background: linear-gradient(45deg, #8e44ad 0%, #c471ed 100%);
      opacity: 0.1;
      animation-delay: -5s;
    }
  }

  .login-box {
    width: 860px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(20px);
    z-index: 1;
    position: relative;
    transition: transform 0.3s ease;

    // &:hover {
    //   transform: translateY(-5px);
    // }

    .logo {
      margin-bottom: 20px;
      img {
        width: 64px;
        height: 64px;
      }
    }
  }

  .login-header {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      font-size: 32px;
      background: linear-gradient(45deg, #8e44ad, #c471ed);
      -webkit-background-clip: text;
      color: transparent;
      margin: 0 0 12px;
      font-weight: 600;
    }

    p {
      color: $text-regular;
      font-size: 14px;
      margin: 0;
    }
  }

  .login-form {
    :deep(.el-input) {
      --el-input-height: 44px;

      .el-input__wrapper {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        box-shadow: 0 0 0 1px #e4e7ed;
        transition: all 0.3s ease;

        &:hover,
        &.is-focus {
          box-shadow: 0 0 0 1px #8e44ad;
          transform: translateY(-1px);
        }
      }
    }

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      :deep(.el-link) {
        font-size: 14px;
        color: #8e44ad;
        &:hover {
          color: #9b59b6;
        }
      }

      :deep(.el-checkbox) {
        .el-checkbox__label {
          font-size: 14px;
        }
      }
    }

    .login-button {
      width: 100%;
      height: 44px;
      font-size: 16px;
      border-radius: 8px;
      background: linear-gradient(45deg, #8e44ad, #9b59b6);
      border: none;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(142, 68, 173, 0.2);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .login-footer {
    text-align: center;
    margin-top: 24px;
    color: $text-secondary;
    font-size: 12px;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
