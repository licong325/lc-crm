<script setup>
import { UserRoleEnum, getRoleLabel, getRoleOptions } from '@/utils/roleEnum.js'
import { ref, computed } from 'vue'

const roleOptions = ref(getRoleOptions())
const dialogVisible = ref(false)
const currentRole = ref(null)

// 当前角色的权限
const checkedPermissions = ref([])

// 菜单权限数据
const menuPermissions = ref([
  {
    id: 1,
    label: '其他',
    children: [
      { id: 11, label: '其他1' },
      { id: 12, label: '其他2' },
    ],
  },
  {
    id: 2,
    label: '操作',
    children: [
      { id: 21, label: '操作1' },
      { id: 22, label: '操作2' },
    ],
  },
  {
    id: 3,
    label: '模板',
    children: [
      { id: 31, label: '模板1' },
      { id: 32, label: '模板2' },
    ],
  },
  {
    id: 4,
    label: '配置',
    children: [
      { id: 41, label: '配置1' },
      { id: 42, label: '配置2' },
    ],
  },
  {
    id: 5,
    label: '单栏',
    children: [
      { id: 51, label: '单栏1' },
      { id: 52, label: '单栏2' },
    ],
  },
  {
    id: 6,
    label: '商品',
    children: [
      { id: 61, label: '商品1' },
      { id: 62, label: '商品2' },
    ],
  },
  {
    id: 7,
    label: 'GPT',
    children: [
      { id: 71, label: 'GPT1' },
      { id: 72, label: 'GPT2' },
    ],
  },
  {
    id: 8,
    label: '门户',
    children: [
      { id: 81, label: '产品简介' },
      { id: 82, label: '合作伙伴' },
    ],
  },
])

// 按钮权限数据
const buttonPermissions = ref(['read:system', 'write:system', 'delete:system'])

// 打开编辑弹窗
const handleEdit = (row) => {
  currentRole.value = row
  // 模拟获取该角色的权限数据
  checkedPermissions.value = ['11', '21', '31'] // 这里应该是从后端获取
  dialogVisible.value = true
}

// 保存权限
const handleSave = () => {
  console.log('保存权限:', {
    role: currentRole.value,
    menuPermissions: checkedPermissions.value,
    buttonPermissions: buttonPermissions.value,
  })
  dialogVisible.value = false
}
</script>

<template>
  <div class="permissions-page">
    <el-table :data="roleOptions" border>
      <el-table-column label="身份">
        <template #default="{ row }">
          {{ row.label }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="`编辑${currentRole?.label || ''}权限`" width="600px">
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
          <el-tab-pane label="按钮权限">
            <div class="button-permissions">
              <el-input
                v-model="buttonPermissions"
                type="textarea"
                :rows="4"
                placeholder="请输入按钮权限，多个权限用逗号分隔" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
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
