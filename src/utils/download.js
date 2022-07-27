import {
  myFetch
} from '@/utils/my-fetch'
import {
  Message
} from 'element-ui'
const streamSaver = require('streamsaver')

/**
 * @param {string} url 文件存放地址
 * @param {string} fileName 保存文件名称
 */
export function downloadByUrl(url, fileName) {
  if (!url) {
    Message.error('该文件不存在!!!')
    return
  }
  myFetch(url).then((res) => {
    // 获取下载文件的名字
    if (!fileName) {
      fileName = decodeURIComponent(url.split('/').pop().split('?')[0]).split('/').reverse()[0]
    }
    const fileStream = streamSaver.createWriteStream(fileName, {
      size: res.headers.get('content-length')
    })
    const readableStream = res.body
    // more optimized
    if (window.WritableStream && readableStream.pipeTo) {
      return readableStream.pipeTo(fileStream).then(() => {
        Message.success('文件"' + fileName + '"下载成功')
      }).catch(() => {})
    }
    window.writer = fileStream.getWriter()
    const reader = res.body.getReader()
    const pump = () => reader.read().then((res) => {
      res.done ? window.writer.close() : window.writer.write(res.value).then(pump)
    })
    pump()
  }).cache(() => {
    Message.error('该文件无法下载!!!')
  })
}
