<script setup lang="ts">
import { userApi } from '@/api/test.js'
const router = useRouter()
const testApi = () => {
  userApi.login({ username: 'admin', password: '123456' })
}

const test403 = () => {
  router.push('/403')
}
const test404 = () => {
  router.push('/404')
}
</script>

<template>
  <div class="home">
    <h1>欢迎使用Azal Admin 系统</h1>
    <!-- 接口测试 -->
    <el-button @click="testApi">测试接口</el-button>
    <!-- 测试403 -->
    <el-button @click="test403">测试403</el-button>
    <!-- 测试404 -->
    <el-button @click="test404">测试404</el-button>
  </div>
</template>

<style scoped lang="scss">
.home {
  /* 使用绝对定位实现完全居中 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;

  h1 {
    color: $text-primary;
    font-size: 32px;
  }
}
</style>
