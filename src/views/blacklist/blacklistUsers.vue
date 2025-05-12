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

// 拉黑弹窗数据
const blacklistDialog = ref(false)
const blacklistForm = ref({
  uid: '',
  nickname: '',
  reason: '', // 拉黑原因
  level: '', // 违规等级
  image: '', // 原因图片
})

// 违规等级选项
const levelOptions = [
  { label: '1级 (拉黑3小时)', value: 1 },
  { label: '2级 (拉黑24小时)', value: 2 },
  { label: '3级 (拉黑48小时)', value: 3 },
  { label: '4级 (拉黑72小时)', value: 4 },
  { label: '5级 (拉黑168小时)', value: 5 },
  { label: '6级 (拉黑240小时)', value: 6 },
  { label: '7级 (拉黑360小时)', value: 7 },
  { label: '8级 (拉黑720小时)', value: 8 },
]

// 表单规则
const rules = {
  reason: [{ required: true, message: '请输入拉黑原因', trigger: 'blur' }],
  level: [{ required: true, message: '请选择违规等级', trigger: 'change' }],
}

// 表单ref
const formRef = ref(null)

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
  blacklistForm.value = {
    uid: row.uid,
    nickname: row.nickname,
    reason: '',
    level: '',
  }
  blacklistDialog.value = true
}

// 提交拉黑
const handleSubmitBlacklist = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm(
        `确认要拉黑用户 ${blacklistForm.value.nickname}(${blacklistForm.value.uid}) 吗？`,
        '提示',
        {
          type: 'warning',
        }
      )
        .then(async () => {
          // TODO: 调用拉黑接口
          ElMessage.success('拉黑成功')
          blacklistDialog.value = false
          getTableData()
        })
        .catch(() => {})
    }
  })
}

// 关闭弹窗
const handleCloseDialog = () => {
  formRef.value?.resetFields()
  blacklistDialog.value = false
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
  <div class="blacklist-page">
    <div>
      <el-form inline>
        <el-form-item label="UID/NAME">
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

    <!-- 拉黑弹窗 -->
    <el-dialog
      v-model="blacklistDialog"
      title="加入小黑屋"
      width="500px"
      @close="handleCloseDialog">
      <el-form ref="formRef" :model="blacklistForm" :rules="rules" label-width="100px">
        <el-form-item label="ID">
          <span>{{ blacklistForm.uid }}</span>
        </el-form-item>
        <el-form-item label="违规等级" prop="level">
          <el-select v-model="blacklistForm.level" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input
            v-model="blacklistForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入拉黑原因" />
        </el-form-item>
        <el-form-item label="原因图片">
          <img src="" alt="" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="blacklistDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitBlacklist">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.blacklist-page {
  padding: 20px;
  background-color: #fff;

  .search-bar {
    margin-bottom: 20px;
  }
}
</style>
