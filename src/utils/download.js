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

const fnByUrl = _.throttle(function(url, fileName, downloadType) {
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
        // 将此次下载的文件名和下载进度组成对象再用vuex状态管理
        store.dispatch('download/setProgress', {
          path: uniSign,
          fileName: getDownloadName(url, fileName),
          url: url,
          'progress': downProgress
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

// 获取下载文件的名字
function getDownloadName(url, fileName) {
  if (fileName) {
    return fileName
  } else {
    return decodeURIComponent(url.split('/').pop().split('?')[0]).split('/').reverse()[0]
  }
}

/**
 * @param {string} url 文件存放地址
 * @param {string} fileName 保存文件名称
 * @param {string} downloadType 保存文件格式
 */
export function downloadByUrl(url, fileName, downloadType) {
  fnByUrl(url, fileName, downloadType)
}
