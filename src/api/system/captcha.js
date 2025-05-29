import request from '@/utils/request'

/**
 * 获取验证码
 * @returns {Promise} 返回验证码图片
 */
export function getCaptcha() {
  return request({
    url: '/api/captcha',
    method: 'get',
  })
}

/**
 * 校验验证码
 * @param {Object} data
 * @param {string} data.captchaId 验证码ID
 * @param {string} data.captchaText 验证码
 * @returns {Promise}
 */
export function checkCaptcha(data) {
  return request({
    url: '/api/captcha/verify',
    method: 'post',
    data,
  })
}
