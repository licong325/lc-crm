<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/**
 * 计算面包屑路径
 * 根据当前路由的matched数组生成面包屑数据
 */
const breadcrumbList = computed(() => {
  const matched = route.matched.filter((item) => item.meta && item.meta.title)

  // 如果当前不在首页，添加首页作为第一个面包屑
  const first = matched[0]
  if (first && first.name !== 'home') {
    matched.unshift({
      path: '/home',
      name: 'home',
      meta: { title: '首页', icon: 'House' },
    })
  }

  return matched.map((item, index) => {
    const isLast = index === matched.length - 1

    return {
      path: item.path,
      name: item.name,
      title: item.meta.title,
      icon: item.meta.icon,
      disabled: isLast, // 最后一个不可点击
    }
  })
})

/**
 * 处理面包屑点击事件
 * @param {Object} item - 面包屑项
 */
const handleBreadcrumbClick = (item) => {
  if (!item.disabled && item.path !== route.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <div class="breadcrumb">
    <el-breadcrumb separator=">" class="app-breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="item.path"
        :class="{ 'breadcrumb-item-link': !item.disabled }"
        @click="handleBreadcrumbClick(item)">
        <el-icon v-if="item.icon && index === 0" class="breadcrumb-icon">
          <component :is="item.icon" />
        </el-icon>
        <span class="breadcrumb-text">{{ item.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 0 10px;

  .app-breadcrumb {
    display: inline-block;
    font-size: 19px;

    .breadcrumb-item-link {
      cursor: pointer;

      &:hover {
        .breadcrumb-text {
          color: $primary-color;
        }
      }
    }

    .breadcrumb-icon {
      margin-right: 4px;
      font-size: 20px;
    }

    .breadcrumb-text {
      font-weight: 400;
      transition: color 0.2s ease;
    }
  }
}

// Element Plus 面包屑样式自定义
:deep(.el-breadcrumb__inner) {
  display: inline-flex;
  align-items: center;
  color: #606266;
  font-weight: normal;

  &:hover {
    color: $primary-color;
  }
}

:deep(.el-breadcrumb__separator) {
  margin: 0 8px;
  font-weight: bold;
  color: #c0c4cc;
}

:deep(.el-breadcrumb__item):last-child {
  .el-breadcrumb__inner {
    color: #303133;
    font-weight: 500;
    cursor: default;

    &:hover {
      color: #303133;
    }
  }
}
</style>
