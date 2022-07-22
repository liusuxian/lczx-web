import request from '@/utils/request'
import uploadRequest from '@/utils/upload-request'

export function getAttachmentRecord(data) {
  return request({
    url: 'wdk/attachment/record',
    method: 'get',
    params: data
  })
}

export function addAttachment(data, onUploadProgress) {
  return uploadRequest({
    url: 'wdk/attachment/add',
    method: 'post',
    data,
    onUploadProgress
  })
}

export function deleteAttachment(data) {
  return request({
    url: 'wdk/attachment/delete',
    method: 'delete',
    data
  })
}
