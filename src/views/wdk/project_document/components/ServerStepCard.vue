<template>
  <el-card style="margin-bottom: 10px;">
    <div style="display: flex; align-items: center;">
      <div style="margin-right: 40px;">
        <div v-for="(item, index) in stepTitleList" :key="index" class="step_title">
          <span>{{ item }}</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-start;">
        <report-view style="margin-bottom: 20px;" :project="project" />
        <service-view :project="project" :step-file-list="stepFileList" @upStepFiles="upStepFiles" />
      </div>
    </div>
  </el-card>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import ReportView from './ReportView'
import ServiceView from './ServiceView'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    ReportView,
    ServiceView
  },
  // 属性
  props: {
    stepTitleList: {
      type: Array,
      default: () => [] // es6的箭头函数
    }, // 阶段标题信息
    stepFileList: {
      type: Array,
      default: () => [] // es6的箭头函数
    }, // 阶段文件信息
    project: {
      type: Object,
      default: () => {
        return {
          id: 0,
          name: '',
          fileUploadStatus: '0'
        }
      }
    }
  },
  // 数据
  data() {
    // 这⾥存放数据
    return {
    }
  },
  // 计算属性类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
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
  methods: {
    // 通知父组件更新
    upStepFiles() {
      this.$emit('upStepFiles')
    }
  }
}
</script>

<style lang='scss' scoped>
.step_title {
  display: flex;
  width: 100px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: green;
  color: white;
  font-size: 14px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
