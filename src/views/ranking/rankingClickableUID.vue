<script setup>
import { ref } from 'vue'

// 页面数据
let pageData = ref([])
let loading = ref(false)

const handleSave = () => {
  console.log('保存')
}

const handleAdd = () => {
  console.log('新增')
  pageData.value.push(Math.floor(Math.random() * 1000000))
}

// 获取数据
const getList = () => {
  console.log('获取数据')
  loading.value = true
  setTimeout(() => {
    pageData.value = [123123, 42535, 55464, 8090]
    loading.value = false
  }, 1000)
}

onBeforeMount(() => {
  getList()
})

// 删除
const handleDelete = (row) => {
  console.log('删除', row)
  pageData.value = pageData.value.filter((item) => item !== row)
}
</script>

<template>
  <div v-loading="loading">
    <el-row class="headerButton">
      <!-- 保存按钮 -->
      <el-button type="primary" @click="handleSave">保存</el-button>
      <!-- 新增按钮 -->
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="pageData" border>
      <!-- uid -->
      <el-table-column prop="uid" label="UID">
        <template #default="{ row }">
          <span>{{ row }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.headerButton {
  margin-bottom: 10px;
}
</style>
