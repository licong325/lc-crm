import request from '@/utils/request'

/**
 * 获取角色列表
 * @returns
 */
export function getRoleList() {
  return request({
    url: '/api/roles/getRoles',
    method: 'get',
  })
}

/**
 * 新增角色
 * @param {Object} data - 请求体
 * @param {string} data.roleName - 角色名称 (必填)
 * @param {Array<string>} data.routerList - 路由权限列表
 * @param {string} data.remark - 角色备注 (可选，默认为空字符串)
 * @returns
 */
export function addRole(data) {
  return request({
    url: '/api/roles/addRole',
    method: 'post',
    data,
  })
}

/**
 * 新增角色
 * @param {Object} data - 请求体
 * @param {number} data.roleId - 角色ID (必填)
 * @returns
 */
export function deleteRole(data) {
  return request({
    url: '/api/roles/deleteRole',
    method: 'post',
    data,
  })
}

/**
 * 新增角色
 * @param {Object} data - 请求体
 * @param {number} data.roleId - 角色ID (必填)
 * @param {Array} data.routerList - 权限数组
 * @returns
 */
export function updateRole(data) {
  return request({
    url: '/api/roles/updateRole',
    method: 'post',
    data,
  })
}
