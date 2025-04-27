<script setup>
defineEmits(['toggle-drawer'])

const router = useRouter()

const handleLogout = () => {
  // 这里添加退出登录逻辑
  router.push('/login')
}
</script>

<template>
  <header class="header">
    <el-button type="primary" @click="$emit('toggle-drawer')">
      <el-icon><Menu /></el-icon>
    </el-button>
    <div class="header-title">后台管理系统</div>
    <div class="header-right">
      <el-dropdown>
        <el-avatar :size="32" icon="UserFilled" />
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
  height: $header-height;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1000;

  .header-title {
    margin-left: 20px;
    font-size: 18px;
    font-weight: bold;
    color: $text-primary;
  }

  .header-right {
    margin-left: auto;
  }
}
</style>
