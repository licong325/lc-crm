import { useUserStore } from '@/stores/user.js'

// 白名单路由
const whiteList = ['/login']

export function setupRouterGuard(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    if (userStore.token) {
      if (to.path === '/login') {
        next('/')
      } else {
        next()
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next('/login')
      }
    }
  })
}
