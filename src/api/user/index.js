import request from '@/utils/request'

/**
 * 获取用户列表
 * @param {object} params
 * @param {string} params.username 用户名
 * @param {number} params.page 页码
 * @param {number} params.pageSize 每页条数
 * @returns
 */
export function getUserList(params) {
  return request({
    url: '/api/users/list',
    method: 'get',
    params,
  })
}

/**
 * 删除用户
 * @param {string} id 用户ID
 * @returns
 */
export function deleteUser(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'delete',
  })
}

/**
 * 添加用户
 * @param {object} data
 * @param {string} data.username 用户名
 * @param {string} data.password 密码
 * @param {number} data.role 用户身份
 * @returns
 */
export function addUser(data) {
  return request({
    url: '/api/users/addUser',
    method: 'post',
    data,
  })
}
