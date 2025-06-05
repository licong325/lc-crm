<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

enum Mode {
  Single = 2,
  Multi = 3,
}

interface Player {
  name: string
  score: number // 分数
  order: number // 顺序
  // 普胜
  pusheng: number
  // 小金
  xiaojin: number
  // 大金
  dajin: number
  // 黄金9
  huangjin9: number
}

interface GameState {
  mode: Mode
  initialScore: number
  players: Player[]
  isEdit: boolean
  activeName: string
}

// localStorage存储的键名
const STORAGE_KEY = 'billiards_game_data'

// 默认初始状态
const defaultState: GameState = {
  mode: Mode.Single,
  initialScore: 100,
  players: [
    { name: '玩家1', score: 100, order: 1, pusheng: 0, xiaojin: 0, dajin: 0, huangjin9: 0 },
    { name: '玩家2', score: 100, order: 2, pusheng: 0, xiaojin: 0, dajin: 0, huangjin9: 0 },
  ],
  isEdit: true,
  activeName: 'first',
}

// 从localStorage加载状态或使用默认状态
const loadState = (): GameState => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      return JSON.parse(savedState)
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e)
  }
  return defaultState
}

// 初始化状态
const savedState = loadState()
const activeName = ref(savedState.activeName)
const isEdit = ref(savedState.isEdit)
const form = ref({
  mode: savedState.mode,
  initialScore: savedState.initialScore,
  players: savedState.players,
})

// 保存状态到localStorage
const saveState = () => {
  try {
    const state: GameState = {
      mode: form.value.mode,
      initialScore: form.value.initialScore,
      players: form.value.players,
      isEdit: isEdit.value,
      activeName: activeName.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state to localStorage:', e)
  }
}

// 监听状态变化，自动保存
watch(
  [form, isEdit, activeName],
  () => {
    saveState()
  },
  { deep: true }
)

// 计算属性：按顺序排序的玩家
const sortedPlayers = computed(() => {
  return [...form.value.players].sort((a, b) => a.order - b.order)
})

const handleClick = (tab: any) => {
  console.log(tab)
}

/**
 * 模式改变
 */
const handleModeChange = (value: Mode) => {
  if (value === Mode.Single) {
    form.value = {
      mode: Mode.Single,
      initialScore: form.value.initialScore,
      players: [
        {
          name: '玩家1',
          score: form.value.initialScore,
          order: 1,
          pusheng: 0,
          xiaojin: 0,
          dajin: 0,
          huangjin9: 0,
        },
        {
          name: '玩家2',
          score: form.value.initialScore,
          order: 2,
          pusheng: 0,
          xiaojin: 0,
          dajin: 0,
          huangjin9: 0,
        },
      ],
    }
  } else {
    form.value = {
      mode: Mode.Multi,
      initialScore: form.value.initialScore,
      players: [
        {
          name: '玩家1',
          score: form.value.initialScore,
          order: 1,
          pusheng: 0,
          xiaojin: 0,
          dajin: 0,
          huangjin9: 0,
        },
        {
          name: '玩家2',
          score: form.value.initialScore,
          order: 2,
          pusheng: 0,
          xiaojin: 0,
          dajin: 0,
          huangjin9: 0,
        },
        {
          name: '玩家3',
          score: form.value.initialScore,
          order: 3,
          pusheng: 0,
          xiaojin: 0,
          dajin: 0,
          huangjin9: 0,
        },
      ],
    }
  }
  saveState() // 保存状态
}

/**
 * 开始游戏
 */
const handleStartGame = () => {
  console.log('开始游戏')
  // 验证玩家姓名是否为空
  const invalidPlayers = form.value.players.filter((player) => !player.name.trim())
  if (invalidPlayers.length > 0) {
    ElMessage.error('玩家姓名不能为空，请填写所有玩家的姓名')
    return
  }

  // 初始化玩家分数
  form.value.players.forEach((player) => {
    player.score = form.value.initialScore
  })

  isEdit.value = false
}

/**
 * 编辑游戏
 */
const handleEditGame = () => {
  isEdit.value = true
}

/**
 * 获取显示的数字
 * @param score 分数
 * @returns 显示的数字
 */
const getDisplayDigits = (score: number) => {
  const scoreString = score.toString()
  return scoreString.split('')
}

/**
 * 获取对手索引 (双人模式)
 * @param currentIndex 当前玩家索引
 * @returns 对手索引
 */
const getOpponentIndex = (currentIndex: number) => {
  return form.value.players.findIndex((player) => player !== form.value.players[currentIndex])
}

/**
 * 获取追分对象索引 (多人模式)
 * @param currentIndex 当前玩家索引
 * @returns 追分对象索引
 */
const getTargetIndex = (currentIndex: number) => {
  const currentOrder = form.value.players[currentIndex].order
  // 如果当前玩家是1号，则追分对象是最大顺序号的玩家
  if (currentOrder === 1) {
    return form.value.players.findIndex(
      (player) => player.order === Math.max(...form.value.players.map((p) => p.order))
    )
  } else {
    // 否则追分前一位顺序的玩家
    return form.value.players.findIndex((player) => player.order === currentOrder - 1)
  }
}

/**
 * 修改加1分函数
 * @param index 当前玩家索引
 */
const handleAdd1 = (index: number) => {
  const currentPlayer = form.value.players[index]

  if (form.value.mode === Mode.Single) {
    // 双人模式
    const opponentIndex = getOpponentIndex(index)
    const opponent = form.value.players[opponentIndex]

    // 当前玩家加1分
    currentPlayer.score += 1
    // 对手减1分，但不低于0
    opponent.score = Math.max(0, opponent.score - 1)
  } else {
    // 多人模式 - 新规则
    // 找到当前玩家的顺序
    const currentOrder = currentPlayer.order

    // 找到目标玩家 - 如果当前是最大顺序，则减分的是1号，否则减分的是下一个顺序
    let targetOrder
    if (currentOrder === form.value.players.length) {
      targetOrder = 1
    } else {
      targetOrder = currentOrder + 1
    }

    const targetIndex = form.value.players.findIndex((player) => player.order === targetOrder)
    const targetPlayer = form.value.players[targetIndex]

    // 当前玩家加1分
    currentPlayer.score += 1
    // 目标玩家减1分，但不低于0
    targetPlayer.score = Math.max(0, targetPlayer.score - 1)
  }
}

/**
 * 修改让杆加1函数
 * @param index 当前玩家索引
 */
const handlePassCue = (index: number) => {
  if (form.value.mode !== Mode.Multi) return

  const currentPlayer = form.value.players[index]

  // 找到当前玩家的顺序
  const currentOrder = currentPlayer.order

  // 找到目标玩家 - 如果当前是1号，则减分的是3号；如果是2号，则减分的是1号；如果是3号，则减分的是2号
  let targetOrder
  if (currentOrder === 1) {
    targetOrder = form.value.players.length // 3号
  } else if (currentOrder === 2) {
    targetOrder = 1 // 1号
  } else {
    targetOrder = 2 // 2号
  }

  const targetIndex = form.value.players.findIndex((player) => player.order === targetOrder)
  const targetPlayer = form.value.players[targetIndex]

  // 当前玩家加1分
  currentPlayer.score += 1
  // 目标玩家减1分，但不低于0
  targetPlayer.score = Math.max(0, targetPlayer.score - 1)
}

/**
 * 加分并调整顺序的通用函数
 * @param index 当前玩家索引
 * @param points 加分
 * @param type 类型
 */
const handleScoreAndAdjustOrder = (index: number, points: number, type: string) => {
  const currentPlayer = form.value.players[index]

  if (form.value.mode === Mode.Single) {
    // 双人模式
    const opponentIndex = getOpponentIndex(index)
    const opponent = form.value.players[opponentIndex]

    // 当前玩家加分
    currentPlayer.score += points
    // 对手减分，但不低于0
    opponent.score = Math.max(0, opponent.score - points)

    // 记录对应类型得分次数
    currentPlayer[type]++

    // 调整顺序
    currentPlayer.order = 1
    opponent.order = 2
  } else {
    // 多人模式
    const targetIndex = getTargetIndex(index)
    const targetPlayer = form.value.players[targetIndex]

    // 当前玩家加分
    currentPlayer.score += points
    // 目标玩家减分，但不低于0
    targetPlayer.score = Math.max(0, targetPlayer.score - points)

    // 记录对应类型得分次数
    currentPlayer[type]++

    // 调整顺序 - 获胜玩家为1号，其他玩家顺序依次加1（如果已是最大则变为2）
    form.value.players.forEach((player) => {
      if (player === currentPlayer) {
        player.order = 1
      } else if (player.order < currentPlayer.order) {
        player.order += 1
      } else if (
        player.order === form.value.players.length &&
        currentPlayer.order !== form.value.players.length
      ) {
        // 如果是最后一位且当前玩家不是最后一位，则变为2
        player.order = 2
      } else if (player !== currentPlayer) {
        // 其他情况，保持不变或者+1
        player.order = player.order >= currentPlayer.order ? player.order + 1 : player.order
      }

      // 确保顺序不超过玩家总数
      if (player.order > form.value.players.length) {
        player.order = 2
      }
    })
  }
}

/**
 * 普胜
 * @param index 当前玩家索引
 */
const handlePusheng = (index: number) => {
  const currentPlayer = form.value.players[index]

  if (form.value.mode === Mode.Single) {
    // 双人模式保持原来的逻辑
    handleScoreAndAdjustOrder(index, 4, 'pusheng')
  } else {
    // 多人模式新规则
    // 当前玩家加4分并记录普胜次数
    currentPlayer.score += 4
    currentPlayer.pusheng++

    // 确定当前玩家的顺序
    const currentOrder = currentPlayer.order

    // 确定减分玩家
    let targetOrder
    if (currentOrder === 1) {
      targetOrder = 3 // 1号玩家加分，3号玩家减分
    } else if (currentOrder === 2) {
      targetOrder = 1 // 2号玩家加分，1号玩家减分
    } else {
      targetOrder = 2 // 3号玩家加分，2号玩家减分
    }

    // 找到减分玩家索引
    const targetIndex = form.value.players.findIndex((player) => player.order === targetOrder)
    const targetPlayer = form.value.players[targetIndex]

    // 减分玩家减4分，但不低于0
    targetPlayer.score = Math.max(0, targetPlayer.score - 4)

    // 找到剩余玩家
    const remainingIndex = form.value.players.findIndex(
      (player) => player !== currentPlayer && player !== targetPlayer
    )

    // 调整顺序
    currentPlayer.order = 1 // 加分玩家为1号
    targetPlayer.order = 2 // 减分玩家为2号
    form.value.players[remainingIndex].order = 3 // 剩余玩家为3号
  }
}

/**
 * 小金
 * @param index 当前玩家索引
 */
const handleXiaojin = (index: number) => {
  const currentPlayer = form.value.players[index]

  if (form.value.mode === Mode.Single) {
    // 双人模式保持原来的逻辑
    handleScoreAndAdjustOrder(index, 7, 'xiaojin')
  } else {
    // 多人模式新规则
    // 当前玩家加7分并记录小金次数
    currentPlayer.score += 7
    currentPlayer.xiaojin++

    // 确定当前玩家的顺序
    const currentOrder = currentPlayer.order

    // 确定减分玩家
    let targetOrder
    if (currentOrder === 1) {
      targetOrder = 3 // 1号玩家加分，3号玩家减分
    } else if (currentOrder === 2) {
      targetOrder = 1 // 2号玩家加分，1号玩家减分
    } else {
      targetOrder = 2 // 3号玩家加分，2号玩家减分
    }

    // 找到减分玩家索引
    const targetIndex = form.value.players.findIndex((player) => player.order === targetOrder)
    const targetPlayer = form.value.players[targetIndex]

    // 减分玩家减7分，但不低于0
    targetPlayer.score = Math.max(0, targetPlayer.score - 7)

    // 找到剩余玩家
    const remainingIndex = form.value.players.findIndex(
      (player) => player !== currentPlayer && player !== targetPlayer
    )

    // 调整顺序
    currentPlayer.order = 1 // 加分玩家为1号
    targetPlayer.order = 2 // 减分玩家为2号
    form.value.players[remainingIndex].order = 3 // 剩余玩家为3号
  }
}

/**
 * 大金
 * @param index 当前玩家索引
 */
const handleDajin = (index: number) => {
  const currentPlayer = form.value.players[index]

  // 只有顺序为1的玩家才能使用大金
  if (currentPlayer.order !== 1) {
    ElMessage.warning('只有顺序为1的玩家才能使用大金')
    return
  }

  if (form.value.mode === Mode.Single) {
    // 双人模式
    const opponentIndex = getOpponentIndex(index)
    const opponent = form.value.players[opponentIndex]

    // 当前玩家加20分
    currentPlayer.score += 20
    // 对手减10分，但不低于0
    opponent.score = Math.max(0, opponent.score - 10)

    // 记录大金次数
    currentPlayer.dajin++

    // 双人模式调整顺序
    currentPlayer.order = 1
    opponent.order = 2
  } else {
    // 多人模式新规则
    // 当前玩家加20分并记录大金次数
    currentPlayer.score += 20
    currentPlayer.dajin++

    // 找到其他两个玩家，每人减10分
    form.value.players.forEach((player) => {
      if (player !== currentPlayer) {
        // 其他玩家各减10分，但不低于0
        player.score = Math.max(0, player.score - 10)
      }
    })

    // 大金不调整顺序
  }
}

/**
 * 黄金9
 * @param index 当前玩家索引
 */
const handleHuangjin9 = (index: number) => {
  const currentPlayer = form.value.players[index]

  // 只有顺序为1的玩家才能使用黄金9
  if (currentPlayer.order !== 1) {
    ElMessage.warning('只有顺序为1的玩家才能使用黄金9')
    return
  }

  if (form.value.mode === Mode.Single) {
    // 双人模式
    const opponentIndex = getOpponentIndex(index)
    const opponent = form.value.players[opponentIndex]

    // 当前玩家加8分
    currentPlayer.score += 8
    // 对手减4分，但不低于0
    opponent.score = Math.max(0, opponent.score - 4)

    // 记录黄金9次数
    currentPlayer.huangjin9++

    // 双人模式调整顺序
    currentPlayer.order = 1
    opponent.order = 2
  } else {
    // 多人模式新规则
    // 当前玩家加8分并记录黄金9次数
    currentPlayer.score += 8
    currentPlayer.huangjin9++

    // 找到其他两个玩家，每人减4分
    form.value.players.forEach((player) => {
      if (player !== currentPlayer) {
        // 其他玩家各减4分，但不低于0
        player.score = Math.max(0, player.score - 4)
      }
    })

    // 黄金9不调整顺序
  }
}

/**
 * 重置游戏
 */
const resetGame = () => {
  form.value.players.forEach((player) => {
    player.score = form.value.initialScore
    player.pusheng = 0
    player.xiaojin = 0
    player.dajin = 0
    player.huangjin9 = 0
  })

  // 重置顺序
  form.value.players.forEach((player, index) => {
    player.order = index + 1
  })

  saveState() // 保存状态
}

/**
 * 完全重置游戏数据（添加一个新功能）
 */
const fullReset = () => {
  // 重置为默认状态
  form.value = {
    mode: defaultState.mode,
    initialScore: defaultState.initialScore,
    players: JSON.parse(JSON.stringify(defaultState.players)),
  }
  isEdit.value = defaultState.isEdit
  activeName.value = defaultState.activeName

  saveState() // 保存状态
  ElMessage.success('游戏数据已完全重置')
}

/**
 * 修正比分相关变量和函数
 */
const dialogVisible = ref(false)
const adjustForm = ref({
  players: [] as Player[],
})

/**
 * 打开修正比分对话框
 */
const openAdjustDialog = () => {
  // 复制当前玩家数据
  adjustForm.value.players = JSON.parse(JSON.stringify(form.value.players))
  dialogVisible.value = true
}

/**
 * 保存修正的比分
 */
const saveAdjustedScores = () => {
  // 验证顺序是否有效
  const orders = adjustForm.value.players.map((p) => p.order)
  const uniqueOrders = new Set(orders)

  if (uniqueOrders.size !== adjustForm.value.players.length) {
    ElMessage.error('玩家顺序不能重复，请重新设置')
    return
  }

  if (!orders.every((order) => order >= 1 && order <= adjustForm.value.players.length)) {
    ElMessage.error(`顺序必须在1到${adjustForm.value.players.length}之间`)
    return
  }

  // 应用修改
  form.value.players = JSON.parse(JSON.stringify(adjustForm.value.players))
  dialogVisible.value = false
  ElMessage.success('比分修正成功')
}

// 调整颜色主题数组为更柔和的颜色
const playerColors = [
  {
    name: '蓝色',
    primary: '#5C7CFA',
    secondary: '#BAC8FF',
    background: '#F5F7FF',
    text: '#4263EB',
  },
  {
    name: '绿色',
    primary: '#37B24D',
    secondary: '#B2F2BB',
    background: '#F4FDF6',
    text: '#2B8A3E',
  },
  {
    name: '红色',
    primary: '#F03E3E',
    secondary: '#FFC9C9',
    background: '#FFF5F5',
    text: '#D12525',
  },
]

// 获取玩家颜色
const getPlayerColor = (index: number) => {
  return playerColors[index % playerColors.length]
}
</script>

<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="九球" name="first">
        <el-form inline v-if="isEdit">
          <el-form-item label="初始分数" prop="initialScore">
            <el-input v-model="form.initialScore" placeholder="请输入初始分数" />
          </el-form-item>
          <el-form-item label="模式" prop="mode">
            <el-select
              v-model="form.mode"
              placeholder="请选择模式"
              class="mode-select"
              @change="handleModeChange">
              <el-option label="双人" :value="Mode.Single"></el-option>
              <el-option label="多人" :value="Mode.Multi"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(player, index) in form.players"
            :key="index"
            :label="`${index + 1}号玩家姓名`">
            <div class="player-input-row">
              <el-input v-model="player.name" placeholder="请输入玩家姓名" />
            </div>
          </el-form-item>
          <el-button type="primary" @click="handleStartGame">开始游戏</el-button>
        </el-form>
        <div v-if="!isEdit" class="game-controls">
          <el-button type="primary" @click="handleEditGame">编辑游戏</el-button>
          <el-button type="danger" @click="resetGame">重置游戏</el-button>
          <el-button type="warning" @click="openAdjustDialog">修正比分</el-button>
        </div>
        <el-row v-if="!isEdit">
          <el-col
            v-for="(player, index) in sortedPlayers"
            :key="player.name"
            :span="24 / form.players.length">
            <div class="player-card-container">
              <div
                class="player-card"
                :style="{
                  '--player-primary': getPlayerColor(form.players.indexOf(player)).primary,
                  '--player-secondary': getPlayerColor(form.players.indexOf(player)).secondary,
                  '--player-background': getPlayerColor(form.players.indexOf(player)).background,
                  '--player-text': getPlayerColor(form.players.indexOf(player)).text,
                }">
                <div class="player-card-name">{{ player.name }}</div>
                <div class="player-card-score">顺序：{{ player.order }}</div>
                <div class="scoring-box">
                  <div
                    class="scoring-box-item"
                    v-for="(digit, digitIndex) in getDisplayDigits(player.score)"
                    :key="digitIndex">
                    <span>{{ digit }}</span>
                  </div>
                </div>
                <div class="player-card-button">
                  <div class="score-button" @click="handlePusheng(form.players.indexOf(player))">
                    +普胜({{ player.pusheng }})
                  </div>
                  <div class="score-button" @click="handleXiaojin(form.players.indexOf(player))">
                    +小金({{ player.xiaojin }})
                  </div>
                  <div
                    class="score-button"
                    :class="{ disabled: player.order !== 1 }"
                    @click="handleDajin(form.players.indexOf(player))">
                    +大金({{ player.dajin }})
                  </div>
                  <div
                    class="score-button"
                    :class="{ disabled: player.order !== 1 }"
                    @click="handleHuangjin9(form.players.indexOf(player))">
                    +黄金9({{ player.huangjin9 }})
                  </div>
                  <div class="score-button" @click="handleAdd1(form.players.indexOf(player))">
                    加1
                  </div>
                  <div
                    v-if="form.mode === Mode.Multi"
                    class="score-button"
                    @click="handlePassCue(form.players.indexOf(player))">
                    让杆加1
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="中八" name="second">
        <div>中八</div>
      </el-tab-pane>
      <el-tab-pane label="多人计分" name="third">
        <div>多人计分</div>
      </el-tab-pane>
    </el-tabs>

    <!-- 修正比分对话框 -->
    <el-dialog title="修正比分" v-model="dialogVisible" width="500px">
      <el-form>
        <el-form-item
          v-for="(player, index) in adjustForm.players"
          :key="index"
          :label="player.name">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input-number
                v-model="player.score"
                :min="0"
                :max="999"
                label="比分"
                style="width: 100%" />
            </el-col>
            <el-col :span="12">
              <el-input-number
                v-model="player.order"
                :min="1"
                :max="adjustForm.players.length"
                label="顺序"
                style="width: 100%" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAdjustedScores">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加完全重置按钮 -->
    <div class="reset-container">
      <el-tooltip content="完全重置游戏数据，恢复到初始状态" placement="top">
        <el-button type="info" size="small" @click="fullReset">完全重置</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mode-select {
  width: 200px;
}

.game-controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.player-card-container {
  width: 95%;
  padding: 0;
  margin-bottom: 50px;
}

.player-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e9ecef;

  .player-card-name {
    width: 100%;
    height: 80px;
    text-align: center;
    line-height: 80px;
    background-color: var(--player-primary, #5c7cfa);
    color: white;
    font-size: 52px;
    font-weight: bold;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    opacity: 0.9;
  }

  .player-card-score {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background-color: var(--player-secondary, #bac8ff);
    color: var(--player-text, #4263eb);
    font-size: 28px;
    opacity: 0.85;
  }

  .scoring-box {
    width: 100%;
    height: 370px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
    padding: 10px 0;

    .scoring-box-item {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #efefef;
      margin: 0 2px;
      border-radius: 6px;
      box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.03);
      border: 1px solid #f1f3f5;

      span {
        color: var(--player-text, #4263eb);
        opacity: 0.85;
        font-size: 300px;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
    }
  }

  .player-card-button {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #eee;

    .score-button {
      width: 49%;
      height: 120px;
      margin: 4px 0;
      text-align: center;
      line-height: 120px;
      cursor: pointer;
      background-color: #ffffff;
      border-radius: 6px;
      font-size: 36px;
      font-weight: 600;
      color: #495057;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      border: 1px solid #e9ecef;

      &:hover {
        background-color: var(--player-background, #f8f9fa);
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
        border-color: var(--player-secondary, #bac8ff);
        color: var(--player-text, #4263eb);
      }

      &:active {
        background-color: var(--player-background, #f1f3f5);
        transform: translateY(0);
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #f8f9fa;

        &:hover {
          transform: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border-color: #e9ecef;
          color: #495057;
        }
      }
    }
  }
}

// 调整全局样式为更柔和的颜色
:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  background-color: #ffffff;
  border-left: 1px solid #e9ecef;

  &.is-active {
    background-color: #5c7cfa;
    opacity: 0.9;
    border-bottom: none;
    color: white;
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-dialog) {
  border-radius: 10px;
  overflow: hidden;

  .el-dialog__header {
    background-color: #5c7cfa;
    opacity: 0.9;
    padding: 15px 20px;
    margin: 0;

    .el-dialog__title {
      color: white;
      font-weight: 600;
    }
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    border-top: 1px solid #f1f3f5;
    padding: 15px 20px;
  }
}

:deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;

  &.el-button--primary {
    background-color: #5c7cfa;
    border-color: #5c7cfa;
    opacity: 0.9;

    &:hover,
    &:focus {
      background-color: #4c6ef5;
      border-color: #4c6ef5;
      opacity: 1;
    }
  }

  &.el-button--danger {
    background-color: #f03e3e;
    border-color: #f03e3e;
    opacity: 0.9;

    &:hover,
    &:focus {
      background-color: #e03131;
      border-color: #e03131;
      opacity: 1;
    }
  }

  &.el-button--warning {
    background-color: #fd7e14;
    border-color: #fd7e14;
    opacity: 0.9;

    &:hover,
    &:focus {
      background-color: #f76707;
      border-color: #f76707;
      opacity: 1;
    }
  }
}

// 添加完全重置按钮样式
.reset-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  opacity: 0.6;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
}
</style>
