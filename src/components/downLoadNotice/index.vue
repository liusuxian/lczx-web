<template>
  <div class="app-container" />
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { mapState } from 'vuex'

export default {
  name: 'DownLoadNotice',
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      notify: {} // 用来维护下载文件进度弹框对象
    }
  },
  // 计算属性类似于data概念
  computed: {
    ...mapState({
      'progressList': state => state.download.progressList
    })
  },
  // 监控data中的数据变化
  watch: {
    // 监听进度列表
    progressList: {
      handler(n) {
        const data = JSON.parse(JSON.stringify(n))
        data.forEach(item => {
          const domList = [...document.getElementsByClassName(item.path)]
          if (domList.find(i => i.className === item.path)) {
            // 如果页面已经有该进度对象的弹框，则更新它的进度progress
            domList.find(i => i.className === item.path).innerHTML = item.progress + '%'
          } else {
            if (item.progress === null) {
              // 此处容错处理，如果后端传输文件流报错，删除当前进度对象
              this.$store.dispatch('download/delProgress', item.path)
              return
            }
            // 如果页面中没有该进度对象所对应的弹框，页面新建弹框，并在notify中加入该弹框对象，属性名为该进度对象的path(上文可知path是唯一的)，属性值为$notify(element ui中的通知组件)弹框对象
            this.notify[item.path] = this.$notify({
              title: item.fileName,
              dangerouslyUseHTMLString: true,
              message: `<p style="width: 100px;">正在下载<span class="${item.path}" style="float: right">${item.progress}%</span></p>`, // 显示下载百分比，类名为进度对象的path(便于后面更新进度百分比)
              showClose: false,
              duration: 0
            })
          }

          if (item.progress === 100) {
            // 如果下载进度到了100%，关闭该弹框，并删除notify中维护的弹框对象
            this.notify[item.path].close()
            // delete this.notify[item.path] 上面的close()事件是异步的，这里直接删除会报错，利用setTimeout，将该操作加入异步队列
            setTimeout(() => {
              delete this.notify[item.path]
            }, 1000)
            // 删除download中state的progressList中的进度对象
            this.$store.dispatch('download/delProgress', item.path)
          }
        })
      },
      deep: true
    }
  },
  // 在实例初始化之后,进行数据侦听和事件/侦听器的配置之前同步调用
  beforeCreate() { },
  // 在实例创建完成后被立即同步调用（可以访问当前this实例）
  created() { },
  // 在挂载开始之前被调用
  beforeMount() { },
  // 实例被挂载后调用（可以访问DOM元素）
  mounted() { },
  // 在数据发生改变后，DOM被更新之前被调用
  beforeUpdate() { },
  // 在数据更改导致的虚拟DOM重新渲染和更新完毕之后被调用
  updated() { },
  // 被keep-alive缓存的组件激活时调用
  activated() { },
  // 被keep-alive缓存的组件失活时调用
  deactivated() { },
  // 实例销毁之前调用
  beforeDestroy() { },
  // 实例销毁后调用
  destroyed() { },
  // 在捕获一个来自后代组件的错误时被调用
  errorCaptured() { },
  // ⽅法集合
  methods: {}
}
</script>

<style lang='scss' scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
