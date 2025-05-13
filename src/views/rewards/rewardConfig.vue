<script setup lang="ts">
import { ref } from 'vue'

// 奖励列表
const rewardList = ref([
  {
    id: 1,
    name: '大师哥奖励',
    items: [
      { type: 'VIP', id: 'VIP2', days: 4 },
      { type: '头像框', id: '112', days: 4 },
      { type: '座驾', id: '1234', days: 4 },
    ],
  },
])

// 奖励类型选项
const typeOptions = [
  { label: 'VIP', value: 'VIP' },
  { label: '头像框', value: '头像框' },
  { label: '座驾', value: '座驾' },
]

// VIP等级选项
const vipOptions = [
  { label: 'VIP1', value: 'VIP1' },
  { label: 'VIP2', value: 'VIP2' },
  { label: 'VIP3', value: 'VIP3' },
  { label: 'VIP4', value: 'VIP4' },
  { label: 'VIP5', value: 'VIP5' },
  { label: 'VIP6', value: 'VIP6' },
  { label: 'VIP7', value: 'VIP7' },
]

// 新增/编辑弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增奖励')
const currentReward = ref(null)

// 表单数据
const formData = ref({
  name: '',
  items: [{ type: 'VIP', id: '', days: 1 }],
})

// 表单规则
const rules = {
  name: [{ required: true, message: '请输入奖励名称', trigger: 'blur' }],
}

// 表单ref
const formRef = ref()

// 新增奖励
const handleAdd = () => {
  dialogTitle.value = '新增奖励'
  currentReward.value = null
  formData.value = {
    name: '',
    items: [{ type: 'VIP', id: '', days: 1 }],
  }
  dialogVisible.value = true
}

// 编辑奖励
const handleEdit = (reward) => {
  dialogTitle.value = '编辑奖励'
  currentReward.value = reward
  formData.value = JSON.parse(JSON.stringify(reward))
  dialogVisible.value = true
}

// 删除奖励
const handleDelete = (reward) => {
  ElMessageBox.confirm('确认要删除该奖励吗？', '提示', {
    type: 'warning',
  })
    .then(() => {
      const index = rewardList.value.findIndex((item) => item.id === reward.id)
      if (index > -1) {
        rewardList.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {})
}

// 添加奖励项
const handleAddItem = () => {
  formData.value.items.push({ type: 'VIP', id: '', days: 1 })
}

// 删除奖励项
const handleRemoveItem = (index) => {
  formData.value.items.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate()

  if (currentReward.value) {
    // 编辑
    const index = rewardList.value.findIndex((item) => item.id === currentReward.value.id)
    if (index > -1) {
      rewardList.value[index] = { ...formData.value, id: currentReward.value.id }
    }
  } else {
    // 新增
    rewardList.value.push({
      id: Date.now(),
      ...formData.value,
    })
  }

  ElMessage.success(currentReward.value ? '编辑成功' : '新增成功')
  dialogVisible.value = false
}
</script>

<template>
  <div class="reward-config">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增奖励</el-button>
    </div>

    <!-- 奖励表格 -->
    <el-table :data="rewardList" border style="width: 100%">
      <el-table-column label="奖励名称" prop="name" />
      <el-table-column label="奖励内容">
        <template #default="{ row }">
          <div v-for="(item, index) in row.items" :key="index" class="reward-item">
            {{ item.type }} {{ item.id }} {{ item.days }}days
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="奖励名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入奖励名称" />
        </el-form-item>

        <!-- 奖励项表格 -->
        <el-table :data="formData.items" border style="width: 100%">
          <el-table-column label="类型">
            <template #default="{ row }">
              <el-select v-model="row.type" placeholder="请选择类型" style="width: 100%">
                <el-option
                  v-for="option in typeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="ID/等级">
            <template #default="{ row }">
              <el-select
                v-if="row.type === 'VIP'"
                v-model="row.id"
                placeholder="请选择等级"
                style="width: 100%">
                <el-option
                  v-for="option in vipOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value" />
              </el-select>
              <el-input v-else v-model="row.id" placeholder="请输入ID" style="width: 100%" />
            </template>
          </el-table-column>

          <el-table-column label="图片" width="120">
            <template #default>
              <el-upload
                class="upload-demo"
                action="#"
                :show-file-list="false"
                :auto-upload="false">
                <el-button type="primary" link>
                  <el-icon><Plus /></el-icon>
                </el-button>
              </el-upload>
            </template>
          </el-table-column>

          <el-table-column label="天数">
            <template #default="{ row }">
              <el-input-number v-model="row.days" :min="1" :max="999" style="width: 100%" />
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template #default="{ $index }">
              <el-button
                v-if="formData.items.length > 1"
                type="danger"
                link
                @click="handleRemoveItem($index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="dialog-footer">
          <el-button type="primary" link @click="handleAddItem">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.reward-config {
  padding: 20px;
  background-color: #fff;

  .operation-bar {
    margin-bottom: 20px;
  }

  .reward-item {
    line-height: 1.8;
    color: #606266;
  }
}

.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-upload) {
  display: flex;
  justify-content: center;
}
</style>
