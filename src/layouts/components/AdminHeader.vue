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

const handleFullscreen = () => {
  const el = document.documentElement
  if (el.requestFullscreen) {
    el.requestFullscreen()
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen()
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen()
  }
}
</script>

<template>
  <header class="header">
    <!-- 第一行：logo、标题、用户信息 -->
    <div class="header-top">
      <div class="header-left">
        <el-button size="small" @click="$emit('toggle-drawer')">
          <el-icon><Menu /></el-icon>
        </el-button>
        <div class="header-title">Great Li CRM</div>
      </div>
      <div class="header-right">
        <!-- 全屏 -->
        <el-button size="small" @click="handleFullscreen" class="full-screen-button">
          <el-icon><FullScreen /></el-icon>
          <span>全屏</span>
        </el-button>
        <language-switch variant="inline" />
        <el-dropdown>
          <div class="user-info">
            <span class="username">{{ userStore.userInfo.username }}</span>
            <el-avatar :size="32" icon="UserFilled" :src="userStore.userInfo.avatar" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">{{ $t('common.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  min-height: $header-height;
  margin-top: 1vh;
  padding: 20px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .header-title {
        margin-left: 20px;
        font-size: 28px;
        font-weight: bold;
        color: $text-primary;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }
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
