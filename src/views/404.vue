<script setup>
const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/home')
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-image">
        <el-icon class="search-icon"><Search /></el-icon>
        <div class="error-code">404</div>
      </div>
      <h1 class="title">页面不存在</h1>
      <p class="description">抱歉，您访问的页面不存在或已被删除</p>
      <div class="actions">
        <el-button type="primary" @click="goBack">
          <el-icon><Back /></el-icon>
          返回上页
        </el-button>
        <el-button @click="goHome">
          <el-icon><House /></el-icon>
          回到首页
        </el-button>
      </div>
    </div>
    <div class="not-found-background">
      <div class="number number1">4</div>
      <div class="number number2">0</div>
      <div class="number number3">4</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

.not-found-content {
  text-align: center;
  z-index: 1;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.6s ease-out;
}

.not-found-image {
  position: relative;
  margin-bottom: 24px;

  .search-icon {
    font-size: 48px;
    color: #3498db;
    margin-bottom: 16px;
    animation: bounce 2s infinite;
  }

  .error-code {
    font-size: 120px;
    font-weight: 700;
    background: linear-gradient(45deg, #3498db, #2ecc71);
    -webkit-background-clip: text;
    color: transparent;
    line-height: 1;
    margin-bottom: 24px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.title {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 16px;
  font-weight: 600;
}

.description {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;

  .el-button {
    min-width: 120px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .el-icon {
      margin-right: 8px;
    }
  }
}

.not-found-background {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;

  .number {
    position: absolute;
    font-size: 180px;
    font-weight: 700;
    animation: float 4s ease-in-out infinite;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }

  .number1 {
    top: 5%;
    left: 8%;
    animation-delay: 0s;
    background: linear-gradient(45deg, #3498db, #2ecc71);
    -webkit-background-clip: text;
    color: transparent;
    opacity: 0.3;
  }

  .number2 {
    bottom: 10%;
    left: 20%;
    animation-delay: -3s;
    background: linear-gradient(45deg, #2ecc71, #3498db);
    -webkit-background-clip: text;
    color: transparent;
    opacity: 0.3;
  }

  .number3 {
    bottom: 30%;
    right: 15%;
    animation-delay: -5s;
    background: linear-gradient(45deg, #3498db, #2ecc71);
    -webkit-background-clip: text;
    color: transparent;
    opacity: 0.3;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes bounce {
  0%,
  100% {
    scale: 1;
  }
  50% {
    scale: 1.3;
  }
}
</style>
