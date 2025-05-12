<script setup>
import DateRangePicker from '@/components/TimeComponents/DateRangePicker.vue'

// 搜索表单
const searchForm = ref({
  time: [], // 时间范围
  type: 1, // 类型：用户/聊天室/大喇叭
  uid: '', // UID/ROOM ID
  operator: '', // 操作人
})

// 类型选项
const typeOptions = [
  { label: '用户', value: 1 },
  { label: '聊天室', value: 2 },
  { label: '大喇叭', value: 3 },
]

// 表格加载状态
const tableLoading = ref(false)

// 表格数据
const tableData = ref([
  {
    uid: '1445425',
    nickname: 'Kkk',
    type: 1,
    operation: '拉黑',
    duration: 1, // 时长(小时)
    reason: '我觉得不好看太丑了',
    operateTime: '2020-07-29 11:02:07',
    operator: '1000521',
  },
  {
    uid: '1445425',
    nickname: 'Kkk',
    type: 2,
    operation: '取消拉黑',
    duration: 2,
    reason: '-',
    operateTime: '2020-07-29 11:02:07',
    operator: '1000521',
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
  console.log(searchForm.value)
  getTableData()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    time: [],
    type: 1,
    uid: '',
    operator: '',
  }
  getTableData()
}

onBeforeMount(() => {
  getTableData()
})
</script>

<template>
  <div>
    <!-- 搜索栏 -->
    <el-form :model="searchForm" inline>
      <el-form-item label="Time">
        <DateRangePicker v-model="searchForm.time" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="searchForm.type" placeholder="请选择" style="width: 120px">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="UID">
        <el-input v-model="searchForm.uid" placeholder="UID/ROOM ID" />
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="searchForm.operator" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border v-loading="tableLoading">
      <el-table-column label="UID/ROOM ID" prop="uid" />
      <el-table-column label="昵称" prop="nickname" />
      <el-table-column label="类型" prop="type" />
      <el-table-column label="操作" prop="operation" />
      <el-table-column label="时长" prop="duration">
        <template #default="{ row }"> {{ row.duration }}小时 </template>
      </el-table-column>
      <el-table-column label="原因" prop="reason" show-overflow-tooltip />
      <el-table-column label="操作时间" prop="operateTime" width="180" />
      <el-table-column label="操作人" prop="operator" width="120" />
    </el-table>
  </div>
</template>

<style scoped lang="scss">
// :deep(.el-form) {
//   .el-form-item {
//     margin-bottom: 18px;
//     margin-right: 18px;
//   }
// }
</style>
