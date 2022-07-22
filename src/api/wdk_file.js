import request from '@/utils/request'
import uploadRequest from '@/utils/upload-request'

export function getFileRecord(data) {
  return request({
    url: 'wdk/file/record',
    method: 'get',
    params: data
  })
}

export function addFile(data, onUploadProgress) {
  return uploadRequest({
    url: 'wdk/file/add',
    method: 'post',
    data,
    onUploadProgress
  })
}
