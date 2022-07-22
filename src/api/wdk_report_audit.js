import request from '@/utils/request'

export function getReportAuditList(data) {
  return request({
    url: 'wdk/reportAudit/list',
    method: 'get',
    params: data
  })
}

export function reportAudit(data) {
  return request({
    url: 'wdk/reportAudit/audit',
    method: 'put',
    data
  })
}

export function getReportUploadAuditList(data) {
  return request({
    url: 'wdk/reportAudit/uploadAuditList',
    method: 'get',
    params: data
  })
}

export function reportRescindAudit(data) {
  return request({
    url: 'wdk/reportAudit/rescindAudit',
    method: 'put',
    data
  })
}

export function getReportAuditProcess(data) {
  return request({
    url: 'wdk/reportAudit/auditProcess',
    method: 'get',
    params: data
  })
}
