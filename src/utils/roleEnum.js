/**
 * 用户身份角色枚举
 */
export const UserRoleEnum = {
  SUPER_ADMIN: {
    value: 1,
    label: '超级管理员',
    key: 'SUPER_ADMIN',
  },
  ADMIN: {
    value: 2,
    label: '管理员',
    key: 'ADMIN',
  },
  OPERATOR: {
    value: 3,
    label: '运营',
    key: 'OPERATOR',
  },
}

/**
 * 获取角色标签
 * @param {number} value 角色值
 * @returns {string} 角色标签
 */
export function getRoleLabel(value) {
  return Object.values(UserRoleEnum).find((item) => item.value === value)?.label || '未知角色'
}

/**
 * 获取角色值
 * @param {string} key 角色键
 * @returns {number} 角色值
 */
export function getRoleValue(key) {
  return UserRoleEnum[key]?.value
}

/**
 * 获取所有角色选项
 * @returns {Array} 角色选项
 */
export function getRoleOptions() {
  return Object.values(UserRoleEnum).map((item) => ({
    label: item.label,
    value: item.value,
  }))
}
