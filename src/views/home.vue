<script setup lang="ts"></script>

<template>
  <div class="home">
    <h1>欢迎使用Azal Admin 系统</h1>
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
