import request from '@/utils/request'

export function getClientOptions() {
  return request({
    url: 'monitor/loginLog/clientOptions',
    method: 'get'
  })
}

export function getLoginLogList(data) {
  return request({
    url: 'monitor/loginLog/list',
    method: 'get',
    params: data
  })
}

export function deleteLoginLog(data) {
  return request({
    url: 'monitor/loginLog/delete',
    method: 'delete',
    data
  })
}

export function clearLoginLog() {
  return request({
    url: 'monitor/loginLog/clear',
    method: 'delete'
  })
}
