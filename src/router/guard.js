import { useUserStore } from '@/stores/user.js'
import { asyncRoutes, constantRoutes } from './index.js'
// 白名单路由
const whiteList = ['/login', '/403']

// 根据权限过滤路由
function filterAsyncRoutes(routes, permissionsRoutes) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }

    // 如果是顶层AdminLayout，直接保留，只过滤其子路由
    if (tmp.path === '/' && tmp.component) {
      // 复制一份子路由
      const filteredChildren = []

      if (tmp.children && tmp.children.length) {
        // 处理每个子路由
        tmp.children.forEach((child) => {
          // 如果子路由名称在权限列表中
          if (permissionsRoutes.includes(child.name)) {
            filteredChildren.push({ ...child })
          }
          // 如果是父级菜单（有子菜单的路由）
          else if (child.children && child.children.length) {
            // 过滤子菜单
            const subChildren = child.children.filter((subChild) =>
              permissionsRoutes.includes(subChild.name)
            )

            // 如果有可访问的子菜单，则保留父菜单
            if (subChildren.length > 0) {
              filteredChildren.push({
                ...child,
                children: subChildren,
              })
            }
          }
        })
      }

      // 保留布局并更新过滤后的子路由
      if (filteredChildren.length) {
        tmp.children = filteredChildren
        res.push(tmp)
      }
    }
    // 其他非布局路由，直接检查权限
    else if (permissionsRoutes.includes(tmp.name)) {
      res.push(tmp)
    }
  })

  return res
}

export function setupRouterGuard(router) {
  // 标记路由是否已添加
  let isRoutesAdded = false

  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    if (userStore.token) {
      if (to.path === '/login') {
        next('/home')
      } else {
        // 如果路由没有添加过，并且有权限路由
        if (!isRoutesAdded && userStore.permissionsRoutes?.length) {
          // 获取权限路由列表
          const permRoutes = userStore.permissionsRoutes
          console.log('用户权限路由列表:', permRoutes)

          // 过滤动态路由
          const accessRoutes = filterAsyncRoutes(asyncRoutes, permRoutes)
          console.log('过滤后的动态路由:', accessRoutes)

          // 动态添加路由
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })

          // 重要：将过滤后的路由保存到store中供菜单使用
          userStore.menuRoutes = accessRoutes

          isRoutesAdded = true

          // 重新导航确保匹配新添加的路由
          next({ path: to.path, replace: true })
          return
        }
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
