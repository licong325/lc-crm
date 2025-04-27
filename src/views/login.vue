<script setup>
const router = useRouter()
const loginForm = ref({
  username: '',
  password: '',
})

const handleLogin = () => {
  // 这里添加登录逻辑
  router.push('/')
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>系统登录</h2>
      </template>
      <el-form :model="loginForm">
        <el-form-item>
          <el-input v-model="loginForm.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.password" type="password" placeholder="密码" />
        </el-form-item>
        <el-button type="primary" @click="handleLogin" block>登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 100%;
  max-width: 400px;

  :deep(.el-card__header) {
    text-align: center;

    h2 {
      margin: 0;
    }
  }
}
</style>
