<script setup>
import { UserRoleEnum, getRoleLabel, getRoleOptions } from '@/utils/roleEnum.js'
import { asyncRoutes } from '@/router'
// 角色列表
const roleOptions = ref([])
// 编辑弹窗
const dialogVisible = ref(false)
// 当前角色
const currentRole = ref(null)
// 菜单树
const menuTree = ref(null)
// 当前角色的权限
const checkedPermissions = ref([])

// 将路由数据转换为树形结构
const menuPermissions = computed(() => {
  const formatRoutes = (routes) => {
    return routes
      .filter((route) => !route.meta?.hidden) // 过滤掉隐藏的路由
      .map((route) => {
        const node = {
          id: route.name,
          label: route.meta?.title || route.name,
        }

        // 如果有子路由且不是布局路由
        if (route.children && route.children.length) {
          const children = formatRoutes(route.children)
          if (children.length) {
            node.children = children
          }
        }

        return node
      })
  }

  // 只处理第一个路由（AdminLayout）的子路由
  return formatRoutes(asyncRoutes[0].children)
})

onMounted(() => {
  getRoleList()
})

// 获取角色列表
const getRoleList = async () => {
  roleOptions.value = getRoleOptions().map((role) => ({
    ...role,
    updateTime: '', // 最后修改时间
  }))
}
// // 按钮权限数据
// const buttonPermissions = ref(['read:system', 'write:system', 'delete:system'])

// 打开编辑弹窗
const handleEdit = (row) => {
  currentRole.value = row
  // 清空之前的选中状态
  checkedPermissions.value = []
  // 重置树形组件状态
  if (menuTree.value) {
    menuTree.value.setCheckedKeys([])
  }
  // 模拟获取该角色的权限数据
  setTimeout(() => {
    // 模拟异步获取数据
    const permissions = ['home', 'manage', 'adminUsers'] // 这里应该是从后端获取
    checkedPermissions.value = permissions
    // 设置树形组件选中状态
    menuTree.value?.setCheckedKeys(permissions)
  })
  dialogVisible.value = true
}

// 保存权限
const handleSave = () => {
  // 获取选中的菜单权限
  const checkedNodes = menuTree.value.getCheckedNodes()
  const permissions = checkedNodes.map((node) => node.id)

  // 更新角色的修改时间
  const currentTime = new Date().toLocaleString()
  const roleIndex = roleOptions.value.findIndex((role) => role.value === currentRole.value.value)
  if (roleIndex > -1) {
    roleOptions.value[roleIndex].updateTime = currentTime
  }

  console.log('保存权限:', {
    role: currentRole.value,
    menuPermissions: permissions,
    updateTime: currentTime,
  })
  dialogVisible.value = false
}

// 弹窗关闭时清空数据
const handleClose = () => {
  checkedPermissions.value = []
  currentRole.value = null
  // 重置树形组件状态
  menuTree.value?.setCheckedKeys([])
  dialogVisible.value = false
}
</script>

<template>
  <div class="permissions-page">
    <el-table :data="roleOptions" border>
      <el-table-column label="身份" prop="label" />
      <el-table-column label="最后修改时间" prop="updateTime" width="180">
        <template #default="{ row }">
          {{ row.updateTime || '暂无修改' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`编辑${currentRole?.label || ''}权限`"
      width="600px"
      @close="handleClose">
      <div class="permission-dialog">
        <el-tabs type="border-card">
          <el-tab-pane label="菜单权限">
            <el-tree
              ref="menuTree"
              :data="menuPermissions"
              show-checkbox
              node-key="id"
              :props="{ label: 'label', children: 'children' }"
              v-model:checked-keys="checkedPermissions" />
          </el-tab-pane>
          <!-- <el-tab-pane label="按钮权限">
            <div class="button-permissions">
              <el-input
                v-model="buttonPermissions"
                type="textarea"
                :rows="4"
                placeholder="请输入按钮权限，多个权限用逗号分隔" />
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.permissions-page {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.permission-dialog {
  :deep(.el-tabs--border-card) {
    box-shadow: none;
  }

  .button-permissions {
    padding: 10px;
  }
}
</style>
