<script setup lang="ts">
import { userApi } from '@/api/test.js'
const router = useRouter()
const testApi = () => {
  userApi.login({ username: 'admin', password: '123456' })
}

const test403 = () => {
  router.push('/403')
}
const test404 = () => {
  router.push('/404')
}
const closeTerminal = () => {
  if (confirm('你想关闭？')) {
    console.log('用户点击了确定按钮')
    closeTerminal()
  } else {
    console.log('用户点击了取消按钮')
  }
}
</script>

<template>
  <div class="home">
    <!-- <h1>欢迎使用Great Li CRM系统</h1> -->
    <!-- 接口测试 -->
    <!-- <el-button @click="testApi">测试接口</el-button> -->
    <!-- 测试403 -->
    <!-- <el-button @click="test403">测试403</el-button> -->
    <!-- 测试404 -->
    <!-- <el-button @click="test404">测试404</el-button> -->
    <!-- From Uiverse.io by jeremyssocial -->
    <div class="terminal-loader">
      <div class="terminal-header">
        <div class="terminal-title">Status</div>
        <div class="terminal-controls" @click="closeTerminal">
          <div class="control close"></div>
          <div class="control minimize"></div>
          <div class="control maximize"></div>
        </div>
      </div>
      <div class="text">欢迎使用Great Li CRM系统</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 80vh;

  @keyframes blinkCursor {
    50% {
      border-right-color: transparent;
    }
  }

  @keyframes typeAndDelete {
    0%,
    10% {
      width: 0;
    }
    45%,
    55% {
      width: 330px;
    } /* adjust width based on content */
    90%,
    100% {
      width: 0;
    }
  }

  .terminal-loader {
    border: 0.1em solid #333;
    background-color: #1a1a1a;
    color: #0f0;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1em;
    padding: 1.5em 1em;
    width: 100%;
    height: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }

  .terminal-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background-color: #333;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .terminal-controls {
    width: 100px;
    height: 20px;
    float: right;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .control {
    width: 20px;
    height: 20px;
    margin-left: 0.4em;
    border-radius: 50%;
    background-color: #777;
  }

  .control.close {
    background-color: #e33;
  }

  .control.minimize {
    background-color: #ee0;
  }

  .control.maximize {
    background-color: #0b0;
  }

  .terminal-title {
    float: left;
    line-height: 1.5em;
    color: #eee;
    font-size: 24px;
  }

  .text {
    font-size: 40px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    border-right: 6px solid green; /* Cursor */
    animation:
      typeAndDelete 4s steps(19) infinite,
      blinkCursor 0.5s step-end infinite alternate;
    margin-top: 80px;
  }
}
</style>
