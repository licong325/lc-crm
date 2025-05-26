<script setup>
import { useUserStore } from '@/stores/user.js'

defineEmits(['toggle-drawer'])

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userStore.logout()
    router.push('/login')
  })
}
</script>

<template>
  <header class="header">
    <el-button size="small" @click="$emit('toggle-drawer')">
      <el-icon><Menu /></el-icon>
    </el-button>
    <div class="header-title">Great Li CRM</div>
    <div class="header-right">
      <el-dropdown>
        <div class="user-info">
          <span class="username">{{ userStore.userInfo.username }}</span>
          <el-avatar :size="32" :src="userStore.userInfo.avatar" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: $header-height;
  margin-top: 1vh;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1000;

  .header-title {
    margin-left: 20px;
    font-size: 28px;
    font-weight: bold;
    color: $text-primary;
  }

  .header-right {
    margin-left: auto;
  }
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;

  .username {
    margin-right: 8px;
    font-size: 24px;
    color: $text-regular;
  }
}
</style>
