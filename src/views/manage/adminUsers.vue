<script setup>
import { ref } from 'vue'
import { UserRoleEnum, getRoleLabel, getRoleOptions } from '@/utils/roleEnum.js'

const activeKey = ref('first')
const searchUserForm = ref({
  userName: '',
})
const userDataList = ref([
  {
    id: 1,
    userName: '231231',
    identity: UserRoleEnum.TOTAL_ADMIN.value,
    time: 1232131,
  },
])
const dialogVisible = ref(false)
const dialogTitle = ref('添加用户')
const formRef = ref(null)
const formData = ref({
  userName: '',
  password: '',
  identity: '',
})

// 表单校验规则
const rules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  identity: [{ required: true, message: '请选择用户身份', trigger: 'change' }],
}

const handleTabClick = (tab) => {
  switch (activeKey.value) {
    case 'first':
      // 调获取总管理数据的函数
      getTotalAdminData()
      break
    case 'second':
      // 调获取超级管理员数据的函数
      getSuperAdminData()
      break
    case 'third':
      // 调获取管理员数据的函数
      getAdminData()
      break
  }
}
const getTotalAdminData = () => {
  console.log('获取总管理数据')
  userDataList.value = [
    {
      id: 1,
      userName: '231231',
      identity: UserRoleEnum.TOTAL_ADMIN.value,
      time: 1232131,
    },
  ]
}
const getSuperAdminData = () => {
  console.log('获取超级管理员数据')
  userDataList.value = [
    {
      id: 1,
      userName: '231231',
      identity: UserRoleEnum.SUPER_ADMIN.value,
      time: 1232131,
      operator: '231231',
    },
  ]
}
const getAdminData = () => {
  console.log('获取管理员数据')
  userDataList.value = [
    {
      id: 1,
      userName: '231231',
      identity: UserRoleEnum.ADMIN.value,
      time: 1232131,
      operator: '231231',
    },
  ]
}
// 编辑用户
const handleEdit = (row) => {
  dialogTitle.value = '修改用户'
  formData.value = {
    ...row,
    password: '', // 编辑时密码为空
  }
  dialogVisible.value = true
}
// 删除用户
const handleDelete = (row) => {
  console.log(row)
}
// 查询用户
const handleSearch = () => {
  console.log('查询')
}
// 打开添加用户弹窗
const handleAddUser = () => {
  dialogTitle.value = '添加用户'
  formData.value = {
    userName: '',
    password: '',
    identity: '',
  }
  dialogVisible.value = true
}
// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交表单', formData.value)
      dialogVisible.value = false
      // 这里调用接口保存数据
    }
  })
}
// 取消
const handleCancel = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}
</script>

<template>
  <div>
    <el-form label-width="80px" inline>
      <el-form-item label="用户名">
        <el-input v-model="searchUserForm.userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAddUser">添加用户</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeKey" @tab-click="handleTabClick">
      <el-tab-pane name="first" label="总管理">
        <el-table :data="userDataList" border>
          <el-table-column label="id" prop="id" width="100"></el-table-column>
          <el-table-column label="name" prop="userName"> </el-table-column>
          <el-table-column label="用户身份" prop="identity">
            <template #default="{ row }">
              {{ getRoleLabel(row.identity) }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="time"> </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="second" label="超级管理员">
        <el-table :data="userDataList" border>
          <el-table-column label="id" prop="id" width="100"></el-table-column>
          <el-table-column label="name" prop="userName"> </el-table-column>
          <el-table-column label="用户身份" prop="identity">
            <template #default="{ row }">
              {{ getRoleLabel(row.identity) }}
            </template>
          </el-table-column>
          <el-table-column label="权限编辑"> </el-table-column>
          <el-table-column label="添加时间" prop="time"> </el-table-column>
          <el-table-column label="操作用户" prop="operator"> </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-button type="warning" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="third" label="管理员">
        <el-table :data="userDataList" border>
          <el-table-column label="id" prop="id" width="100"></el-table-column>
          <el-table-column label="name" prop="userName"> </el-table-column>
          <el-table-column label="用户身份" prop="identity">
            <template #default="{ row }">
              {{ getRoleLabel(row.identity) }}
            </template>
          </el-table-column>
          <el-table-column label="权限编辑"> </el-table-column>
          <el-table-column label="添加时间" prop="time"> </el-table-column>
          <el-table-column label="操作用户" prop="operator"> </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-button type="warning" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password />
        </el-form-item>
        <el-form-item label="用户身份" prop="identity">
          <el-select v-model="formData.identity" placeholder="请选择用户身份" style="width: 100%">
            <el-option
              v-for="item in getRoleOptions()"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dialog) {
  border-radius: 8px;

  .el-dialog__header {
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid #dcdfe6;
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid #dcdfe6;
  }
}
</style>
