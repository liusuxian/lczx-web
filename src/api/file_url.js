import request from '@/utils/request'

export function getFileUrl(data) {
  return request({
    url: 'fileUrl/get',
    method: 'get',
    params: data
  })
}
