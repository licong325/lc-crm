<script setup>
import AdminHeader from './components/AdminHeader.vue'
import AdminSidebar from './components/AdminSidebar.vue'
import AdminMain from './components/AdminMain.vue'

/* 控制导航抽屉的显示状态 */
const drawerVisible = ref(false)
</script>

<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <AdminHeader @toggle-drawer="drawerVisible = !drawerVisible" />

    <!-- 侧边导航抽屉 -->
    <AdminSidebar v-model:visible="drawerVisible" />

    <!-- 主要内容区域 -->
    <AdminMain />
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
