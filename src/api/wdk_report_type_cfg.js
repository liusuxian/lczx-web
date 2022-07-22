import request from '@/utils/request'

export function getReportTypeCfgList(data) {
  return request({
    url: 'wdk/reportTypeCfg/list',
    method: 'get',
    params: data
  })
}

export function getAllReportTypeCfg() {
  return request({
    url: 'wdk/reportTypeCfg/all',
    method: 'get'
  })
}

export function addReportTypeCfg(data) {
  return request({
    url: 'wdk/reportTypeCfg/add',
    method: 'post',
    data
  })
}

export function getReportTypeCfg(data) {
  return request({
    url: 'wdk/reportTypeCfg/info',
    method: 'get',
    params: data
  })
}

export function updateReportTypeCfg(data) {
  return request({
    url: 'wdk/reportTypeCfg/edit',
    method: 'put',
    data
  })
}

export function deleteReportTypeCfg(data) {
  return request({
    url: 'wdk/reportTypeCfg/delete',
    method: 'delete',
    data
  })
}
