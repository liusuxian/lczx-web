import qs from 'qs'
const interceptors_req = []
const interceptors_res = []

/**
 * myFetch
 * @param {RequestInfo | URL} input
 * @param {RequestInit} init
 * @returns {Promise < Response >}
 */
export function myFetch(input, init = {}) {
  // 处理input
  if (!(/^(https?:|http?:)/.test(input))) {
    input = process.env.VUE_APP_BASE_API + input
  }
  console.log('myFetch input: ', input)
  // fetch默认请求方式设为GET
  if (!init.method) {
    init.method = 'GET'
  }
  // fetch默认请求的模式为跨域
  if (!init.mode) {
    init.mode = 'cors'
  }
  // fetch默认无缓存
  if (!init.cache) {
    init.cache = 'no-cache'
  }
  // 处理GET参数
  if (init.method === 'GET' && init.body) {
    let dataStr = ''
    Object.keys(init.body).forEach((key) => {
      const value = init.body[key]
      if (Array.isArray(value)) {
        if (value.length > 0) {
          dataStr += qs.stringify({
            key: value
          }, {
            arrayFormat: 'indices'
          }) + '&'
        }
      } else if (value) {
        dataStr += key + '=' + value + '&'
      }
    })
    // 删除body
    delete init.body
    // 拼接参数
    if (dataStr !== '') {
      dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
      input = input + '?' + dataStr
    }
  }

  // interceptors_req是拦截请求的拦截处理函数集合
  interceptors_req.forEach(interceptors => {
    init = interceptors(init)
  })

  // 在原生fetch外面封装一个promise，为了在promise里面可以对fetch请求的结果做拦截处理
  // 同时，保证myFetch函数返回的结果是个promise对象
  return new Promise(function(resolve, reject) {
    // 发起fetch请求，fetch请求的形参是接收上层函数的形参
    fetch(input, init).then((res) => {
      // interceptors_res是拦截响应结果的拦截处理函数集合
      interceptors_res.forEach(interceptors => {
        // 拦截器对响应结果做处理，把处理后的结果返回给响应结果。
        res = interceptors(res)
      })
      // 将拦截器处理后的响应结果resolve出去
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

// 在myFetch函数上面增加拦截器interceptors，拦截器提供request和response两种拦截器功能
// 可以通过request和response的use方法来绑定两种拦截器的处理函数
// use方法接收一个参数，参数为一个callback函数，callback函数用来作为拦截器的处理函数
// request.use方法会把callback放在interceptors_req中，等待执行
// response.use方法会把callback放在interceptors_res中，等待执行
// 拦截器的处理函数callback接收一个参数
// request拦截器的callback接收的是请求发起前的config
// response拦截器的callback接收的是网络请求的response结果
myFetch.interceptors = {
  request: {
    use: function(callback) {
      interceptors_req.push(callback)
    }
  },
  response: {
    use: function(callback) {
      interceptors_res.push(callback)
    }
  }
}
