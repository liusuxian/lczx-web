import request from '@/utils/request'

export function getUserOnlineList(data) {
  return request({
    url: 'monitor/userOnline/list',
    method: 'get',
    params: data
  })
}

export function forceLogout(data) {
  return request({
    url: 'monitor/userOnline/forceLogout',
    method: 'put',
    data
  })
}
