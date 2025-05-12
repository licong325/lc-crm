<script setup lang="ts">
import { ref } from 'vue'
import DateRangePicker from '@/components/TimeComponents/DateRangePicker.vue'
import { formatTimestamp } from '@/utils/index.js'

// 搜索表单
const searchForm = ref({
  time: [], // 时间范围
  uid: '', // UID
  operator: '', // 操作人
})

// 表格加载状态
const tableLoading = ref(false)

// 表格数据
const tableData = ref([
  {
    uid: '1445425',
    rewardName: '大师哥奖励',
    rewardId: '1',
    rewardContent: 'VIP3 3days,Frame(124) 3days,Car(111) 3days',
    giveTime: 1715587612, // 秒级时间戳
    operator: '1000241',
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
  console.log('搜索条件：', searchForm.value)
  getTableData()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    time: [],
    uid: '',
    operator: '',
  }
  getTableData()
}
</script>

<template>
  <div>
    <!-- 搜索栏 -->
    <el-form :model="searchForm" inline>
      <el-form-item label="Time">
        <DateRangePicker v-model="searchForm.time" />
      </el-form-item>
      <el-form-item label="UID">
        <el-input v-model="searchForm.uid" placeholder="请输入UID" />
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="searchForm.operator" placeholder="请输入操作人" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border v-loading="tableLoading" style="width: 100%">
      <el-table-column label="UID" prop="uid" />
      <el-table-column label="奖励名称" prop="rewardName" />
      <el-table-column label="奖励ID" prop="rewardId" />
      <el-table-column label="奖励内容" prop="rewardContent" show-overflow-tooltip />
      <el-table-column label="赠送时间">
        <template #default="{ row }">
          {{ formatTimestamp(row.giveTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="operator" />
    </el-table>
  </div>
</template>

<style scoped lang="scss"></style>
