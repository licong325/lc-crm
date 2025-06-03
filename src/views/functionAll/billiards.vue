<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 定义游戏模式枚举
enum GameMode {
  NONE = '',
  NINE_BALL = 'nine_ball', // 九球
  CHINESE_EIGHT = 'chinese_eight', // 中八
}

interface Player {
  name: string
  score: number
  order?: number // 添加顺序属性
}

interface GameState {
  gameMode: GameMode
  playerCount: number
  initialScore: number // 仅九球模式需要
  players: Player[]
  isPlayersConfirmed: boolean
}

// 当前游戏步骤
enum GameStep {
  SELECT_MODE = 1, // 选择游戏模式
  PLAYER_COUNT = 2, // 输入玩家数量
  INITIAL_SCORE = 3, // 输入初始分数(仅九球)
  PLAYER_NAMES = 4, // 输入玩家姓名
  GAME_STARTED = 5, // 游戏开始
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
const gameMode = ref<GameMode>(savedState?.gameMode || GameMode.NONE)
const playerCount = ref(savedState?.playerCount || 0)
const initialScore = ref(savedState?.initialScore || 0)
const players = ref<Player[]>(savedState?.players || [])
const isPlayersConfirmed = ref(savedState?.isPlayersConfirmed || false)
const currentStep = ref<GameStep>(
  isPlayersConfirmed.value ? GameStep.GAME_STARTED : GameStep.SELECT_MODE
)

// 监听状态变化并保存
watch(
  [gameMode, playerCount, players, initialScore, isPlayersConfirmed],
  () => {
    if (isPlayersConfirmed.value) {
      saveGameState({
        gameMode: gameMode.value,
        playerCount: playerCount.value,
        players: players.value,
        initialScore: initialScore.value,
        isPlayersConfirmed: isPlayersConfirmed.value,
      })
    }
  },
  { deep: true }
)

// 是否为九球模式
const isNineBallMode = computed(() => gameMode.value === GameMode.NINE_BALL)

// 是否为中八模式
const isChineseEightMode = computed(() => gameMode.value === GameMode.CHINESE_EIGHT)

// 可以输入玩家名字的条件
const canInputNames = computed(() => {
  if (isNineBallMode.value) {
    return playerCount.value > 0 && initialScore.value > 0
  }
  return playerCount.value > 0
})

// 选择游戏模式
const selectGameMode = (mode: GameMode) => {
  gameMode.value = mode
  currentStep.value = GameStep.PLAYER_COUNT
}

// 设置玩家数量
const setPlayerCount = () => {
  if (playerCount.value <= 0 || playerCount.value > 8) {
    ElMessage.warning('请输入1-8之间的有效玩家数量')
    return
  }

  if (isNineBallMode.value) {
    currentStep.value = GameStep.INITIAL_SCORE
  } else {
    // 中八模式直接进入玩家姓名输入
    players.value = Array(playerCount.value)
      .fill('')
      .map(() => ({ name: '', score: 0 })) // 中八模式不需要顺序
    currentStep.value = GameStep.PLAYER_NAMES
  }
}

// 设置初始分数 (九球模式)
const setInitialScore = () => {
  if (initialScore.value <= 0) {
    ElMessage.warning('请输入大于0的有效初始分数')
    return
  }

  players.value = Array(playerCount.value)
    .fill('')
    .map((_, index) => ({
      name: '',
      score: initialScore.value,
      order: index + 1, // 默认顺序为索引+1
    }))
  currentStep.value = GameStep.PLAYER_NAMES
}

// 为每个玩家分配固定的颜色索引
const playerColorIndices = ref<Map<number, number>>(new Map())

// 保存玩家名字
const savePlayerNames = () => {
  const emptyNames = players.value.some((player) => !player.name.trim())
  if (emptyNames) {
    ElMessage.warning('请输入所有玩家的名字')
    return
  }

  // 初始化为每个玩家分配固定的颜色索引
  players.value.forEach((_, index) => {
    playerColorIndices.value.set(index, index % 8)
  })

  isPlayersConfirmed.value = true
  currentStep.value = GameStep.GAME_STARTED
  ElMessage.success('游戏已开始')
}

// 获取玩家的颜色索引
const getPlayerColorIndex = (playerIndex: number) => {
  return playerColorIndices.value.get(playerIndex) || playerIndex % 8
}

// 返回上一步
const prevStep = () => {
  if (currentStep.value > GameStep.SELECT_MODE) {
    currentStep.value--
  }
}

// 编辑玩家信息
const editPlayers = () => {
  isPlayersConfirmed.value = false
  currentStep.value = GameStep.PLAYER_NAMES
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

// 用于跟踪上一次的分数
const previousScores = ref(new Map())

// 获取目标玩家索引(被抢分的玩家)
const getTargetPlayerIndex = (currentIndex: number) => {
  if (!isNineBallMode.value) return -1

  // 查找当前玩家在排序后数组中的位置
  const sortedIndex = sortedPlayers.value.findIndex((p) => p === players.value[currentIndex])

  // 计算目标玩家索引 (当前玩家追的是前一位玩家)
  // 如果是第一位玩家，则目标是最后一位玩家
  const targetSortedIndex = sortedIndex === 0 ? sortedPlayers.value.length - 1 : sortedIndex - 1

  // 获取目标玩家在原始数组中的索引
  return players.value.indexOf(sortedPlayers.value[targetSortedIndex])
}

// 修改比分模式状态
const isScoreEditMode = ref(false)

// 暂存修改前的比分
const tempScores = ref<Map<number, number>>(new Map())

// 进入修改比分模式
const enterScoreEditMode = () => {
  // 保存当前所有玩家的分数
  players.value.forEach((player, index) => {
    tempScores.value.set(index, player.score)
  })

  isScoreEditMode.value = true
  ElMessage.info('已进入比分修正模式，修改分数不会影响玩家顺序')
}

// 取消修改比分
const cancelScoreEdit = () => {
  // 恢复所有玩家的分数
  players.value.forEach((player, index) => {
    player.score = tempScores.value.get(index) || player.score
  })

  isScoreEditMode.value = false
  ElMessage.info('已取消比分修改')
}

// 确认修改比分
const confirmScoreEdit = () => {
  isScoreEditMode.value = false
  ElMessage.success('比分修改已保存')
}

// 直接修改玩家分数
const directUpdateScore = (index: number, newScore: number) => {
  // 保存旧分数用于动画
  const oldScore = players.value[index].score
  previousScores.value.set(index, oldScore)

  // 设置新分数，限制在0-999范围内
  players.value[index].score = Math.max(0, Math.min(newScore, 999))
}

// 修改更新分数的逻辑，大金时所有其他玩家减分
const updateScore = (index: number, type: 'add' | 'subtract', value = 1) => {
  const oldScore = players.value[index].score
  previousScores.value.set(index, oldScore)

  // 计算新分数
  const newScore = type === 'add' ? Math.min(oldScore + value, 999) : Math.max(oldScore - value, 0)

  // 应用新分数
  players.value[index].score = newScore

  // 如果是在修改比分模式，不执行抢分和顺序变更
  if (isScoreEditMode.value) {
    return
  }

  // 九球模式下的抢分机制
  if (isNineBallMode.value && type === 'add') {
    // 如果是加1分(自由球或犯规)，减分的是顺序中的下一位玩家
    if (value === 1) {
      // 查找当前玩家在排序后数组中的位置
      const sortedIndex = sortedPlayers.value.findIndex((p) => p === players.value[index])

      // 下一位玩家的位置(环形索引)
      const nextSortedIndex = (sortedIndex + 1) % sortedPlayers.value.length

      // 获取下一位玩家在原始数组中的索引
      const nextPlayerIndex = players.value.indexOf(sortedPlayers.value[nextSortedIndex])

      if (nextPlayerIndex !== -1) {
        // 保存下一位玩家原始分数
        const nextPlayerOldScore = players.value[nextPlayerIndex].score
        previousScores.value.set(nextPlayerIndex, nextPlayerOldScore)

        // 下一位玩家减分
        const nextPlayerNewScore = Math.max(nextPlayerOldScore - value, 0)
        players.value[nextPlayerIndex].score = nextPlayerNewScore

        // 显示自由球提示
        ElMessage({
          message: `自由球: ${players.value[nextPlayerIndex].name} -1`,
          type: 'warning',
          duration: 2000,
        })
      }
    }
    // 如果是加10分(大金)，所有其他玩家都减10分
    else if (value === 10) {
      // 获取所有其他玩家的索引
      const otherPlayerIndices = players.value.map((_, i) => i).filter((i) => i !== index)

      // 所有其他玩家减分
      otherPlayerIndices.forEach((otherIndex) => {
        // 保存其他玩家原始分数
        const otherPlayerOldScore = players.value[otherIndex].score
        previousScores.value.set(otherIndex, otherPlayerOldScore)

        // 其他玩家减分
        const otherPlayerNewScore = Math.max(otherPlayerOldScore - value, 0)
        players.value[otherIndex].score = otherPlayerNewScore
      })

      // 显示大金提示
      ElMessage({
        message: `大金: ${players.value[index].name} +10，其他所有玩家 -10`,
        type: 'success',
        duration: 3000,
      })

      // 自动调整顺序 - 支持两人或多人对战
      if (players.value.length === 2) {
        // 两人对战时的顺序调整
        // 加分玩家变为第一位
        players.value[index].order = 1
        // 减分玩家变为第二位
        players.value[otherPlayerIndices[0]].order = 2

        ElMessage.success(
          `顺序已调整: ${players.value[index].name} → ${players.value[otherPlayerIndices[0]].name}`
        )
      } else {
        // 三人或更多人对战时的顺序调整
        // 加分玩家变为第一位
        players.value[index].order = 1

        // 其他玩家按原来的相对顺序排列
        let nextOrder = 2
        const sortedOtherIndices = [...otherPlayerIndices].sort((a, b) => {
          const orderA = players.value[a].order || 999
          const orderB = players.value[b].order || 999
          return orderA - orderB
        })

        sortedOtherIndices.forEach((otherIndex) => {
          players.value[otherIndex].order = nextOrder++
        })

        // 构建顺序调整提示消息
        const orderNames = [
          players.value[index].name,
          ...sortedOtherIndices.map((i) => players.value[i].name),
        ]
        const orderMessage = `顺序已调整: ${orderNames.join(' → ')}`

        ElMessage.success(orderMessage)
      }
    }
    // 如果是加其他分值(进球)，减分的是被追分的玩家
    else {
      // 找到目标玩家(被追分的玩家)
      const targetIndex = getTargetPlayerIndex(index)
      if (targetIndex !== -1) {
        // 保存目标玩家原始分数
        const targetOldScore = players.value[targetIndex].score
        previousScores.value.set(targetIndex, targetOldScore)

        // 目标玩家减分
        const targetNewScore = Math.max(targetOldScore - value, 0)
        players.value[targetIndex].score = targetNewScore

        // 自动调整顺序 - 支持两人或多人对战
        if (players.value.length === 2) {
          // 两人对战时的顺序调整
          // 加分玩家变为第一位
          players.value[index].order = 1
          // 减分玩家变为第二位
          players.value[targetIndex].order = 2

          ElMessage.success(
            `顺序已调整: ${players.value[index].name} → ${players.value[targetIndex].name}`
          )
        } else {
          // 三人或更多人对战时的顺序调整
          // 找到第三名玩家 (不是当前玩家，也不是目标玩家)
          const thirdPlayerIndex = players.value.findIndex(
            (_, i) => i !== index && i !== targetIndex
          )

          if (thirdPlayerIndex !== -1) {
            // 加分玩家变为第一位
            players.value[index].order = 1
            // 减分玩家变为第二位
            players.value[targetIndex].order = 2
            // 第三位玩家变为第三位
            players.value[thirdPlayerIndex].order = 3

            // 如果有更多玩家，保持他们原有的顺序
            let nextOrder = 4
            players.value.forEach((player, i) => {
              if (i !== index && i !== targetIndex && i !== thirdPlayerIndex) {
                player.order = nextOrder++
              }
            })

            // 显示顺序调整提示
            ElMessage.success(
              `顺序已调整: ${players.value[index].name} → ${players.value[targetIndex].name} → ${players.value[thirdPlayerIndex].name}`
            )
          }
        }
      }
    }
  }
}

// 重置分数
const resetScores = () => {
  if (isNineBallMode.value) {
    players.value.forEach((player) => (player.score = initialScore.value))
  } else {
    players.value.forEach((player) => (player.score = 0))
  }
}

// 添加重新排序的方法
const resetPlayerOrder = () => {
  // 按照当前顺序重新编号
  const sortedIndices = [...players.value.keys()].sort((a, b) => {
    const orderA = players.value[a].order || 999
    const orderB = players.value[b].order || 999
    return orderA - orderB
  })

  // 重新分配顺序号
  sortedIndices.forEach((index, newOrder) => {
    players.value[index].order = newOrder + 1
  })

  ElMessage.success('玩家顺序已重置')
}

// 清除游戏状态
const clearGameState = () => {
  localStorage.removeItem('billiards_game_state')
  gameMode.value = GameMode.NONE
  playerCount.value = 0
  initialScore.value = 0
  players.value = []
  isPlayersConfirmed.value = false
  currentStep.value = GameStep.SELECT_MODE
  ElMessage.success('游戏状态已清除')
}

// 背景色数组
const boardColors = [
  'rgba(64, 158, 255, 0.1)', // 蓝色
  'rgba(103, 194, 58, 0.1)', // 绿色
  'rgba(230, 162, 60, 0.1)', // 橙色
  'rgba(145, 90, 238, 0.1)', // 紫色
  'rgba(245, 108, 108, 0.1)', // 红色
  'rgba(78, 172, 190, 0.1)', // 青色
  'rgba(250, 145, 40, 0.1)', // 橘色
  'rgba(178, 127, 220, 0.1)', // 淡紫色
]

// 边框色数组
const borderColors = [
  'rgba(64, 158, 255, 0.3)',
  'rgba(103, 194, 58, 0.3)',
  'rgba(230, 162, 60, 0.3)',
  'rgba(145, 90, 238, 0.3)',
  'rgba(245, 108, 108, 0.3)',
  'rgba(78, 172, 190, 0.3)',
  'rgba(250, 145, 40, 0.3)',
  'rgba(178, 127, 220, 0.3)',
]

// 数字背景色数组
const digitColors = [
  'rgb(64, 158, 255)', // 蓝色
  'rgb(103, 194, 58)', // 绿色
  'rgb(230, 162, 60)', // 橙色
  'rgb(145, 90, 238)', // 紫色
  'rgb(245, 108, 108)', // 红色
  'rgb(78, 172, 190)', // 青色
  'rgb(250, 145, 40)', // 橘色
  'rgb(178, 127, 220)', // 淡紫色
]

// 根据顺序排序的玩家列表（用于九球模式）
const sortedPlayers = computed(() => {
  if (!isNineBallMode.value) {
    return players.value
  }

  // 复制一份玩家数组并按顺序排序
  return [...players.value].sort((a, b) => {
    const orderA = a.order || 999
    const orderB = b.order || 999
    return orderA - orderB
  })
})

// 检查玩家是否可以使用大金按钮
const canUseBigGold = (player: Player) => {
  // 只有九球模式才有这个限制
  if (!isNineBallMode.value) return true

  // 只有顺序为1的玩家可以使用大金
  return player.order === 1
}
</script>

<template>
  <div class="billiards-container">
    <!-- 步骤1: 选择游戏模式 -->
    <div v-if="currentStep === GameStep.SELECT_MODE" class="mode-selection">
      <h2 class="section-title">选择游戏模式</h2>
      <div class="mode-cards">
        <div
          class="mode-card"
          :class="{ active: gameMode === GameMode.NINE_BALL }"
          @click="selectGameMode(GameMode.NINE_BALL)">
          <div class="mode-icon">🎱</div>
          <div class="mode-name">九球</div>
          <div class="mode-desc">先输入初始分数，在记录比分</div>
        </div>
        <div
          class="mode-card"
          :class="{ active: gameMode === GameMode.CHINESE_EIGHT }"
          @click="selectGameMode(GameMode.CHINESE_EIGHT)">
          <div class="mode-icon">🎯</div>
          <div class="mode-name">中八</div>
          <div class="mode-desc">不需要初始分数，记录击球次数</div>
        </div>
      </div>
    </div>

    <!-- 步骤2: 输入玩家数量 -->
    <div v-if="currentStep === GameStep.PLAYER_COUNT" class="setup-section">
      <h2 class="section-title">{{ isNineBallMode ? '九球' : '中八' }} - 输入玩家数量</h2>
      <el-form :inline="true">
        <el-form-item label="玩家数量">
          <el-input v-model.number="playerCount" placeholder="请输入1-8之间的数字" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setPlayerCount">下一步</el-button>
          <el-button @click="prevStep">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 步骤3: 输入初始分数 (仅九球模式) -->
    <div v-if="currentStep === GameStep.INITIAL_SCORE && isNineBallMode" class="setup-section">
      <h2 class="section-title">九球 - 输入初始分数</h2>
      <el-form :inline="true">
        <el-form-item label="初始分数">
          <el-input v-model.number="initialScore" placeholder="请输入大于0的分数" clearable>
            <template #prefix>
              <el-icon><Timer /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setInitialScore">下一步</el-button>
          <el-button @click="prevStep">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 步骤4: 输入玩家姓名 -->
    <div v-if="currentStep === GameStep.PLAYER_NAMES" class="setup-section">
      <h2 class="section-title">{{ isNineBallMode ? '九球' : '中八' }} - 输入玩家信息</h2>
      <div class="players-input">
        <el-form>
          <el-form-item
            v-for="(player, index) in players"
            :key="index"
            :label="`玩家 ${index + 1}`">
            <div class="player-input-row">
              <el-input v-model="player.name" placeholder="请输入玩家名字" maxlength="10" />

              <!-- 九球模式添加顺序输入 -->
              <el-input-number
                v-if="isNineBallMode"
                v-model="player.order"
                :min="1"
                :max="playerCount"
                controls-position="right"
                size="default"
                placeholder="顺序"
                class="player-order-input" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="savePlayerNames">开始游戏</el-button>
            <el-button @click="prevStep">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 步骤5: 游戏开始，显示计分板 -->
    <template v-if="currentStep === GameStep.GAME_STARTED">
      <div class="game-info">
        <h2 class="section-title">{{ isNineBallMode ? '九球' : '中八' }} - 计分板</h2>

        <!-- 九球模式规则说明 -->
        <div v-if="isNineBallMode" class="rules-explanation">
          <p>游戏规则: 每位玩家追分前一位玩家，加分时自动从对手扣除相同分数</p>
          <ul class="player-chase-list">
            <li v-for="(player, index) in sortedPlayers" :key="index">
              <span
                :style="{
                  color: digitColors[getPlayerColorIndex(players.indexOf(player))],
                }"
                >{{ player.name }}</span
              >
              追分
              <span
                :style="{
                  color:
                    digitColors[
                      getPlayerColorIndex(
                        players.indexOf(
                          sortedPlayers[index === 0 ? sortedPlayers.length - 1 : index - 1]
                        )
                      )
                    ],
                }">
                {{ sortedPlayers[index === 0 ? sortedPlayers.length - 1 : index - 1].name }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="score-boards">
        <div
          v-for="(player, index) in isNineBallMode ? sortedPlayers : players"
          :key="index"
          class="score-board"
          :class="{ 'edit-mode': isScoreEditMode }"
          :style="{
            background: boardColors[getPlayerColorIndex(players.indexOf(player))],
            borderColor: borderColors[getPlayerColorIndex(players.indexOf(player))],
            '--player-color': digitColors[getPlayerColorIndex(players.indexOf(player))],
          }">
          <div class="player-info">
            <div class="player-name">{{ player.name }}</div>
            <!-- 显示九球模式的顺序 -->
            <div v-if="isNineBallMode" class="player-order">
              <span>顺序: {{ player.order }}</span>
            </div>

            <!-- 显示追分对象 -->
            <div v-if="isNineBallMode" class="player-target">
              <span>
                追分对象:
                {{ sortedPlayers[index === 0 ? sortedPlayers.length - 1 : index - 1].name }}
              </span>
            </div>
          </div>
          <div class="score-display">
            <div
              v-for="(digit, digitIndex) in getDigits(player.score)"
              :key="digitIndex"
              class="digit-wrapper">
              <div
                class="digit"
                :class="
                  getAnimClass(
                    getDigits(previousScores.get(players.indexOf(player)) || 0)[digitIndex],
                    digit
                  )
                ">
                <span class="top">{{ digit }}</span>
                <span class="bottom">{{ digit }}</span>
              </div>
            </div>
          </div>
          <div class="score-controls">
            <div class="button-rows">
              <!-- <div class="button-row subtract">
                <el-button
                  type="danger"
                  @click="updateScore(players.indexOf(player), 'subtract', 1)"
                  >-1</el-button
                >
                <el-button
                  type="danger"
                  @click="updateScore(players.indexOf(player), 'subtract', 4)"
                  >-4</el-button
                >
                <el-button
                  type="danger"
                  @click="updateScore(players.indexOf(player), 'subtract', 7)"
                  >-7</el-button
                >
                <el-button
                  type="danger"
                  @click="updateScore(players.indexOf(player), 'subtract', 10)"
                  >-10</el-button
                >
              </div> -->
              <div class="button-row add">
                <el-button type="warning" @click="updateScore(players.indexOf(player), 'add', 1)">
                  +1
                </el-button>
                <el-button type="success" @click="updateScore(players.indexOf(player), 'add', 4)">
                  +4
                </el-button>
                <el-button type="success" @click="updateScore(players.indexOf(player), 'add', 7)">
                  小金
                </el-button>
                <el-button
                  type="success"
                  @click="updateScore(players.indexOf(player), 'add', 10)"
                  :disabled="!canUseBigGold(player) && !isScoreEditMode"
                  :class="{
                    'big-gold-btn': true,
                    'disabled-big-gold': !canUseBigGold(player) && !isScoreEditMode,
                  }">
                  大金
                </el-button>
              </div>
            </div>
          </div>
          <!-- 修改比分模式下显示直接编辑输入框 -->
          <div v-if="isScoreEditMode" class="direct-edit-score">
            <el-input-number
              v-model="player.score"
              :min="0"
              :max="999"
              controls-position="right"
              @change="directUpdateScore(players.indexOf(player), $event)" />
          </div>
        </div>
      </div>

      <div class="actions">
        <template v-if="!isScoreEditMode">
          <el-button type="warning" @click="resetScores">重置分数</el-button>
          <el-button @click="editPlayers">编辑玩家</el-button>
          <el-button type="primary" @click="enterScoreEditMode">修正比分</el-button>
          <el-button type="danger" @click="clearGameState">清除游戏</el-button>
        </template>
        <template v-else>
          <el-button type="success" @click="confirmScoreEdit">保存修改</el-button>
          <el-button @click="cancelScoreEdit">取消修改</el-button>
        </template>
      </div>
    </template>

    <!-- 修改比分模式下的UI提示 -->
    <div v-if="isScoreEditMode" class="edit-mode-indicator">
      <el-alert
        title="比分修正模式"
        type="warning"
        description="当前处于比分修正模式，点击加减分按钮只会改变分数，不会触发抢分和顺序调整。"
        show-icon
        :closable="false" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.billiards-container {
  width: 100%;
  padding: 20px;
  overflow-x: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.mode-selection {
  width: 100%;
  max-width: 800px;
  margin: 40px auto;

  .mode-cards {
    display: flex;
    gap: 30px;
    justify-content: center;
    flex-wrap: wrap;

    .mode-card {
      width: 300px;
      height: 280px;
      border-radius: 20px;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      }

      &.active {
        border-color: var(--el-color-primary);
        box-shadow: 0 10px 30px rgba(64, 158, 255, 0.2);
      }

      .mode-icon {
        font-size: 80px;
        margin-bottom: 20px;
      }

      .mode-name {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 15px;
      }

      .mode-desc {
        font-size: 16px;
        color: var(--el-text-color-secondary);
        text-align: center;
      }
    }
  }
}

.setup-section {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  :deep(.el-form) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;

    .el-form-item {
      margin-bottom: 20px;
      margin-right: 0;

      &__label {
        font-size: 18px;
      }
    }
  }
}

.players-input {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.game-info {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}

.score-boards {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  padding: 0 20px;
  justify-content: center;

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

    .player-info {
      display: flex;
      flex-direction: column;
      align-items: center;

      .player-name {
        font-size: 56px;
        font-weight: 700;
        margin-bottom: 10px;
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

      .player-order {
        font-size: 20px;
        color: var(--el-text-color-secondary);
        margin-top: -30px;
        margin-bottom: 10px;

        span {
          background-color: var(--player-color);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: bold;
        }
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
        height: 280px;

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
            font-size: 146px;
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
      padding: 0 20px;

      .button-rows {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;

        .button-row {
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 12px;

          :deep(.el-button) {
            flex: 1;
            min-width: 0;
            max-width: calc(25% - 9px);
            padding: 20px 0;
            font-size: 22px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &.subtract {
            :deep(.el-button) {
              background-color: var(--el-color-danger);
              border-color: var(--el-color-danger);
              color: white;

              &:hover {
                background-color: var(--el-color-danger-dark-2);
                border-color: var(--el-color-danger-dark-2);
              }
            }
          }

          &.add {
            :deep(.el-button) {
              background-color: var(--el-color-success);
              border-color: var(--el-color-success);
              color: white;

              &:hover {
                background-color: var(--el-color-success-dark-2);
                border-color: var(--el-color-success-dark-2);
              }
            }
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
  margin-bottom: 50px;
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

.player-input-row {
  display: flex;
  gap: 10px;
  width: 100%;

  .el-input {
    flex: 1;
  }

  .player-order-input {
    width: 120px;
  }
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;

  .player-order {
    font-size: 20px;
    color: var(--el-text-color-secondary);
    margin-top: -30px;
    margin-bottom: 20px;

    span {
      background-color: var(--player-color);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: bold;
    }
  }
}

.rules-explanation {
  max-width: 800px;
  margin: 0 auto 30px;
  padding: 15px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(8px);

  p {
    margin-bottom: 10px;
    font-size: 18px;
  }
}

.player-chase-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  list-style: none;
  padding: 0;

  li {
    background: rgba(255, 255, 255, 0.2);
    padding: 5px 12px;
    border-radius: 20px;
    font-weight: bold;

    span {
      font-weight: 900;
    }
  }
}

.player-target {
  margin-top: 10px;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 5px 12px;
  border-radius: 15px;
  margin-bottom: 10px;

  span {
    font-weight: bold;
  }
}

/* 添加顺序变化的动画 */
.player-order span {
  transition: background-color 0.3s ease;
  position: relative;

  &::after {
    content: attr(data-order);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
  }

  &.order-changed {
    animation: pulse 0.5s ease;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 自由球按钮的特殊样式 */
.button-row.add {
  :deep(.el-button:first-child) {
    background-color: var(--el-color-warning);
    border-color: var(--el-color-warning);

    &:hover {
      background-color: var(--el-color-warning-dark-2);
      border-color: var(--el-color-warning-dark-2);
    }
  }
}

/* 修改比分模式样式 */
.edit-mode-indicator {
  max-width: 800px;
  margin: 0 auto 20px;
}

.score-board.edit-mode {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 4px dashed var(--el-color-warning);
    border-radius: 15px;
    pointer-events: none;
    animation: border-pulse 2s infinite;
  }
}

.direct-edit-score {
  margin: 10px 0 30px;

  :deep(.el-input-number) {
    width: 180px;

    .el-input__inner {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
    }
  }
}

@keyframes border-pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

/* 大金按钮样式 */
.big-gold-btn {
  position: relative;

  &.disabled-big-gold {
    opacity: 0.6;
    cursor: not-allowed;

    &::after {
      content: '仅顺序1可用';
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }

    &:hover::after {
      opacity: 1;
    }
  }
}
</style>
