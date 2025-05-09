<script setup>
import { copyText } from '@/utils'

// 链接列表数据
let linkList = ref([])

onBeforeMount(() => {
  getLinkList()
})

// 获取链接列表数据
const getLinkList = async () => {
  linkList.value = [
    {
      id: 1,
      title: '充值代理充值链接',
      url: 'https://example.com/recharge',
    },
    {
      id: 2,
      title: '好吃好玩的充值链接',
      url: 'https://example.com/fun',
    },
    {
      id: 3,
      title: '好吃好玩的充值链接3',
      url: 'https://example.com/fun3',
    },
  ]
}

// 复制链接
const handleCopy = (url) => {
  copyText(url)
}
</script>

<template>
  <div class="links-page">
    <div class="link-grid">
      <div v-for="link in linkList" :key="link.id" class="link-card">
        <div class="link-title">{{ link.title }}</div>
        <el-button type="primary" size="small" class="copy-btn" @click="handleCopy(link.url)">
          复制链接
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.links-page {
  padding: 20px;
  min-height: 100%;
  background-color: #fff;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.link-card {
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .link-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .copy-btn {
    // width: 120px;
    font-size: 14px;
  }
}
</style>
