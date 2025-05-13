<script setup lang="ts">
import { ref } from 'vue'
import ImagePreview from '@/components/ImageComponents/ImagePreview.vue'

// 用户信息
const userInfo = ref({
  uid: '',
  nickname: '',
  avatar: '',
  signature: '',
  albums: [], // 相册
})

// 加载状态
const loading = ref(false)

// 签名编辑状态
const isEditingSignature = ref(false)
const tempSignature = ref('')

// 查询用户信息
const handleQuery = async () => {
  if (!userInfo.value.uid) {
    ElMessage.warning('请输入UID')
    return
  }

  loading.value = true
  try {
    // TODO: 调用接口获取用户信息
    await new Promise((resolve) => setTimeout(resolve, 500))
    // 模拟数据
    userInfo.value = {
      uid: userInfo.value.uid,
      nickname: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      signature: '这是个性签名',
      albums: [
        'https://pic3.zhimg.com/v2-a2184227abddb98b3b7405e6033651ff_r.jpg',
        'https://th.bing.com/th/id/R.3a1b98d8aa749503cc2ff9c224bc8b40?rik=xxNkH0iChSUYqg&riu=http%3a%2f%2fd.ifengimg.com%2fq100%2fimg1.ugc.ifeng.com%2fnewugc%2f20190119%2f10%2fwemedia%2fabbab6554fa54232bec645b46e6e7bb3f0e4cc5b_size2326_w3000_h2000.JPG&ehk=UzIcp%2fHqCMHntTpDKBDEvAT%2bhhu8xR805ZL0enQCZ%2fY%3d&risl=1&pid=ImgRaw&r=0',
      ],
    }
  } finally {
    loading.value = false
  }
}

// 修改昵称
const handleModifyNickname = () => {
  ElMessageBox.prompt('请输入新的昵称', '修改昵称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: userInfo.value.nickname,
    inputValidator: (value) => {
      if (!value) return '昵称不能为空'
      if (value.length > 20) return '昵称长度不能超过20个字符'
      return true
    },
  })
    .then(({ value }) => {
      userInfo.value.nickname = value
      ElMessage.success('修改成功')
    })
    .catch(() => {})
}

// 修改头像
const handleModifyAvatar = () => {
  // TODO: 实现头像上传
}

// 删除相册图片
const handleDeletePhoto = (index: number) => {
  ElMessageBox.confirm('确认要删除该图片吗？', '提示', {
    type: 'warning',
  })
    .then(() => {
      userInfo.value.albums.splice(index, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

// 开始编辑签名
const handleEditSignature = () => {
  tempSignature.value = userInfo.value.signature
  isEditingSignature.value = true
}

// 保存签名
const handleSaveSignature = () => {
  if (!tempSignature.value.trim()) {
    ElMessage.warning('签名不能为空')
    return
  }
  userInfo.value.signature = tempSignature.value
  isEditingSignature.value = false
  ElMessage.success('修改成功')
}

// 取消编辑签名
const handleCancelEditSignature = () => {
  isEditingSignature.value = false
  tempSignature.value = userInfo.value.signature
}
</script>

<template>
  <div>
    <!-- 搜索栏 -->
    <el-form :model="userInfo" inline>
      <el-form-item label="UID">
        <el-input
          v-model="userInfo.uid"
          placeholder="请输入UID"
          style="width: 200px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户信息表格 -->
    <el-table v-if="userInfo.nickname" :data="[userInfo]" border v-loading="loading">
      <el-table-column label="UID" prop="uid" width="120" />
      <el-table-column label="昵称" width="200">
        <template #default="{ row }">
          <span>{{ row.nickname }}</span>
          <el-button type="primary" link @click="handleModifyNickname">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="200">
        <template #default="{ row }">
          <div class="avatar-wrapper">
            <el-image :src="row.avatar" class="avatar" />
            <div class="avatar-actions">
              <el-button type="primary" link @click="handleModifyAvatar">更换</el-button>
              <el-button type="danger" link @click="handleModifyAvatar">删除</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="签名">
        <template #default="{ row }">
          <div class="signature-wrapper">
            <template v-if="!isEditingSignature">
              <span class="signature-text">{{ row.signature }}</span>
              <el-button type="primary" link @click="handleEditSignature">修改</el-button>
            </template>
            <template v-else>
              <el-input
                v-model="tempSignature"
                type="textarea"
                :rows="2"
                placeholder="请输入签名"
                style="width: 300px"
                @keyup.enter="handleSaveSignature" />
              <div class="signature-actions">
                <el-button type="primary" link @click="handleSaveSignature">保存</el-button>
                <el-button type="info" link @click="handleCancelEditSignature">取消</el-button>
              </div>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="相册">
        <template #default="{ row }">
          <div class="album-list">
            <div v-for="(photo, index) in row.albums" :key="index" class="album-item">
              <div class="preview-wrapper">
                <ImagePreview :images="photo" />
              </div>
              <el-button type="danger" link @click="handleDeletePhoto(index)">删除</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.user-query {
  padding: 20px;
  background-color: #fff;

  .search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .avatar-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 4px;
    }
  }

  .album-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .album-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      background-color: #f5f7fa;
      border-radius: 4px;

      .preview-wrapper {
        flex: 1;
        min-width: 0; // 防止图片溢出
      }
    }
  }
}

:deep(.el-table__cell) {
  vertical-align: top;
}

.signature-wrapper {
  .signature-text {
    display: block;
    margin-bottom: 8px;
    color: #606266;
  }

  .signature-actions {
    margin-top: 8px;
    display: flex;
    gap: 10px;
  }
}
</style>
