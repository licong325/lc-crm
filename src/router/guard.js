import { useUserStore } from '@/stores/user.js'

// 白名单路由
const whiteList = ['/login', '/403']

export function setupRouterGuard(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    if (userStore.token) {
      if (to.path === '/login') {
        next('/home')
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
