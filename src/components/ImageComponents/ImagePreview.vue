<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  images: {
    type: [String, Array],
    default: '', // 支持字符串或数组
  },
})

const dialogVisible = ref(false)
const currentIndex = ref(0)

// 统一处理为数组
const imageList = computed(() => {
  if (!props.images) return []
  return Array.isArray(props.images) ? props.images : [props.images]
})

// 打开预览
const handlePreview = (index) => {
  currentIndex.value = index
  dialogVisible.value = true
}

// 切换图片
const handleChange = (val) => {
  currentIndex.value = val
}
</script>

<template>
  <div class="image-preview">
    <template v-if="imageList.length">
      <div
        v-for="(url, index) in imageList"
        :key="index"
        class="image-item"
        @click="handlePreview(index)">
        <el-image :src="url" fit="cover" />
      </div>
    </template>

    <!-- 预览弹窗 -->
    <el-dialog v-model="dialogVisible" width="60%" :append-to-body="true">
      <div class="image-wrapper">
        <img :src="imageList[currentIndex]" />
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.image-preview {
  display: flex;
  gap: 8px;

  .image-item {
    width: 100px;
    height: auto;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;

    .el-image {
      width: 100%;
      height: 100%;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}

.image-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}
</style>
