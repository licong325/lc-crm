<script setup>
/**
 * 悬浮式语言切换按钮组件
 * 支持拖拽、位置记忆、自适应背景色
 * @component LanguageSwitch
 * @example
 * <template>
 *   <language-switch />
 * </template>
 */
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LANGUAGES } from '@/locales/config'

const props = defineProps({
  variant: {
    type: String,
    default: 'fixed', // 'fixed' | 'inline'
  },
})

const i18n = useI18n()

// 使用全局配置
const currentAbbr = computed(() => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.key === i18n.locale.value)?.abbr || 'ZH'
})

// 按钮位置
const buttonStyle = ref({
  left: '20px',
  top: '50%',
})

// 拖动状态
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })
const currentPos = ref({ x: 0, y: 0 })

// 切换语言
const switchLanguage = (lang) => {
  i18n.locale.value = lang
  // 保存语言选择到 localStorage
  localStorage.setItem('language', lang)
  // 设置文档方向
  document.documentElement.dir = SUPPORTED_LANGUAGES.find((item) => item.key === lang)?.dir || 'ltr'
  ElMessage.success('切换语言成功')
}

// 开始拖动
const handleMouseDown = (e) => {
  isDragging.value = true
  startPos.value = {
    x: e.clientX - currentPos.value.x,
    y: e.clientY - currentPos.value.y,
  }
}

// 拖动中
const handleMouseMove = (e) => {
  if (!isDragging.value) return

  currentPos.value = {
    x: e.clientX - startPos.value.x,
    y: e.clientY - startPos.value.y,
  }

  // 更新按钮位置
  buttonStyle.value = {
    left: `${currentPos.value.x}px`,
    top: `${currentPos.value.y}px`,
  }
}

// 结束拖动
const handleMouseUp = () => {
  isDragging.value = false
  // 保存按钮位置
  localStorage.setItem('languageBtnPosition', JSON.stringify(currentPos.value))
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  // 从 localStorage 恢复语言设置
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    switchLanguage(savedLanguage)
  }

  // 从 localStorage 恢复按钮位置
  const savedPosition = localStorage.getItem('languageBtnPosition')
  if (savedPosition) {
    const { x, y } = JSON.parse(savedPosition)
    currentPos.value = { x, y }
    buttonStyle.value = {
      left: `${x}px`,
      top: `${y}px`,
    }
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div :class="['language-switch', `language-switch--${variant}`]">
    <el-dropdown trigger="click">
      <el-button class="lang-btn">
        <span class="lang-text">{{ currentAbbr }}</span>
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="lang in SUPPORTED_LANGUAGES"
            :key="lang.key"
            @click="switchLanguage(lang.key)">
            <span>{{ lang.abbr }} {{ lang.label }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.language-switch {
  &--fixed {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
  }

  &--inline {
    display: inline-block;
  }

  .lang-btn {
    height: 36px;
    padding: 0 16px;
    border-radius: 18px;
    background: linear-gradient(45deg, #8e44ad, #c471ed);
    border: none;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(142, 68, 173, 0.3);
    }

    .lang-text {
      color: white;
      font-size: 16px;
      font-weight: 500;
    }

    .el-icon {
      color: white;
      margin-left: 4px;
    }
  }
}

:deep(.el-dropdown-menu) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  .el-dropdown-menu__item {
    color: var(--el-text-color-primary);

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
