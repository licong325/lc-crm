<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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

/* 计算菜单项，获取主布局下的路由 */
const menuItems = computed(() => {
  /* 获取主布局路由配置 */
  const mainRoute = router.options.routes.find((route) => route.path === '/')
  /* 返回未隐藏的子路由配置 */
  return mainRoute?.children?.filter((route) => !route.meta?.hidden) || []
})

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
      <template v-for="item in menuItems" :key="item.path">
        <!-- 没有子菜单的情况 -->
        <el-menu-item v-if="!item.children?.length" :index="item.path || '/'">
          <el-icon><component :is="item.meta?.icon || 'Document'" /></el-icon>
          <span>{{ item.meta?.title || item.name }}</span>
        </el-menu-item>

        <!-- 有子菜单的情况 -->
        <el-sub-menu v-else :index="item.path">
          <template #title>
            <el-icon><component :is="item.meta?.icon || 'Document'" /></el-icon>
            <span>{{ item.meta?.title || item.name }}</span>
          </template>

          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="item.path + '/' + child.path">
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
