/**
 * 使用现代 Clipboard API 复制文本
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
const copyWithClipboardAPI = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
    return true
  } catch (err) {
    return false
  }
}

/**
 * iOS设备特殊处理
 * @param {HTMLTextAreaElement} textArea - 文本区域元素
 */
const copyForiOS = (textArea) => {
  textArea.contentEditable = true
  textArea.readOnly = false
  const range = document.createRange()
  range.selectNodeContents(textArea)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  textArea.setSelectionRange(0, 999999)
}

/**
 * 使用 execCommand 复制文本
 * @param {string} text - 要复制的文本
 * @returns {boolean} 是否复制成功
 */
const copyWithExecCommand = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;'
  document.body.appendChild(textArea)

  try {
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      copyForiOS(textArea)
    } else {
      textArea.select()
    }

    document.execCommand('copy')
    ElMessage.success('复制成功')
    return true
  } catch (err) {
    return false
  } finally {
    document.body.removeChild(textArea)
  }
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<void>}
 */
export const copyText = async (text) => {
  // 优先使用现代 API
  if (navigator.clipboard && window.isSecureContext) {
    const success = await copyWithClipboardAPI(text)
    if (success) return
  }

  // 降级使用 execCommand
  const success = copyWithExecCommand(text)
  if (!success) {
    ElMessage.error('复制失败')
  }
}
