<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
</script>

<template>
  <main class="main-content">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <router-view />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main-content {
  background-color: $background-color;

  .breadcrumb-container {
    width: 100%;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: start;
  }

  .content-wrapper {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: calc(100vh - 180px);
    padding: 10px;
  }
}
</style>
