<script setup lang="ts">
import { ref } from 'vue'
import { UserRoleEnum, getRoleLabel, getRoleOptions } from '@/utils/roleEnum.js'
import { getUserList, addUser, deleteUser } from '@/api/user'

const activeKey = ref('first')
const searchUserForm = ref({
  userName: '',
  role: UserRoleEnum.SUPER_ADMIN.value,
})
const roleMap = new Map([
  ['first', UserRoleEnum.SUPER_ADMIN.value],
  ['second', UserRoleEnum.ADMIN.value],
  ['third', UserRoleEnum.OPERATOR.value],
])
const currentPage = ref(1)
const pageSize = 5
const userDataList = ref([])
let total = ref(0)
const dialogVisible = ref(false)
const addUserForm = ref({
  username: '',
  password: '',
  role: UserRoleEnum.SUPER_ADMIN.value,
})
const roleOptions = getRoleOptions()
const addUserFormRef = ref(null)
const addUserRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择用户身份', trigger: 'blur' }],
}
//#region  方法

const handleSearch = () => {
  currentPage.value = 1
  _getUserList()
}

const _getUserList = () => {
  const data = {
    username: searchUserForm.value.userName,
    role: searchUserForm.value.role,
    page: currentPage.value,
    pageSize,
  }
  getUserList(data)
    .then((res: any) => {
      console.log(res)
      userDataList.value = res.list || []
      total.value = res.pagination.total || 0
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleAddUser = () => {
  console.log('添加用户')
  addUserForm.value = {
    username: '',
    password: '',
    role: UserRoleEnum.SUPER_ADMIN.value,
  }
  dialogVisible.value = true
}

const handleTabClick = (tab) => {
  activeKey.value = tab
  searchUserForm.value.role = roleMap.get(tab)
  currentPage.value = 1
  _getUserList()
}

const handleCurrentChange = (page) => {
  console.log('page', page)
  currentPage.value = page
  _getUserList()
}

const addUserConfirm = () => {
  addUserFormRef.value.validate((valid) => {
    if (!valid) {
      return
    }
    console.log('添加用户')
    const data = {
      username: addUserForm.value.username,
      password: addUserForm.value.password,
      role: addUserForm.value.role,
    }
    addUser(data)
      .then((res) => {
        console.log(res)
        dialogVisible.value = false
        handleSearch()
      })
      .catch((err) => {
        console.error(err)
      })
  })
}

const handleDeleteUser = (id) => {
  console.log('删除用户', id)
  ElMessageBox.confirm('确定删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteUser(id)
      .then((res) => {
        console.log(res)
        handleSearch()
      })
      .catch((err) => {
        console.error(err)
      })
  })
}

onMounted(() => {
  handleSearch()
})
//#endregion
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
    <el-tabs v-model="activeKey" @tab-change="handleTabClick">
      <el-tab-pane name="first" label="超级管理员">
        <el-table :data="userDataList" border>
          <el-table-column label="id" prop="id" width="100"></el-table-column>
          <el-table-column label="name" prop="username"> </el-table-column>
          <el-table-column label="用户身份" prop="remark"> </el-table-column>
          <el-table-column label="创建时间" prop="createTime"> </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="danger" @click="handleDeleteUser(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="second" label="管理员">
        <el-table :data="userDataList" border>
          <el-table-column label="id" prop="id" width="100"></el-table-column>
          <el-table-column label="name" prop="username"> </el-table-column>
          <el-table-column label="用户身份" prop="remark"> </el-table-column>
          <el-table-column label="添加时间" prop="createTime"> </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="danger" @click="handleDeleteUser(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="third" label="运营">
        <el-table :data="userDataList" border>
          <el-table-column label="id" prop="id" width="100"></el-table-column>
          <el-table-column label="name" prop="username"> </el-table-column>
          <el-table-column label="用户身份" prop="remark"> </el-table-column>
          <el-table-column label="添加时间" prop="createTime"> </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="danger" @click="handleDeleteUser(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange" />
    </el-tabs>
    <el-dialog v-model="dialogVisible" title="添加用户" width="30%">
      <el-form :model="addUserForm" label-width="120px" :rules="addUserRules" ref="addUserFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" />
        </el-form-item>
        <el-form-item label="用户身份" prop="role">
          <el-select v-model="addUserForm.role" placeholder="请选择用户身份">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUserConfirm">确认</el-button>
        </el-form-item>
      </el-form>
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
