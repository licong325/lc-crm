<script setup lang="ts">
import { ref } from 'vue'
import DateRangePicker from '@/components/TimeComponents/DateRangePicker.vue'
import ImagePreview from '@/components/ImageComponents/ImagePreview.vue'

// 搜索表单
const searchForm = ref({
  time: [], // 时间范围
  uid: '', // UID
  operator: '', // 操作人
})

// 属性类型枚举
const typeEnum = ref([
  { label: '头像', value: 1 },
  { label: '昵称', value: 2 },
  { label: '签名', value: 3 },
  { label: '相册', value: 4 },
])

// 表格数据
const tableData = ref([
  {
    uid: '1445425',
    type: 1, // 属性类型：头像、昵称、签名、相册
    beforeValue: 'https://pic3.zhimg.com/v2-a2184227abddb98b3b7405e6033651ff_r.jpg',
    afterValue: 'https://pic3.zhimg.com/v2-a2184227abddb98b3b7405e6033651ff_r.jpg',
    operateTime: '2025-04-21 20:26:52',
    operator: '1000241',
  },
  {
    uid: '1445425',
    type: 2,
    beforeValue: 'Kkk',
    afterValue: 'kkkk',
    operateTime: '2025-04-21 20:26:52',
    operator: '1000241',
  },
  {
    uid: '1445425',
    type: 3,
    beforeValue: 'Kkk',
    afterValue: 'kkkk',
    operateTime: '2025-04-21 20:26:52',
    operator: '1000241',
  },
  {
    uid: '1445425',
    type: 4,
    beforeValue: [
      'https://pic3.zhimg.com/v2-a2184227abddb98b3b7405e6033651ff_r.jpg',
      'https://pic3.zhimg.com/v2-a2184227abddb98b3b7405e6033651ff_r.jpg',
    ],
    afterValue: [
      'https://pic3.zhimg.com/v2-a2184227abddb98b3b7405e6033651ff_r.jpg',
      'https://pic3.zhimg.com/v2-a2184227abddb98b3b7405e6033651ff_r.jpg',
    ],
    operateTime: '2025-04-21 20:26:52',
    operator: '1000241',
  },
])

// 表格加载状态
const loading = ref(false)

// 处理搜索
const handleSearch = () => {
  loading.value = true
  // TODO: 调用接口获取数据
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    time: [],
    uid: '',
    operator: '',
  }
}
</script>

<template>
  <div>
    <!-- 搜索栏 -->
    <el-form :model="searchForm" inline>
      <el-form-item label="时间范围">
        <DateRangePicker v-model="searchForm.time" />
      </el-form-item>
      <el-form-item label="UID">
        <el-input v-model="searchForm.uid" placeholder="请输入UID" />
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="searchForm.operator" placeholder="请输入操作人" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 记录表格 -->
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column label="UID" prop="uid" />
      <el-table-column label="属性" prop="type">
        <template #default="{ row }">
          {{ typeEnum.find((item) => item.value === row.type)?.label }}
        </template>
      </el-table-column>
      <el-table-column label="修改前">
        <template #default="{ row }">
          <div v-if="row.type === 1">
            <ImagePreview :images="row.beforeValue" />
          </div>
          <div v-else-if="row.type === 2 || row.type === 3">
            {{ row.beforeValue }}
          </div>
          <div v-else-if="row.type === 4">
            <div v-for="(photo, index) in row.beforeValue" :key="index">
              <ImagePreview :images="photo" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="修改后">
        <template #default="{ row }">
          <div v-if="row.type === 1">
            <ImagePreview :images="row.afterValue" />
          </div>
          <div v-else-if="row.type === 2 || row.type === 3">
            {{ row.afterValue }}
          </div>
          <div v-else-if="row.type === 4">
            <div v-for="(photo, index) in row.afterValue" :key="index">
              <ImagePreview :images="photo" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="operateTime" width="180" />
      <el-table-column label="操作人" prop="operator" />
    </el-table>
  </div>
</template>

<style scoped lang="scss"></style>
