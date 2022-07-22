<template>
  <div class="app-container">
    <show-pdf :pdf-name="report.pdfName" :pdf-url="srcPdfUrl" />
    <span v-show="report.excellence === '2'" style="display: flex; margin-top: 10px; color: orangered;">已评选为优秀报告</span>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import ShowPdf from '/src/components/ShowPdf/index.vue'
import {
  getFileUrl
} from '@/api/file_url'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    ShowPdf
  },
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      report: {
        pdfName: '',
        pdfUrl: '',
        excellence: '0'
      }, // 报告信息
      srcPdfUrl: '' // 处理后的url
    }
  },
  // 计算属性类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 在实例初始化之后,进行数据侦听和事件/侦听器的配置之前同步调用
  beforeCreate() { },
  // 在实例创建完成后被立即同步调用（可以访问当前this实例）
  created() {
    this.report = this.$route.query
    getFileUrl({ filePath: this.report.pdfUrl }).then((res) => {
      if (res.data.fileUrl) {
        this.srcPdfUrl = res.data.fileUrl
      }
    }).catch(() => { })
  },
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
