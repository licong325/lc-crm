<script setup>
import { asyncRoutes } from '@/router'
import { getRoleList, addRole, deleteRole, updateRole } from '@/api/role'

// 角色列表
const roleOptions = ref([])
// 编辑弹窗
const dialogVisible = ref(false)
// 添加角色弹窗
const addRoleDialogVisible = ref(false)
// 当前角色
const currentRole = ref(null)
// 菜单树
const menuTree = ref(null)
// 添加角色菜单树
const addRoleMenuTree = ref(null)
// 添加角色表单ref
const newRoleFormRef = ref(null)
// 当前角色的权限
const checkedPermissions = ref([])

// 新角色表单数据
const newRoleForm = ref({
  roleName: '',
  permissions: [],
  remark: '',
})

// 新角色表单验证规则
const newRoleRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  remark: [{ max: 200, message: '角色描述不能超过200个字符', trigger: 'blur' }],
}

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

        // 如果是首页，添加必选标识并设置为禁用
        if (route.name === 'home') {
          node.label = `${node.label} (必选)`
          node.disabled = true // 禁用首页节点，不可操作
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
  _getRoleList()
})

// 获取角色列表
const _getRoleList = async () => {
  const res = await getRoleList()
  console.log(res)
  roleOptions.value = res.list
}

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
  nextTick(() => {
    menuTree.value?.setCheckedKeys(row.routerList)
  })
  dialogVisible.value = true
}

// 保存权限
const handleSave = () => {
  // 获取选中的菜单权限
  const checkedNodes = menuTree.value.getCheckedNodes()
  const permissions = checkedNodes.map((node) => node.id)

  const data = {
    roleId: currentRole.value.roleId,
    routerList: permissions,
  }
  console.log('保存权限:', data)
  updateRole(data)
  _getRoleList()
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

const handleSearch = () => {
  _getRoleList()
}

/**
 * 添加角色
 */
const handleAddRole = () => {
  addRoleDialogVisible.value = true
  // 重置表单
  newRoleForm.value = {
    roleName: '',
    permissions: [],
    remark: '',
  }
  // 重置树形组件，默认选中首页
  nextTick(() => {
    if (addRoleMenuTree.value) {
      addRoleMenuTree.value.setCheckedKeys(['home']) // 默认选中首页
    }
  })
}

/**
 * 关闭添加角色弹窗
 */
const handleAddRoleClose = () => {
  addRoleDialogVisible.value = false
  // 重置表单
  if (newRoleFormRef.value) {
    newRoleFormRef.value.resetFields()
  }
  // 重置树形组件
  if (addRoleMenuTree.value) {
    addRoleMenuTree.value.setCheckedKeys([])
  }
}

/**
 * 提交添加角色
 */
const submitAddRole = () => {
  if (!newRoleFormRef.value) return

  newRoleFormRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.error('请完善表单信息')
      return
    }

    // 获取选中的权限
    const checkedNodes = addRoleMenuTree.value.getCheckedNodes()
    let selectedPermissions = checkedNodes.map((node) => node.id)

    // 确保首页权限一定包含在内
    if (!selectedPermissions.includes('home')) {
      selectedPermissions.push('home')
    }

    // 准备提交的数据
    const submitData = {
      roleName: newRoleForm.value.roleName,
      permissions: selectedPermissions,
      remark: newRoleForm.value.remark,
    }

    // 在控制台打印数据（等会调接口）
    console.log('添加角色数据:', submitData)
    addRole(submitData).catch((err) => {
      console.log('err :>> ', err)
    })
    handleAddRoleClose()

    // 刷新角色列表
    _getRoleList()
  })
}

const del = (row) => {
  deleteRole({ roleId: row.roleId })
}
</script>

<template>
  <div class="permissions-page">
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-button type="primary" @click="handleAddRole">添加角色</el-button>
    <el-table :data="roleOptions" border>
      <el-table-column label="ID" prop="roleId" />
      <el-table-column label="身份" prop="roleName"> </el-table-column>
      <el-table-column label="排序" prop="roleSort" sortable />
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
      <el-table-column label="最后修改时间" prop="updateTime" width="180">
        <template #default="{ row }">
          {{ row.updateTime || '暂无修改' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="del(row)">删除</el-button>
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增角色弹窗 -->
    <el-dialog
      v-model="addRoleDialogVisible"
      title="新增角色"
      width="600px"
      :close-on-click-modal="false"
      @close="handleAddRoleClose">
      <el-form :model="newRoleForm" ref="newRoleFormRef" :rules="newRoleRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="newRoleForm.roleName" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="权限设置">
          <div class="permission-tree-container">
            <el-alert
              title="提示：首页权限为必选项，已默认包含且不可操作"
              type="info"
              :closable="false"
              style="margin-bottom: 10px" />
            <el-tree
              ref="addRoleMenuTree"
              :data="menuPermissions"
              show-checkbox
              node-key="id"
              :props="{ label: 'label', children: 'children' }"
              :default-expand-all="true"
              :default-checked-keys="['home']" />
          </div>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input
            v-model="newRoleForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述（可选）"
            show-word-limit
            maxlength="200" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleAddRoleClose">取消</el-button>
          <el-button type="primary" @click="submitAddRole">确定</el-button>
        </div>
      </template>
    </el-dialog>
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

.permission-tree-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px 20px;
  max-height: 300px;
  overflow-y: auto;

  .permission-tree {
    :deep(.el-tree-node__content) {
      padding: 4px 0;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
