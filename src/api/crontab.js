import request from '@/utils/request'

export function getClientOptions() {
  return request({
    url: 'monitor/crontab/clientOptions',
    method: 'get'
  })
}

export function getCrontabList(data) {
  return request({
    url: 'monitor/crontab/list',
    method: 'get',
    params: data
  })
}

export function addCrontab(data) {
  return request({
    url: 'monitor/crontab/add',
    method: 'post',
    data
  })
}

export function getCrontab(data) {
  return request({
    url: 'monitor/crontab/info',
    method: 'get',
    params: data
  })
}

export function updateCrontab(data) {
  return request({
    url: 'monitor/crontab/edit',
    method: 'put',
    data
  })
}

export function startCrontab(data) {
  return request({
    url: 'monitor/crontab/start',
    method: 'put',
    data
  })
}

export function stopCrontab(data) {
  return request({
    url: 'monitor/crontab/stop',
    method: 'put',
    data
  })
}

export function runCrontab(data) {
  return request({
    url: 'monitor/crontab/run',
    method: 'put',
    data
  })
}

export function deleteCrontab(data) {
  return request({
    url: 'monitor/crontab/delete',
    method: 'delete',
    data
  })
}
