<script setup>
let pageLoading = ref(false)
// 链接列表数据
let linkList = ref([])

// 获取链接列表数据
const getLinkList = async () => {
  const res = [
    {
      id: 1,
      title: '充值代理充值链接',
      url: 'http://azallive-chongzhidaili',
    },
    {
      id: 2,
      title: '好吃好玩的充值链接',
      url: 'http://azallive-chongzhidaili',
    },
  ]
  linkList.value = res
}

onBeforeMount(() => {
  pageLoading.value = true
  getLinkList()
  setTimeout(() => {
    pageLoading.value = false
  }, 1000)
})

// 弹窗数据
const dialogVisible = ref(false)
const formData = ref({
  title: '',
  url: '',
})

// 表单规则
const rules = {
  title: [{ required: true, message: '请输入链接名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
}

// 表单ref
const formRef = ref(null)

// 打开新增弹窗
const handleAdd = () => {
  formData.value = {
    title: '',
    url: '',
  }
  dialogVisible.value = true
}

// 打开编辑弹窗
const handleEdit = (row) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

// 删除链接
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该链接吗？', '提示', {
    type: 'warning',
  })
    .then(() => {
      // TODO: 调用删除接口
      ElMessage.success('删除成功')
      getLinkList()
    })
    .catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      // TODO: 调用保存接口
      ElMessage.success('保存成功')
      dialogVisible.value = false
      getLinkList()
    }
  })
}
</script>

<template>
  <div class="config-page" v-loading="pageLoading">
    <!-- 操作按钮 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增链接</el-button>
    </div>

    <!-- 链接列表 -->
    <el-table :data="linkList" border>
      <el-table-column label="链接名称" prop="title" />
      <el-table-column label="链接地址" prop="url" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.id ? '编辑链接' : '新增链接'"
      width="500px"
      @close="formRef?.resetFields()">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="链接名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入链接名称" />
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="formData.url" placeholder="请输入链接地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.config-page {
  padding: 20px;
  background-color: #fff;

  .operation-bar {
    margin-bottom: 20px;
  }
}
</style>
