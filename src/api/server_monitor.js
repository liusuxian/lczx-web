import request from '@/utils/request'

export function getServerMonitorInfo() {
  return request({
    url: 'monitor/server_monitor/info',
    method: 'get'
  })
}
