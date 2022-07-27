import {
  myFetch
} from '@/utils/my-fetch'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// request interceptor
myFetch.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers = {
        'Authorization': 'Bearer ' + getToken()
      }
    }
    console.log('myFetch request: ', config)
    return config
  }
)

// response interceptor
myFetch.interceptors.response.use(
  response => {
    console.log('myFetch response: ', response)
    if (response.status !== 200) {
      Message({
        message: response.statusText || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(response.statusText || 'Error'))
    } else {
      return response
    }
  }
)

export default myFetch
