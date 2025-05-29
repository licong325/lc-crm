import request from '@/utils/request'

/**
 * 登录
 * @param {Object} data
 * @param {string} data.username 用户名
 * @param {string} data.password 密码
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data,
  })
}
