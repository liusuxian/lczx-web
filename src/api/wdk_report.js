import request from '@/utils/request'
import uploadRequest from '@/utils/upload-request'

export function getReportRecord(data) {
  return request({
    url: 'wdk/report/record',
    method: 'get',
    params: data
  })
}

export function addReport(data, onUploadProgress) {
  return uploadRequest({
    url: 'wdk/report/add',
    method: 'post',
    data,
    onUploadProgress
  })
}

export function deleteReport(data) {
  return request({
    url: 'wdk/report/delete',
    method: 'delete',
    data
  })
}

export function getClientOptions() {
  return request({
    url: 'wdk/report/clientOptions',
    method: 'get'
  })
}

export function getReportList(data) {
  return request({
    url: 'wdk/report/list',
    method: 'get',
    params: data
  })
}

export function chooseExcellence(data) {
  return request({
    url: 'wdk/report/chooseExcellence',
    method: 'put',
    data
  })
}

export function downloadReport(data) {
  return request({
    url: 'wdk/report/download',
    method: 'get',
    params: data
  })
}
