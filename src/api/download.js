import blobRequest from '@/utils/blob-request'

export function downloadFile(data) {
  return blobRequest({
    url: 'download/file',
    responseType: 'blob',
    method: 'get',
    params: data
  })
}
