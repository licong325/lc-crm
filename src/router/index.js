import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue'),
      meta: {
        title: '登录',
        icon: 'Key',
      },
    },
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/dashboard.vue'),
          meta: {
            title: '首页概览',
            icon: 'House',
          },
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('@/views/users.vue'),
          meta: {
            title: '用户管理',
            icon: 'User',
          },
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('@/views/settings.vue'),
          meta: {
            title: '系统设置',
            icon: 'Setting',
          },
        },
      ],
    },
  ],
})

export default router
