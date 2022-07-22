import request from '@/utils/request'
import uploadRequest from '@/utils/upload-request'

export function getServiceRecord(data) {
  return request({
    url: 'wdk/service/record',
    method: 'get',
    params: data
  })
}

export function addService(data, onUploadProgress) {
  return uploadRequest({
    url: 'wdk/service/add',
    method: 'post',
    data,
    onUploadProgress
  })
}

export function deleteService(data) {
  return request({
    url: 'wdk/service/delete',
    method: 'delete',
    data
  })
}
