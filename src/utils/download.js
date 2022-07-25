import axios from 'axios'
import store from '@/store'
import FileSaver from 'file-saver'
import {
  Message,
  Loading
} from 'element-ui'
import Vue from 'vue'
import _ from 'lodash'
Vue.prototype.$cancelList = []

const dlByUrl = _.throttle(function(url, fileName, downloadType) {
  if (!url) {
    Message.error('该文件不存在!!!')
    return
  }
  let downProgress = {}
  // 可能会连续点击下载多个文件，这里用时间戳来区分每一次下载的文件
  const uniSign = new Date().getTime() + ''
  // 判断文件是否正在下载中
  const progressList = store.state.download.progressList
  if (progressList.length && progressList.find(item => item.url === url)) {
    Message.warning('该文件正在下载!!!')
    return
  } else {
    const CancelToken = axios.CancelToken
    Vue.prototype.$cancelList.push({
      ...{
        url: url
      },
      cancel: CancelToken.source()
    })
    const loading = Loading.service({
      lock: true,
      text: '',
      background: 'rgba(6, 6, 6, 0.1) !important'
    })
    const startTime = Date.now()
    axios.get(url, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      cancelToken: Vue.prototype.$cancelList.find(item => item.url === url).cancel.token,
      onDownloadProgress(progress) {
        loading.close()
        // progress对象中的loaded表示已经下载的数量，total表示总数量，这里计算出百分比
        downProgress = Math.round(100 * progress.loaded / progress.total)
        // 计算出当前的下载速度
        const duration = (Date.now() - startTime) / 1000
        const speed = sizeFormat(progress.loaded / duration, 0)
        // 计算出剩余时间
        const speedList = speed.split(' ')
        const remainTime = getRemainTime(speedList[0], speedList[1], progress.total - progress.loaded)
        // 修改进度
        store.dispatch('download/setProgress', {
          path: uniSign,
          fileName: getDownloadName(url, fileName),
          url: url,
          progress: downProgress,
          progressDetail: speed + '/秒 - ' + sizeFormat(progress.loaded, 1) + '，共 ' + sizeFormat(progress.total, 1) + '，还剩 ' + remainTime
        })
      }
    }).then((res) => {
      // 文件流传输完成后，开启文件下载
      let file = null
      if (downloadType === 'pdf') {
        file = new Blob([res.data], {
          type: 'application/pdf'
        })
      } else {
        file = new Blob([res.data], {
          type: 'application/zip'
        })
      }
      FileSaver.saveAs(file, getDownloadName(url, fileName))
    }).catch((e) => {
      if (e.message === 'cancel') {
        Message.error('当前下载已被手动取消!!!')
      } else {
        Message.error('该文件无法下载!!!')
      }
    })
  }
}, 1000)

/**
 * @param {string} url 文件存放地址
 * @param {string} fileName 保存文件名称
 * @param {string} downloadType 保存文件格式
 */
export function downloadByUrl(url, fileName, downloadType) {
  dlByUrl(url, fileName, downloadType)
}

// 获取下载文件的名字
function getDownloadName(url, fileName) {
  if (fileName) {
    return fileName
  } else {
    return decodeURIComponent(url.split('/').pop().split('?')[0]).split('/').reverse()[0]
  }
}

// 格式化文件大小
function sizeFormat(size, fixedNum) {
  size = parseFloat(size)
  let rank = 0
  let rankChar = 'Bytes'
  while (size > 1024 && rankChar !== 'GB') {
    size = size / 1024
    rank++
    if (rank === 1) {
      rankChar = 'KB'
    } else if (rank === 2) {
      rankChar = 'MB'
    } else if (rank === 3) {
      rankChar = 'GB'
    }
  }
  return size.toFixed(fixedNum) + ' ' + rankChar
}

// 获取下载剩余时间
function getRemainTime(speed, rankChar, remainSize) {
  speed = parseFloat(speed)
  if (rankChar === 'GB') {
    return timeFormat(remainSize / 1024 / 1024 / 1024 / speed, 0)
  } else if (rankChar === 'MB') {
    return timeFormat(remainSize / 1024 / 1024 / speed, 0)
  } else if (rankChar === 'KB') {
    return timeFormat(remainSize / 1024 / speed, 0)
  }
}

// 格式化时间
function timeFormat(second, fixedNum) {
  second = parseFloat(second)
  let rank = 0
  let rankChar = '秒'
  while (second > 60 && rankChar !== '小时') {
    second = second / 60
    rank++
    if (rank === 1) {
      rankChar = '分钟'
    } else if (rank === 2) {
      rankChar = '小时'
    }
  }
  return second.toFixed(fixedNum) + ' ' + rankChar
}
