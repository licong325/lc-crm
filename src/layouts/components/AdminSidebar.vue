<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:visible'])

const router = useRouter()
const route = useRoute()

/* 计算属性用于双向绑定 */
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

/* 计算菜单项，只展示主布局下的子路由 */
const menuItems = computed(() => {
  /* 获取主布局路由配置 */
  const mainRoute = router.options.routes.find((route) => route.path === '/')
  /* 返回子路由配置 */
  return mainRoute?.children || []
})

/* 处理菜单项点击 */
const handleMenuClick = (path) => {
  router.push(path)
  emit('update:visible', false)
}
</script>

<template>
  <el-drawer
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    title="导航菜单"
    direction="ltr"
    size="240px">
    <el-menu class="drawer-menu" @select="handleMenuClick" :default-active="route.path">
      <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
        <el-icon><component :is="item.meta?.icon || 'Document'" /></el-icon>
        <span>{{ item.meta?.title || item.name }}</span>
      </el-menu-item>
    </el-menu>
  </el-drawer>
</template>

<style lang="scss" scoped>
.drawer-menu {
  border-right: none;
  width: $drawer-width;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid $border-color;
}

:deep(.el-menu-item) {
  .el-icon {
    margin-right: 12px;
  }
}
</style>
