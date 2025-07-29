<template>
  <div class="pinyin-annotation-container">
    <el-card class="annotation-card">
      <template #header>
        <div class="card-header">
          <h2>文本拼音标注工具</h2>
          <p class="subtitle">为汉字添加拼音注释，支持单字和词组标注</p>
        </div>
      </template>

      <div class="input-section">
        <el-form :model="formData" label-position="top">
          <el-form-item label="输入需要标注拼音的文本">
            <el-input
              v-model="formData.inputText"
              type="textarea"
              :rows="4"
              placeholder="请输入中文文本"
              @input="handleInputChange" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="generatePinyin" :loading="loading">
              生成拼音标注
            </el-button>
            <el-button @click="clearAll">清空</el-button>
          </el-form-item>

          <el-form-item label="标注选项">
            <el-radio-group v-model="formData.annotationType">
              <el-radio label="inline">拼音在后</el-radio>
              <el-radio label="ruby">Ruby 标注</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <el-divider content-position="center">预览</el-divider>

      <div class="preview-section">
        <div v-if="result" class="result-container" :class="formData.annotationType">
          <template v-if="formData.annotationType === 'ruby'">
            <div class="ruby-text" v-html="result"></div>
          </template>
          <template v-else>
            <div class="annotated-text" v-html="result"></div>
          </template>
        </div>
        <el-empty v-else description="暂无预览内容"></el-empty>
      </div>

      <div v-if="result" class="action-buttons">
        <el-button type="success" @click="copyResult">
          <el-icon><DocumentCopy /></el-icon>
          复制结果
        </el-button>
        <el-button type="primary" @click="exportHTML">
          <el-icon><Download /></el-icon>
          导出 HTML
        </el-button>
      </div>

      <el-collapse v-model="activeCollapse" class="help-section">
        <el-collapse-item title="使用说明" name="1">
          <div class="help-content">
            <p><strong>基本用法：</strong></p>
            <ol>
              <li>在文本框中输入需要标注拼音的中文文本</li>
              <li>点击"生成拼音标注"按钮</li>
              <li>在预览区查看标注效果</li>
              <li>可以选择不同的标注样式：拼音在后或Ruby标注</li>
              <li>使用复制或导出功能保存结果</li>
            </ol>
            <p><strong>标注模式说明：</strong></p>
            <ul>
              <li><strong>拼音在后：</strong> 拼音显示在汉字后面的括号中</li>
              <li><strong>Ruby标注：</strong> 使用HTML的ruby标签进行标注，适合网页使用</li>
            </ul>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { DocumentCopy, Download } from '@element-plus/icons-vue'
import pinyin from 'pinyin'

// 状态
const formData = reactive({
  inputText: '输入需要标注拼音的文本',
  annotationType: 'inline', // 'inline', 'ruby'
})
const result = ref('')
const loading = ref(false)
const activeCollapse = ref([])

// 初始化
onMounted(() => {
  // 检查是否安装了pinyin库
  if (!pinyin) {
    ElMessage.warning('未检测到pinyin库，请先安装: npm install pinyin')
  }
})

// 处理输入变化
const handleInputChange = () => {
  if (formData.inputText && formData.inputText.trim() !== '') {
    generatePinyin()
  } else {
    result.value = ''
  }
}

// 生成拼音标注
const generatePinyin = () => {
  if (!formData.inputText || formData.inputText.trim() === '') {
    ElMessage.warning('请先输入需要标注的文本')
    return
  }

  loading.value = true

  try {
    // 模拟API调用延迟
    setTimeout(() => {
      const text = formData.inputText.trim()

      // 使用pinyin库生成拼音
      if (pinyin) {
        const pinyinArray = pinyin(text, {
          style: pinyin.STYLE_TONE, // 带声调
          heteronym: false, // 不启用多音字模式
        })

        // 根据不同标注类型生成结果
        switch (formData.annotationType) {
          case 'inline':
            result.value = generateInlineAnnotation(text, pinyinArray)
            break
          case 'ruby':
            result.value = generateRubyAnnotation(text, pinyinArray)
            break
          default:
            result.value = generateInlineAnnotation(text, pinyinArray)
        }
      } else {
        // 如果没有pinyin库，使用模拟数据
        mockPinyinGeneration(text)
      }

      loading.value = false
    }, 500)
  } catch (error) {
    console.error('生成拼音出错:', error)
    ElMessage.error('生成拼音时出错，请重试')
    loading.value = false
  }
}

// 生成拼音在后的标注
const generateInlineAnnotation = (text, pinyinArray) => {
  let html = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    // 检查是否为中文字符
    if (/[\u4e00-\u9fa5]/.test(char)) {
      const py = pinyinArray[i][0] || ''
      html += `${char}(${py}) `
    } else {
      html += char
    }
  }

  return html
}

// 生成Ruby标注
const generateRubyAnnotation = (text, pinyinArray) => {
  let html = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    // 检查是否为中文字符
    if (/[\u4e00-\u9fa5]/.test(char)) {
      const py = pinyinArray[i][0] || ''
      html += `<ruby class="ruby">${char}<rt class="rt">${py}</rt></ruby>`
    } else {
      html += char
    }
  }

  return html
}

// 模拟拼音生成（当pinyin库不可用时）
const mockPinyinGeneration = (text) => {
  const mockPinyin = {
    你: 'nǐ',
    好: 'hǎo',
    世: 'shì',
    界: 'jiè',
    中: 'zhōng',
    国: 'guó',
    人: 'rén',
    我: 'wǒ',
    是: 'shì',
    的: 'de',
    了: 'le',
    在: 'zài',
    有: 'yǒu',
    和: 'hé',
    大: 'dà',
    小: 'xiǎo',
    心: 'xīn',
    重: 'zhòng',
  }

  let html = ''

  switch (formData.annotationType) {
    case 'inline':
      for (const char of text) {
        if (/[\u4e00-\u9fa5]/.test(char)) {
          const py = mockPinyin[char] || 'pīn'
          html += `${char}(${py}) `
        } else {
          html += char
        }
      }
      break
    case 'ruby':
      for (const char of text) {
        if (/[\u4e00-\u9fa5]/.test(char)) {
          const py = mockPinyin[char] || 'pīn'
          html += `<ruby class="ruby">${char}<rt class="rt">${py}</rt></ruby>`
        } else {
          html += char
        }
      }
      break
    default:
      // 默认使用inline模式
      for (const char of text) {
        if (/[\u4e00-\u9fa5]/.test(char)) {
          const py = mockPinyin[char] || 'pīn'
          html += `${char}(${py}) `
        } else {
          html += char
        }
      }
  }

  result.value = html
}

// 复制结果
const copyResult = () => {
  if (!result.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  // 创建临时元素
  const tempElement = document.createElement('div')
  tempElement.innerHTML = result.value
  const textToCopy = tempElement.textContent || tempElement.innerText

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}

// 导出HTML
const exportHTML = () => {
  if (!result.value) {
    ElMessage.warning('没有可导出的内容')
    return
  }

  let htmlContent = ''

  if (formData.annotationType === 'ruby') {
    htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>拼音标注</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
    ruby.ruby { font-size: 24px; color: blue; }
    rt.rt { font-size: 22px; color: #666; }
  </style>
</head>
<body>
  <div class="content">
    ${result.value}
  </div>
</body>
</html>`
  } else if (formData.annotationType === 'inline') {
    htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>拼音标注</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
  </style>
</head>
<body>
  <div class="content">
    ${result.value}
  </div>
</body>
</html>`
  }

  // 创建Blob并下载
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '拼音标注.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  ElMessage.success('HTML文件导出成功')
}

// 清空所有
const clearAll = () => {
  formData.inputText = ''
  result.value = ''
}
</script>

<style lang="scss">
/* 移除scoped，让样式应用到动态生成的内容 */
.pinyin-annotation-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.annotation-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  color: #909399;
  font-size: 14px;
  margin-top: 8px;
}

.input-section {
  margin-bottom: 20px;
}

.preview-section {
  min-height: 150px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

.result-container {
  font-size: 16px;
}

/* 直接定义ruby和rt标签的样式 */
.ruby-text {
  color: red;
  font-size: 24px;
}

ruby.ruby {
  font-size: 24px;
  color: #000;
  margin: 0 4px;
}

rt.rt {
  font-size: 22px;
  color: red;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.help-section {
  margin-top: 20px;
}

.help-content {
  font-size: 18px;
  color: #606266;
}

.help-content p {
  margin-bottom: 10px;
}

.help-content ul,
.help-content ol {
  padding-left: 20px;
}

.help-content li {
  margin-bottom: 5px;
}
</style>
