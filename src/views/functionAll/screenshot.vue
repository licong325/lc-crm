<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

// 状态控制
const previewVisible = ref(false)
const isSelecting = ref(false)
const isCapturing = ref(false)

// DOM 元素引用
const previewCanvas = ref(null)

// 截图相关数据
const screenshotData = ref({
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  width: 0,
  height: 0,
})

// 遮罩层和选择框元素
let maskLayer = null
let selectionBox = null
let currentScreenshot = null

/**
 * 开始截图功能
 */
const startScreenshot = () => {
  if (isCapturing.value) return

  isCapturing.value = true
  createMaskLayer()
  bindMouseEvents()
  isSelecting.value = true
}

/**
 * 创建遮罩层和选择框
 */
const createMaskLayer = () => {
  // 创建半透明遮罩
  maskLayer = document.createElement('div')
  maskLayer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    z-index: 9999;
    cursor: crosshair;
    user-select: none;
  `

  // 创建选择框
  selectionBox = document.createElement('div')
  selectionBox.style.cssText = `
    position: absolute;
    border: 2px dashed #409eff;
    background: rgba(64, 158, 255, 0.1);
    display: none;
    pointer-events: none;
    box-sizing: border-box;
  `

  // 创建坐标显示
  const coordsDisplay = document.createElement('div')
  coordsDisplay.id = 'coords-display'
  coordsDisplay.style.cssText = `
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: none;
    pointer-events: none;
  `

  maskLayer.appendChild(selectionBox)
  maskLayer.appendChild(coordsDisplay)
  document.body.appendChild(maskLayer)
}

/**
 * 绑定鼠标事件
 */
const bindMouseEvents = () => {
  maskLayer.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('keydown', handleKeyDown)
}

/**
 * 移除事件监听
 */
const unbindMouseEvents = () => {
  if (maskLayer) {
    maskLayer.removeEventListener('mousedown', handleMouseDown)
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('keydown', handleKeyDown)
}

/**
 * 鼠标按下事件
 */
const handleMouseDown = (e) => {
  if (!isSelecting.value) return
  e.preventDefault()

  // 记录起始坐标（相对于视口）
  screenshotData.value.startX = e.clientX
  screenshotData.value.startY = e.clientY

  // 显示选择框
  selectionBox.style.display = 'block'
  selectionBox.style.left = e.clientX + 'px'
  selectionBox.style.top = e.clientY + 'px'
  selectionBox.style.width = '0px'
  selectionBox.style.height = '0px'

  // 显示坐标
  const coordsDisplay = document.getElementById('coords-display')
  coordsDisplay.style.display = 'block'
}

/**
 * 鼠标移动事件
 */
const handleMouseMove = (e) => {
  if (!isSelecting.value || !selectionBox.style.display || selectionBox.style.display === 'none')
    return
  e.preventDefault()

  // 计算当前坐标
  const currentX = e.clientX
  const currentY = e.clientY

  // 计算选择框尺寸和位置
  const width = Math.abs(currentX - screenshotData.value.startX)
  const height = Math.abs(currentY - screenshotData.value.startY)

  const left = Math.min(currentX, screenshotData.value.startX)
  const top = Math.min(currentY, screenshotData.value.startY)

  // 更新选择框
  selectionBox.style.left = left + 'px'
  selectionBox.style.top = top + 'px'
  selectionBox.style.width = width + 'px'
  selectionBox.style.height = height + 'px'

  // 更新坐标显示
  const coordsDisplay = document.getElementById('coords-display')
  coordsDisplay.textContent = `${width} × ${height}`
  coordsDisplay.style.left = currentX + 10 + 'px'
  coordsDisplay.style.top = currentY - 30 + 'px'
}

/**
 * 鼠标释放事件
 */
const handleMouseUp = (e) => {
  if (!isSelecting.value) return
  e.preventDefault()

  // 记录结束坐标
  screenshotData.value.endX = e.clientX
  screenshotData.value.endY = e.clientY

  // 计算最终区域
  screenshotData.value.width = Math.abs(screenshotData.value.endX - screenshotData.value.startX)
  screenshotData.value.height = Math.abs(screenshotData.value.endY - screenshotData.value.startY)

  // 如果选择区域太小，取消截图
  if (screenshotData.value.width < 10 || screenshotData.value.height < 10) {
    ElMessage.warning('选择区域太小，请重新选择')
    cancelScreenshot()
    return
  }

  // 执行截图
  executeScreenshot()
}

/**
 * 键盘事件处理（ESC取消）
 */
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isSelecting.value) {
    cancelScreenshot()
  }
}

/**
 * 执行截图
 */
const executeScreenshot = () => {
  // 计算实际截图区域（考虑滚动）
  const actualStartX =
    Math.min(screenshotData.value.startX, screenshotData.value.endX) + window.scrollX
  const actualStartY =
    Math.min(screenshotData.value.startY, screenshotData.value.endY) + window.scrollY

  // 更新截图数据
  screenshotData.value.startX = actualStartX
  screenshotData.value.startY = actualStartY

  // 移除遮罩层
  removeMaskLayer()

  // 等待一帧后执行截图（确保遮罩消失）
  requestAnimationFrame(() => {
    captureSelectedArea()
  })
}

/**
 * 捕获选中区域 - 使用DOM遍历方法
 */
const captureSelectedArea = async () => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // 设置canvas尺寸
    canvas.width = screenshotData.value.width
    canvas.height = screenshotData.value.height

    // 使用DOM遍历方法截图
    await captureWithDOMTraversal(canvas, ctx)
  } catch (error) {
    console.error('截图失败：', error)
    ElMessage.error('截图失败：' + error.message)
    isCapturing.value = false
  }
}

/**
 * DOM遍历截图方法
 */
const captureWithDOMTraversal = async (canvas, ctx) => {
  // 填充白色背景
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 获取选中区域内的所有元素
  const elements = getElementsInSelection()

  console.log(`找到 ${elements.length} 个元素在选择区域内`)

  // 按层级排序，确保正确的绘制顺序
  elements.sort((a, b) => {
    const aZIndex = parseInt(window.getComputedStyle(a.element).zIndex) || 0
    const bZIndex = parseInt(window.getComputedStyle(b.element).zIndex) || 0
    return aZIndex - bZIndex
  })

  // 绘制每个元素
  for (const elementData of elements) {
    await drawElementToCanvas(ctx, elementData)
  }

  showPreview(canvas)
}

/**
 * 获取选择区域内的元素
 */
const getElementsInSelection = () => {
  const elements = []
  const allElements = document.querySelectorAll('*')

  const selectionRect = {
    left: screenshotData.value.startX,
    top: screenshotData.value.startY,
    right: screenshotData.value.startX + screenshotData.value.width,
    bottom: screenshotData.value.startY + screenshotData.value.height,
  }

  allElements.forEach((element) => {
    // 跳过遮罩层和选择框
    if (element === maskLayer || element === selectionBox || element.id === 'coords-display') {
      return
    }

    const rect = element.getBoundingClientRect()
    const adjustedRect = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      right: rect.right + window.scrollX,
      bottom: rect.bottom + window.scrollY,
      width: rect.width,
      height: rect.height,
    }

    // 检查元素是否在选择区域内
    if (
      adjustedRect.right > selectionRect.left &&
      adjustedRect.left < selectionRect.right &&
      adjustedRect.bottom > selectionRect.top &&
      adjustedRect.top < selectionRect.bottom
    ) {
      elements.push({
        element,
        rect: {
          x: adjustedRect.left - selectionRect.left,
          y: adjustedRect.top - selectionRect.top,
          width: adjustedRect.width,
          height: adjustedRect.height,
        },
        originalRect: adjustedRect,
      })
    }
  })

  return elements
}

/**
 * 将元素绘制到Canvas
 */
const drawElementToCanvas = async (ctx, elementData) => {
  const { element, rect } = elementData

  // 跳过不可见元素
  const style = window.getComputedStyle(element)
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    parseFloat(style.opacity) === 0
  ) {
    return
  }

  // 跳过太小的元素
  if (rect.width < 1 || rect.height < 1) {
    return
  }

  try {
    // 保存canvas状态
    ctx.save()

    // 设置裁剪区域，避免绘制超出边界
    ctx.beginPath()
    ctx.rect(
      Math.max(0, rect.x),
      Math.max(0, rect.y),
      Math.min(rect.width, ctx.canvas.width - Math.max(0, rect.x)),
      Math.min(rect.height, ctx.canvas.height - Math.max(0, rect.y))
    )
    ctx.clip()

    // 绘制背景色
    if (
      style.backgroundColor &&
      style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
      style.backgroundColor !== 'transparent'
    ) {
      ctx.fillStyle = style.backgroundColor
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    }

    // 绘制边框
    const borderWidth = parseInt(style.borderWidth) || 0
    if (borderWidth > 0 && style.borderStyle !== 'none') {
      ctx.strokeStyle = style.borderColor || '#000000'
      ctx.lineWidth = borderWidth
      ctx.strokeRect(
        rect.x + borderWidth / 2,
        rect.y + borderWidth / 2,
        rect.width - borderWidth,
        rect.height - borderWidth
      )
    }

    // 绘制图片
    if (element.tagName === 'IMG' && element.complete && element.naturalWidth > 0) {
      await drawImageToCanvas(ctx, element, rect)
    }
    // 绘制文本内容（只对叶子节点）
    else if (element.children.length === 0 && element.textContent.trim()) {
      drawTextToCanvas(ctx, element, rect, style)
    }

    // 恢复canvas状态
    ctx.restore()
  } catch (error) {
    console.warn('绘制元素失败：', error)
    ctx.restore()
  }
}

/**
 * 绘制文本到Canvas
 */
const drawTextToCanvas = (ctx, element, rect, style) => {
  const text = element.textContent.trim()
  if (!text) return

  // 设置文本样式
  const fontSize = parseInt(style.fontSize) || 14
  const fontFamily = style.fontFamily || 'Arial'
  const fontWeight = style.fontWeight || 'normal'

  ctx.fillStyle = style.color || '#000000'
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  // 简单的文本绘制（不换行）
  const padding = 4
  const maxWidth = rect.width - padding * 2

  if (maxWidth > 0) {
    // 如果文本太长，进行截断
    let displayText = text
    const textWidth = ctx.measureText(text).width

    if (textWidth > maxWidth) {
      // 截断文本并添加省略号
      let truncated = text
      while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1)
      }
      displayText = truncated + '...'
    }

    ctx.fillText(displayText, rect.x + padding, rect.y + padding)
  }
}

/**
 * 绘制图片到Canvas
 */
const drawImageToCanvas = (ctx, img, rect): Promise<void> => {
  return new Promise<void>((resolve) => {
    try {
      // 直接绘制图片
      ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height)
      resolve()
    } catch (error) {
      console.warn('绘制图片失败，使用占位符', error)
      // 绘制占位符
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height)

      ctx.strokeStyle = '#dcdfe6'
      ctx.lineWidth = 1
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)

      ctx.fillStyle = '#909399'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('图片', rect.x + rect.width / 2, rect.y + rect.height / 2)

      resolve()
    }
  })
}

/**
 * 显示预览弹窗
 */
const showPreview = (canvas) => {
  currentScreenshot = canvas
  previewVisible.value = true

  nextTick(() => {
    if (previewCanvas.value) {
      const previewCtx = previewCanvas.value.getContext('2d')
      previewCanvas.value.width = canvas.width
      previewCanvas.value.height = canvas.height

      // 绘制截图内容
      previewCtx.drawImage(canvas, 0, 0)
    }
  })

  isCapturing.value = false
}

/**
 * 下载图片
 */
const downloadImage = () => {
  if (!currentScreenshot) return

  currentScreenshot.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `screenshot_${new Date().getTime()}.png`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    ElMessage.success('图片下载成功')
  }, 'image/png')
}

/**
 * 重新裁剪
 */
const cropAgain = () => {
  previewVisible.value = false
  currentScreenshot = null
  // 重新开始截图
  setTimeout(() => {
    startScreenshot()
  }, 100)
}

/**
 * 取消截图
 */
const cancelScreenshot = () => {
  removeMaskLayer()
  isSelecting.value = false
  isCapturing.value = false
  screenshotData.value = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    width: 0,
    height: 0,
  }
}

/**
 * 移除遮罩层
 */
const removeMaskLayer = () => {
  unbindMouseEvents()

  if (maskLayer && document.body.contains(maskLayer)) {
    document.body.removeChild(maskLayer)
  }

  maskLayer = null
  selectionBox = null
  isSelecting.value = false
}

/**
 * 关闭预览弹窗
 */
const closePreview = () => {
  previewVisible.value = false
  currentScreenshot = null
}

// 组件卸载时清理
onUnmounted(() => {
  removeMaskLayer()
})
</script>

<template>
  <div class="screenshot-page">
    <!-- 操作区域 -->
    <div class="controls">
      <el-card>
        <h2>页面截图工具</h2>
        <p>点击开始截图，然后用鼠标框选需要截图的区域，将会捕获区域内的页面元素</p>

        <div class="button-group">
          <el-button
            type="primary"
            size="large"
            :loading="isCapturing"
            :disabled="isSelecting"
            @click="startScreenshot">
            <el-icon><Camera /></el-icon>
            {{ isCapturing ? '选择截图区域...' : '开始截图' }}
          </el-button>

          <el-button v-if="isSelecting" @click="cancelScreenshot">
            <el-icon><Close /></el-icon>
            取消截图 (ESC)
          </el-button>
        </div>

        <div class="tips">
          <el-alert title="使用说明" type="info" :closable="false">
            <ul>
              <li>1. 点击"开始截图"按钮</li>
              <li>2. 按住鼠标左键拖拽选择区域</li>
              <li>3. 松开鼠标完成选择</li>
              <li>4. 系统会捕获区域内的页面元素（文本、图片、背景等）</li>
              <li>5. 在预览窗口中下载或重新截图</li>
              <li>6. 按ESC键可以取消截图</li>
            </ul>
          </el-alert>
        </div>
      </el-card>
    </div>

    <!-- 预览弹窗 -->
    <el-dialog
      v-model="previewVisible"
      title="截图预览"
      width="80%"
      :close-on-click-modal="false"
      @close="closePreview">
      <div class="preview-container">
        <canvas ref="previewCanvas" class="preview-canvas"></canvas>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="downloadImage">
            <el-icon><Download /></el-icon>
            下载图片
          </el-button>
          <el-button @click="cropAgain">
            <el-icon><Crop /></el-icon>
            重新截图
          </el-button>
          <el-button @click="closePreview"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.screenshot-page {
  padding: 20px;

  .controls {
    max-width: 800px;
    margin: 0 auto;

    h2 {
      margin-bottom: 10px;
      color: $text-primary;
    }

    p {
      margin-bottom: 20px;
      color: $text-regular;
    }

    .button-group {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .tips {
      ul {
        margin: 0;
        padding-left: 20px;

        li {
          margin-bottom: 5px;
          color: $text-regular;
        }
      }
    }
  }

  .preview-container {
    text-align: center;
    max-height: 60vh;
    overflow: auto;

    .preview-canvas {
      max-width: 100%;
      border: 1px solid $border-color;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}

// 全局样式（用于遮罩层）
:global(#coords-display) {
  font-family: monospace;
}
</style>
