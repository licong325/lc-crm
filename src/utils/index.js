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

/**
 * 将时间戳格式化为指定格式的字符串
 * @param {number} timestamp - 秒级时间戳
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - 输出格式
 * @returns {string} 格式化后的时间字符串
 * @example
 * formatTimestamp(1682054400) // => '2023-04-21 12:00:00'
 * formatTimestamp(1682054400, 'YYYY-MM-DD') // => '2023-04-21'
 * formatTimestamp(1682054400, 'MM-DD HH:mm') // => '04-21 12:00'
 */
export function formatTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp) return ''

  const date = new Date(timestamp * 1000) // 转换为毫秒级时间戳

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
