<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

interface Player {
  name: string
  score: number
}

interface GameState {
  playerCount: number
  initialScore: number
  players: Player[]
  isPlayersConfirmed: boolean
}

// 从localStorage读取游戏状态
const loadGameState = (): GameState | null => {
  const savedState = localStorage.getItem('billiards_game_state')
  return savedState ? JSON.parse(savedState) : null
}

// 保存游戏状态到localStorage
const saveGameState = (state: GameState) => {
  localStorage.setItem('billiards_game_state', JSON.stringify(state))
}

// 初始化状态，优先使用保存的状态
const savedState = loadGameState()
const playerCount = ref(savedState?.playerCount || 0)
const players = ref<Player[]>(savedState?.players || [])
const initialScore = ref(savedState?.initialScore || 0)
const isPlayersConfirmed = ref(savedState?.isPlayersConfirmed || false)

// 监听状态变化并保存
watch(
  [playerCount, players, initialScore, isPlayersConfirmed],
  () => {
    if (isPlayersConfirmed.value) {
      saveGameState({
        playerCount: playerCount.value,
        players: players.value,
        initialScore: initialScore.value,
        isPlayersConfirmed: isPlayersConfirmed.value,
      })
    }
  },
  { deep: true }
)

// 添加背景色数组
const boardColors = [
  'rgba(64, 158, 255, 0.1)', // 蓝色
  'rgba(103, 194, 58, 0.1)', // 绿色
  'rgba(230, 162, 60, 0.1)', // 橙色
  'rgba(145, 90, 238, 0.1)', // 紫色
  'rgba(245, 108, 108, 0.1)', // 红色
  'rgba(78, 172, 190, 0.1)', // 青色
  'rgba(250, 145, 40, 0.1)', // 橘色
  'rgba(178, 127, 220, 0.1)', // 淡紫色
  'rgba(64, 158, 255, 0.1)', // 蓝色
  'rgba(103, 194, 58, 0.1)', // 绿色
  'rgba(230, 162, 60, 0.1)', // 橙色
  'rgba(145, 90, 238, 0.1)', // 紫色
  'rgba(245, 108, 108, 0.1)', // 红色
  'rgba(78, 172, 190, 0.1)', // 青色
  'rgba(250, 145, 40, 0.1)', // 橘色
  'rgba(178, 127, 220, 0.1)', // 淡紫色
]

// 添加边框色数组
const borderColors = [
  'rgba(64, 158, 255, 0.3)',
  'rgba(103, 194, 58, 0.3)',
  'rgba(230, 162, 60, 0.3)',
  'rgba(145, 90, 238, 0.3)',
  'rgba(245, 108, 108, 0.3)',
  'rgba(78, 172, 190, 0.3)',
  'rgba(250, 145, 40, 0.3)',
  'rgba(178, 127, 220, 0.3)',
  'rgba(64, 158, 255, 0.3)',
  'rgba(103, 194, 58, 0.3)',
  'rgba(230, 162, 60, 0.3)',
  'rgba(145, 90, 238, 0.3)',
  'rgba(245, 108, 108, 0.3)',
  'rgba(78, 172, 190, 0.3)',
  'rgba(250, 145, 40, 0.3)',
  'rgba(178, 127, 220, 0.3)',
]

// 修改背景色数组，使用更深的颜色作为数字背景
const digitColors = [
  'rgb(64, 158, 255)', // 蓝色
  'rgb(103, 194, 58)', // 绿色
  'rgb(230, 162, 60)', // 橙色
  'rgb(145, 90, 238)', // 紫色
  'rgb(245, 108, 108)', // 红色
  'rgb(78, 172, 190)', // 青色
  'rgb(250, 145, 40)', // 橘色
  'rgb(178, 127, 220)', // 淡紫色
  'rgb(64, 158, 255)', // 蓝色
  'rgb(103, 194, 58)', // 绿色
  'rgb(230, 162, 60)', // 橙色
  'rgb(145, 90, 238)', // 紫色
  'rgb(245, 108, 108)', // 红色
  'rgb(78, 172, 190)', // 青色
  'rgb(250, 145, 40)', // 橘色
  'rgb(178, 127, 220)', // 淡紫色
]

// 用于跟踪上一次的分数
const previousScores = ref(new Map())

// 计算属性：判断是否可以输入玩家名字
const canInputNames = computed(() => {
  return initialScore.value > 0 && playerCount.value > 0
})

// 修改初始化玩家函数
const initPlayers = () => {
  if (playerCount.value <= 0) {
    ElMessage.warning('请输入有效的玩家数量')
    return
  }
  if (!initialScore.value || initialScore.value <= 0) {
    ElMessage.warning('请先设置大于0的初始分数')
    players.value = []
    return
  }
  players.value = Array(playerCount.value)
    .fill('')
    .map(() => ({ name: '', score: initialScore.value }))
  isPlayersConfirmed.value = false
}

// 将数字拆分为数组
const getDigits = (num: number): string[] => {
  return num.toString().padStart(3, '0').split('')
}

// 添加动画类
const getAnimClass = (oldVal: string, newVal: string): string => {
  if (oldVal === newVal) return ''
  return Number(newVal) > Number(oldVal) ? 'flip-up' : 'flip-down'
}

// 更新分数时记录上一次的值并保存状态
const updateScore = (index: number, type: 'add' | 'subtract', value = 1) => {
  const oldScore = players.value[index].score
  previousScores.value.set(index, oldScore)

  const newScore = type === 'add' ? Math.min(oldScore + value, 999) : Math.max(oldScore - value, 0)
  players.value[index].score = newScore
}

// 重置分数
const resetScores = () => {
  players.value.forEach((player) => (player.score = initialScore.value))
}

// 保存玩家名字
const savePlayerNames = () => {
  const emptyNames = players.value.some((player) => !player.name.trim())
  if (emptyNames) {
    ElMessage.warning('请输入所有玩家的名字')
    return
  }
  isPlayersConfirmed.value = true
  ElMessage.success('玩家信息已保存')
}

// 编辑玩家信息
const editPlayers = () => {
  isPlayersConfirmed.value = false
}

// 清除游戏状态
const clearGameState = () => {
  localStorage.removeItem('billiards_game_state')
  playerCount.value = 0
  players.value = []
  initialScore.value = 0
  isPlayersConfirmed.value = false
  ElMessage.success('游戏状态已清除')
}
</script>

<template>
  <div class="billiards-container">
    <div class="setup-section">
      <el-form :inline="true">
        <el-form-item label="玩家数量">
          <el-input
            v-model.number="playerCount"
            :disabled="isPlayersConfirmed"
            @input="initPlayers"
            clearable />
        </el-form-item>
        <el-form-item label="初始分数">
          <el-input
            v-model.number="initialScore"
            :disabled="isPlayersConfirmed"
            @change="initPlayers"
            clearable>
            <template #prefix>
              <el-icon><Timer /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="players.length" class="players-section">
      <div v-if="!isPlayersConfirmed" class="players-input">
        <el-form>
          <el-form-item
            v-for="(player, index) in players"
            :key="index"
            :label="`玩家 ${index + 1}`">
            <el-input
              v-model="player.name"
              placeholder="请输入玩家名字"
              maxlength="10"
              :disabled="!canInputNames" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="savePlayerNames" :disabled="!canInputNames">
              确认玩家信息
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <template v-if="isPlayersConfirmed">
        <div class="score-boards">
          <div
            v-for="(player, index) in players"
            :key="index"
            class="score-board"
            :style="{
              background: boardColors[index],
              borderColor: borderColors[index],
              '--player-color': digitColors[index], // 添加CSS变量
            }">
            <div class="player-name">{{ player.name }}</div>
            <div class="score-display">
              <div
                v-for="(digit, digitIndex) in getDigits(player.score)"
                :key="digitIndex"
                class="digit-wrapper">
                <div
                  class="digit"
                  :class="
                    getAnimClass(getDigits(previousScores.get(index) || 0)[digitIndex], digit)
                  ">
                  <span class="top">{{ digit }}</span>
                  <span class="bottom">{{ digit }}</span>
                </div>
              </div>
            </div>
            <div class="score-controls">
              <div class="button-rows">
                <div class="button-row subtract">
                  <el-button type="danger" @click="updateScore(index, 'subtract', 1)">-1</el-button>
                  <el-button type="danger" @click="updateScore(index, 'subtract', 4)">-4</el-button>
                  <el-button type="danger" @click="updateScore(index, 'subtract', 7)">-7</el-button>
                  <el-button type="danger" @click="updateScore(index, 'subtract', 10)"
                    >-10</el-button
                  >
                </div>
                <div class="button-row add">
                  <el-button type="success" @click="updateScore(index, 'add', 1)">+1</el-button>
                  <el-button type="success" @click="updateScore(index, 'add', 4)">+4</el-button>
                  <el-button type="success" @click="updateScore(index, 'add', 7)">+7</el-button>
                  <el-button type="success" @click="updateScore(index, 'add', 10)">+10</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <el-button type="warning" @click="resetScores">重置为初始分数</el-button>
          <el-button @click="editPlayers">编辑玩家</el-button>
          <el-button type="danger" @click="clearGameState">清除游戏</el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.billiards-container {
  width: 100%;
  padding: 20px;
  overflow-x: hidden; // 防止横向滚动

  .setup-section {
    margin-bottom: 20px;

    :deep(.el-form) {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .el-form-item {
        margin-bottom: 0;
        margin-right: 0;
      }

      .el-input-number {
        width: 160px;
      }
    }
  }

  .players-section {
    width: 100%;

    .score-boards {
      width: 100%;
      display: flex;
      flex-wrap: wrap; // 允许换行
      gap: 20px;
      margin-bottom: 30px;
      padding: 0 20px; // 添加两侧间距

      .score-board {
        flex: 1 1 400px;
        max-width: calc(25% - 15px);
        min-width: 400px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 50px 40px;
        text-align: center;
        backdrop-filter: blur(12px);
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;

        @media screen and (max-width: 1800px) {
          max-width: calc(33.333% - 20px);
        }

        @media screen and (max-width: 1400px) {
          max-width: calc(50% - 20px);
        }

        @media screen and (max-width: 900px) {
          max-width: 100%;
        }

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
        }

        .player-name {
          font-size: 56px;
          font-weight: 700;
          margin-bottom: 50px;
          color: var(--el-text-color-primary);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 15px 0;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 4px;
            background: linear-gradient(90deg, transparent, var(--player-color), transparent);
            border-radius: 2px;
            opacity: 0.3;
          }
        }

        .score-display {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin: 50px 0;
          perspective: 800px;

          .digit-wrapper {
            position: relative;
            width: 140px;
            height: 180px;

            .digit {
              position: relative;
              width: 100%;
              height: 100%;
              transform-style: preserve-3d;
              transition: transform 0.3s ease;

              span {
                position: absolute;
                width: 100%;
                height: 100%;
                background: var(--player-color);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 96px;
                font-weight: bold;
                font-family: monospace;
                color: white;
                backface-visibility: hidden;
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
              }

              .top {
                transform: rotateX(0deg);
              }

              .bottom {
                transform: rotateX(180deg);
              }

              &.flip-up {
                animation: flipUp 0.6s ease forwards;
              }

              &.flip-down {
                animation: flipDown 0.6s ease forwards;
              }
            }
          }
        }

        .score-controls {
          width: 100%;
          margin-top: 50px;
          padding: 0 20px; // 添加内边距，避免按钮太靠边

          .button-rows {
            display: flex;
            flex-direction: column; // 改为纵向排列
            gap: 20px;
            width: 100%; // 确保宽度100%

            .button-row {
              width: 100%;
              display: flex;
              justify-content: center;
              gap: 12px; // 稍微减小按钮间距

              :deep(.el-button) {
                flex: 1;
                min-width: 0; // 移除最小宽度限制
                max-width: calc(25% - 9px); // 限制最大宽度为容器的1/4减去间距
                padding: 20px 0;
                font-size: 22px; // 稍微调小字体
                font-weight: bold;
                white-space: nowrap; // 防止文字换行
                overflow: hidden; // 防止内容溢出
                text-overflow: ellipsis; // 超出显示省略号
              }
            }
          }
        }
      }
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 20px;
    }
  }
}

@keyframes flipUp {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-180deg);
  }
}

@keyframes flipDown {
  0% {
    transform: rotateX(180deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}
</style>
