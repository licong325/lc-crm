<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: Array,
    default: () => ['开始时间', '结束时间'],
  },
})

const emit = defineEmits(['update:modelValue'])

// 语言设置
const locale = zhCn

// 快捷选项
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

// 时间改变
const handleChange = (val) => {
  if (!val) {
    emit('update:modelValue', [])
    return
  }
  // 转换为秒级时间戳
  const [start, end] = val
  const startTimestamp = Math.floor(new Date(start).getTime() / 1000)
  const endTimestamp = Math.floor(new Date(end).getTime() / 1000)
  emit('update:modelValue', [startTimestamp, endTimestamp])
}

// 显示的时间格式
const formatDisplayValue = (timestamps) => {
  if (!timestamps || !timestamps.length) return []

  // 如果传入的是秒级时间戳，转换为毫秒级
  const [startTimestamp, endTimestamp] = timestamps
  const startDate = new Date(startTimestamp * 1000)
  const endDate = new Date(endTimestamp * 1000)

  // 格式化为 YYYY-MM-DD HH:mm:ss
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return [formatDate(startDate), formatDate(endDate)]
}
</script>

<template>
  <el-config-provider :locale="locale">
    <el-date-picker
      :model-value="formatDisplayValue(modelValue)"
      type="datetimerange"
      range-separator="至"
      :start-placeholder="placeholder[0]"
      :end-placeholder="placeholder[1]"
      @update:model-value="handleChange"
      :shortcuts="shortcuts" />
  </el-config-provider>
</template>
