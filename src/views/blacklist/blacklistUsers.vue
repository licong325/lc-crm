<script setup>
import { ref, onBeforeMount } from 'vue'

// 搜索关键词
const searchKeyword = ref('')

// 表格加载状态
const tableLoading = ref(false)

// 用户状态枚举
const UserStatus = {
  NORMAL: 0, // 正常
  BLACKLISTED: 1, // 已拉黑
}

// 状态文本映射
const statusTextMap = {
  [UserStatus.NORMAL]: '正常',
  [UserStatus.BLACKLISTED]: '已拉黑',
}

// 表格数据
const tableData = ref([
  {
    uid: '1445425',
    nickname: 'Kkk',
    status: UserStatus.NORMAL,
    operateTime: '-',
    operator: '-',
  },
  {
    uid: '1445426',
    nickname: 'Test',
    status: UserStatus.BLACKLISTED,
    operateTime: '2024-02-28 12:00:00',
    operator: 'admin',
  },
])

// 获取表格数据
const getTableData = async () => {
  tableLoading.value = true
  try {
    // TODO: 调用接口获取数据
    await new Promise((resolve) => setTimeout(resolve, 500))
  } finally {
    tableLoading.value = false
  }
}

// 搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入UID')
    return
  }
  getTableData()
}

// 拉黑用户
const handleBlacklist = (row) => {
  ElMessageBox.confirm(`确认要拉黑用户 ${row.nickname}(${row.uid}) 吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      // TODO: 调用拉黑接口
      ElMessage.success('拉黑成功')
      getTableData()
    })
    .catch(() => {})
}

// 解除拉黑
const handleUnblacklist = (row) => {
  ElMessageBox.confirm(`确认要解除用户 ${row.nickname}(${row.uid}) 的拉黑状态吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      // TODO: 调用解除拉黑接口
      ElMessage.success('解除成功')
      getTableData()
    })
    .catch(() => {})
}

onBeforeMount(() => {
  getTableData()
})
</script>

<template>
  <div>
    <el-form inline>
      <el-form-item label="UID">
        <el-input v-model="searchKeyword" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border v-loading="tableLoading">
      <el-table-column label="UID" prop="uid" />
      <el-table-column label="昵称" prop="nickname" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === UserStatus.BLACKLISTED ? 'danger' : ''">
            {{ statusTextMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="operateTime" width="180" />
      <el-table-column label="操作人" prop="operator" width="120" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            v-if="row.status === UserStatus.NORMAL"
            type="primary"
            link
            @click="handleBlacklist(row)">
            拉黑
          </el-button>
          <el-button v-else type="success" link @click="handleUnblacklist(row)">
            解除拉黑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss"></style>
