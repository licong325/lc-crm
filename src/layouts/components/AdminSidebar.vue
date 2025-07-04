<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:visible'])

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

/* 计算属性用于双向绑定 */
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

/* 使用store中的菜单路由 */
const menus = computed(() => {
  /* 从store获取菜单路由 */
  if (userStore.menuRoutes && userStore.menuRoutes.length > 0) {
    /* 通常需要获取布局路由的子路由作为菜单项 */
    const layoutRoute = userStore.menuRoutes.find((route) => route.path === '/')
    return layoutRoute?.children || []
  }
  return []
})
console.log('menus :>> ', menus)

/* 处理菜单项点击 */
const handleSelect = (index) => {
  console.log('index', index)
  router.push(index)
  emit('update:visible', false)
}
</script>

<template>
  <el-drawer
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    title="导航菜单"
    direction="ltr">
    <el-menu class="drawer-menu" :default-active="route.path" @select="handleSelect">
      <template v-for="menu in menus" :key="menu.path">
        <!-- 没有子菜单的情况 -->
        <el-menu-item v-if="!menu.children?.length" :index="menu.path || '/'">
          <el-icon><component :is="menu.meta?.icon || 'Document'" /></el-icon>
          <span>{{ menu.meta?.title || menu.name }}</span>
        </el-menu-item>

        <!-- 有子菜单的情况 -->
        <el-sub-menu v-else :index="menu.path">
          <template #title>
            <el-icon><component :is="menu.meta?.icon || 'Document'" /></el-icon>
            <span>{{ menu.meta?.title || menu.name }}</span>
          </template>

          <el-menu-item
            v-for="child in menu.children"
            :key="child.path"
            :index="menu.path + '/' + child.path">
            <el-icon><component :is="child.meta?.icon || 'Document'" /></el-icon>
            <span>{{ child.meta?.title || child.name }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-drawer>
</template>

<style lang="scss" scoped>
.drawer-menu {
  width: 100%;
  border-right: none;
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

:deep(.el-sub-menu__title) {
  .el-icon {
    margin-right: 12px;
  }
}
</style>
