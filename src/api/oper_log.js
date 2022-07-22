import request from '@/utils/request'

export function getClientOptions() {
  return request({
    url: 'monitor/operLog/clientOptions',
    method: 'get'
  })
}

export function getOperLogList(data) {
  return request({
    url: 'monitor/operLog/list',
    method: 'get',
    params: data
  })
}

export function deleteOperLog(data) {
  return request({
    url: 'monitor/operLog/delete',
    method: 'delete',
    data
  })
}

export function clearOperLog() {
  return request({
    url: 'monitor/operLog/clear',
    method: 'delete'
  })
}
