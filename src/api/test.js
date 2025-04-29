import { get, post, put, del } from '@/utils/request.js'
// 这是个测试axios封装的文件
// 用户相关接口
export const userApi = {
  /**
   * 用户登录
   * @param {*} data
   * @param {string} data.username 用户名
   * @param {string} data.password 密码
   * @returns
   */
  login: (data) => post('/api/user/login', data),

  // 获取用户信息
  getUserInfo: () => get('/api/user/info'),

  // 修改用户信息
  updateUserInfo: (data) => put('/api/user/info', data),
}

// 后台用户管理接口
export const adminApi = {
  // 获取后台用户列表
  getList: (params) => get('/api/admin/users', params),

  // 添加后台用户
  addUser: (data) => post('/api/admin/users', data),

  // 修改后台用户
  updateUser: (data) => put(`/api/admin/users/${data.id}`, data),

  // 删除后台用户
  deleteUser: (id) => del(`/api/admin/users/${id}`),

  // 修改用户状态
  updateStatus: (data) => put(`/api/admin/users/${data.id}/status`, data),
}

// 权限管理接口
export const permissionApi = {
  // 获取权限列表
  getList: () => get('/api/permissions'),

  // 添加权限
  add: (data) => post('/api/permissions', data),

  // 修改权限
  update: (data) => put(`/api/permissions/${data.id}`, data),

  // 删除权限
  delete: (id) => del(`/api/permissions/${id}`),
}
