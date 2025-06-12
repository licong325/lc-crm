import axios from 'axios'
import { useUserStore } from '@/stores/user.js'

// 环境配置

// 获取当前环境
const getBaseUrl = () => {
  const env = import.meta.env.VITE_APP_ENV

  // 本地开发环境
  if (env === 'development' || import.meta.env.DEV) {
    return 'http://localhost:3000'
  }
  // return 'https://lc-serve.vercel.app'
  return 'https://www.lc-serve.greatli.cn'
}

// 创建 axios 实例
const service = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 如果有token则添加到请求头
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data

    // 根据自定义错误码判断请求是否成功
    if (code === 200 || code === 201 || code === 204) {
      // 将组件中处理的数据返回
      ElMessage.success(message || '操作成功')
      return data
    }

    // 处理错误
    ElMessage.error(message || '系统错误')
    return Promise.reject(new Error(message || '系统错误'))
  },
  (error) => {
    // 处理 HTTP 网络错误
    let message = ''
    // HTTP 状态码
    const status = error.response?.status
    console.log('error', error)
    switch (status) {
      case 400:
        message = error.response.data.message || '请求错误'
        break
      case 401:
        message = '未登录'
        // 这里可以处理未登录或token过期的情况
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
        break
      case 403:
        message = '没有权限'
        router.push('/403')
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器故障'
        break
      default:
        message = '网络连接故障'
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

/**
 * 封装 GET 请求
 * @param {string} url 请求地址
 * @param {Object} params 请求参数
 * @returns {Promise} 返回 Promise 对象
 */
export function get(url, params) {
  return service.get(url, { params })
}

/**
 * 封装 POST 请求
 * @param {string} url 请求地址
 * @param {Object} data 请求参数
 * @returns {Promise} 返回 Promise 对象
 */
export function post(url, data) {
  return service.post(url, data)
}

/**
 * 封装 PUT 请求
 * @param {string} url 请求地址
 * @param {Object} data 请求参数
 * @returns {Promise} 返回 Promise 对象
 */
export function put(url, data) {
  return service.put(url, data)
}

/**
 * 封装 DELETE 请求
 * @param {string} url 请求地址
 * @returns {Promise} 返回 Promise 对象
 */
export function del(url) {
  return service.delete(url)
}

export default service
