import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({
    username: localStorage.getItem('username') || '',
    avatar: '',
  })

  // 登录
  const login = (username, password) => {
    // 模拟登录
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === '123456') {
          const token = 'mock_token_' + Date.now()
          setToken(token)
          setUserInfo({ username, avatar: '' })
          resolve({ code: 0, message: '登录成功' })
        } else {
          reject({ code: -1, message: '用户名或密码错误' })
        }
      }, 1000)
    })
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = { username: '', avatar: '' }
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  // 设置token
  const setToken = (val) => {
    token.value = val
    localStorage.setItem('token', val)
  }

  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
    localStorage.setItem('username', info.username)
  }

  return {
    token,
    userInfo,
    login,
    logout,
    setToken,
    setUserInfo,
  }
})
