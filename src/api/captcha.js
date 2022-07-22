import request from '@/utils/request'

export function getCaptcha() {
  return request({
    url: 'captcha/img',
    method: 'get'
  })
}
