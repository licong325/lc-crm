import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
    permissionsRoutes: JSON.parse(localStorage.getItem('permissionsRoutes')) || [], // 用户权限路由列表
    menuRoutes: JSON.parse(localStorage.getItem('menuRoutes')) || [], // 新增：菜单显示用的路由
  }),

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },

    setRoutes(routes) {
      this.permissionsRoutes = routes
      localStorage.setItem('permissionsRoutes', JSON.stringify(routes))
      this.setMenuRoutes(routes)
    },

    // 新增：设置菜单路由方法
    setMenuRoutes(routes) {
      this.menuRoutes = routes
      localStorage.setItem('menuRoutes', JSON.stringify(routes))
    },

    logout() {
      this.token = ''
      this.userInfo = {}
      this.permissionsRoutes = []
      this.menuRoutes = []
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('permissionsRoutes')
      localStorage.removeItem('menuRoutes')
    },
  },
})
