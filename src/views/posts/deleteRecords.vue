<script setup>
import { ref } from 'vue'
import DateRangePicker from '@/components/TimeComponents/DateRangePicker.vue'
import ImagePreview from '@/components/ImageComponents/ImagePreview.vue'
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
    nickname: 'Kkk',
    momentId: '1003919',
    content: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    media: [
      'https://p26.toutiaoimg.com/origin/tos-cn-i-qvj2lq49k0/22f10850c5234b5285350743cfa16357',
      'https://pic3.zhimg.com/v2-a2184227abddb98b3b7405e6033651ff_r.jpg',
    ],
    deleteTime: 1715587612,
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
      <el-table-column label="昵称" prop="nickname" />
      <el-table-column label="Moment ID" prop="momentId" />
      <el-table-column label="图片/视频">
        <template #default="{ row }">
          <ImagePreview :images="row.media" />
        </template>
      </el-table-column>
      <el-table-column label="文案" prop="content" />
      <el-table-column label="删除时间" prop="deleteTime">
        <template #default="{ row }">
          {{ formatTimestamp(row.deleteTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="operator" />
    </el-table>
  </div>
</template>

<style scoped lang="scss"></style>
