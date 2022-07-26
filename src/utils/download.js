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
  fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    headers: {}
  }).then((res) => {
    // 获取下载文件的名字
    fileName = getDownloadName(url, fileName)
    const fileStream = streamSaver.createWriteStream(fileName, {
      size: res.headers.get('content-length')
    })
    const readableStream = res.body
    // more optimized
    if (window.WritableStream && readableStream.pipeTo) {
      return readableStream.pipeTo(fileStream).then(() => {
        console.log('done writing')
      })
    }
    window.writer = fileStream.getWriter()
    const reader = res.body.getReader()
    const pump = () => reader.read().then((res) => {
      res.done ? window.writer.close() : window.writer.write(res.value).then(pump)
    })
    pump()
  }).catch(() => {
    Message.error('该文件无法下载!!!')
  })
}

// 获取下载文件的名字
function getDownloadName(url, fileName) {
  if (fileName) {
    return fileName
  } else {
    return decodeURIComponent(url.split('/').pop().split('?')[0]).split('/').reverse()[0]
  }
}
