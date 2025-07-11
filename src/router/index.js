import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { setupRouterGuard } from './guard.js'

// 静态路由 - 不需要权限验证的路由
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
      icon: 'Key',
      hidden: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403.vue'),
    meta: {
      title: '403',
      hidden: true,
    },
  },
]

// 动态路由 - 需要根据用户权限动态加载的路由
export const asyncRoutes = [
  {
    path: '/',
    component: AdminLayout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home.vue'),
        meta: {
          title: '首页概览',
          icon: 'House',
        },
      },
      {
        path: '/manage',
        name: 'manage',
        meta: {
          title: '管理',
          icon: 'Management',
        },
        children: [
          {
            path: 'users',
            name: 'adminUsers',
            component: () => import('@/views/manage/adminUsers.vue'),
            meta: {
              title: '后台用户管理',
              permissions: ['manage.adminUsers'], // 需要的权限
            },
          },
          {
            path: 'permissions',
            name: 'permissions',
            component: () => import('@/views/manage/permissions.vue'),
            meta: {
              title: '权限配置',
              permissions: ['manage.permissions'], // 需要的权限
            },
          },
        ],
      },
      {
        path: '/official',
        name: 'official',
        meta: {
          title: '官方链接',
          icon: 'Link',
        },
        children: [
          {
            path: 'links',
            name: 'officialLinks',
            component: () => import('@/views/official/links.vue'),
            meta: {
              title: '官方链接',
            },
          },
          {
            path: 'config',
            name: 'linkConfig',
            component: () => import('@/views/official/configLink.vue'),
            meta: {
              title: '配置链接',
            },
          },
        ],
      },
      {
        path: '/blacklist',
        name: 'blacklist',
        meta: {
          title: '拉黑',
          icon: 'CircleClose',
        },
        children: [
          {
            path: 'blacklistUsers',
            name: 'blacklistUsers',
            component: () => import('@/views/blacklist/blacklistUsers.vue'),
            meta: {
              title: '拉黑用户',
            },
          },
          {
            path: 'blacklistChatrooms',
            name: 'blacklistChatrooms',
            component: () => import('@/views/blacklist/blacklistChatrooms.vue'),
            meta: {
              title: '拉黑聊天室',
            },
          },
          {
            path: 'broadcast',
            name: 'disableBroadcast',
            component: () => import('@/views/blacklist/broadcast.vue'),
            meta: {
              title: '禁用大喇叭',
            },
          },
          {
            path: 'records',
            name: 'blacklistRecords',
            component: () => import('@/views/blacklist/records.vue'),
            meta: {
              title: '拉黑记录',
            },
          },
        ],
      },
      {
        path: '/posts',
        name: 'posts',
        meta: {
          title: '动态管理',
          icon: 'Document',
        },
        children: [
          {
            path: 'user-posts',
            name: 'userPosts',
            component: () => import('@/views/posts/userPosts.vue'),
            meta: {
              title: '用户动态',
            },
          },
          {
            path: 'delete-records',
            name: 'deleteRecords',
            component: () => import('@/views/posts/deleteRecords.vue'),
            meta: {
              title: '删除记录',
            },
          },
        ],
      },
      {
        path: '/rewards',
        name: 'rewards',
        meta: {
          title: '奖励',
          icon: 'Present',
        },
        children: [
          {
            path: 'give',
            name: 'giveRewards',
            component: () => import('@/views/rewards/give.vue'),
            meta: {
              title: '赠送奖励',
            },
          },
          {
            path: 'records',
            name: 'rewardRecords',
            component: () => import('@/views/rewards/records.vue'),
            meta: {
              title: '赠送记录',
            },
          },
          {
            path: 'rewardConfig',
            name: 'rewardConfig',
            component: () => import('@/views/rewards/rewardConfig.vue'),
            meta: {
              title: '奖励配置',
            },
          },
        ],
      },
      {
        path: '/user-info',
        name: 'userInfo',
        meta: {
          title: '用户信息',
          icon: 'User',
        },
        children: [
          {
            path: 'query',
            name: 'userQuery',
            component: () => import('@/views/userInfo/query.vue'),
            meta: {
              title: '信息查询',
            },
          },
          {
            path: 'modify-records',
            name: 'modifyRecords',
            component: () => import('@/views/userInfo/modifyRecords.vue'),
            meta: {
              title: '修改记录',
            },
          },
        ],
      },
      {
        path: '/ranking',
        name: 'ranking',
        meta: {
          title: '排行榜信息',
          icon: 'TrendCharts',
        },
        children: [
          {
            path: 'clickableUID',
            name: 'rankingClickableUID',
            component: () => import('@/views/ranking/rankingClickableUID.vue'),
            meta: {
              title: '排行榜可点击UID',
            },
          },
        ],
      },
      {
        path: '/functionAll',
        name: 'functionAll',
        meta: {
          title: '功能合集',
          icon: 'TrendCharts',
        },
        children: [
          {
            path: 'billiards',
            name: 'billiards',
            component: () => import('@/views/functionAll/billiards.vue'),
            meta: {
              title: '台球',
            },
          },
          {
            path: 'billiards2',
            name: 'billiards2',
            component: () => import('@/views/functionAll/billiards2.vue'),
            meta: {
              title: '台球2',
            },
          },
          {
            path: 'screenshot',
            name: 'screenshot',
            component: () => import('@/views/functionAll/screenshot.vue'),
            meta: {
              title: '页面截图',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory('/'),
  routes: [...constantRoutes, ...asyncRoutes],
})

/**
 * 重置路由
 */
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory('/'),
    routes: constantRoutes,
  })
  router.matcher = newRouter.matcher
}

// 设置路由守卫
setupRouterGuard(router)

export default router
