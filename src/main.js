import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import ContextMenu from 'vue-contextmenujs'
Vue.use(ContextMenu)

import vueDragSelectPro from 'vue-drag-select-pro'
import 'vue-drag-select-pro/lib/vueDragSelectPro.css'
Vue.use(vueDragSelectPro)

// 注册一个全局自定义指令 `v-input-focus`
Vue.directive('input-focus', {
  // 当被绑定的元素插入到 DOM 中时
  inserted: function(el) {
    // 聚焦元素
    el.focus()
  }
})

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
