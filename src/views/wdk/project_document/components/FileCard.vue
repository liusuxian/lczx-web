<template>
  <el-card style="margin-bottom: 10px;">
    <div style="display: flex; align-items: center;">
      <div class="step_title"><span>{{ stepTitle }}</span></div>
      <div class="step_body">
        <div v-for="(item, index) in stepFileList" :key="index" class="step_body_item">
          <div class="step_body_subitem">
            <span style="color: #606266; margin-left: 10px; margin-right: 20px;">{{ item.stepFileName }}</span>
            <div class="step_body_subitem_file">
              <div v-for="(subitem, subindex) in item.fileList" :key="subindex">
                <span v-if="subitem.id === 0" style="color: orangered; margin-left: 10px; margin-right: 10px;">
                  {{ subitem.fileName }}
                </span>
                <el-button
                  v-else
                  style="margin-left: 10px; margin-right: 10px;"
                  type="text"
                  @click="handleView(subitem)"
                >
                  {{ subitem.fileName }}
                </el-button>
              </div>
            </div>
          </div>
          <upload-file-dialog :step-file="item" :project="project" @upStepFiles="upStepFiles" />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import UploadFileDialog from './UploadFileDialog'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    UploadFileDialog
  },
  // 属性
  props: {
    stepTitle: {
      type: String,
      default: ''
    }, // 阶段标题
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
    // 查看文件
    handleView(item) {
      var tmpCnt = item.fileName.lastIndexOf('.')
      var name = item.fileName.substring(0, tmpCnt)
      this.$router.push({
        name: 'WdkDocumentPage',
        query: {
          pdfName: name,
          pdfUrl: item.pdfFileUrl
        }
      })
    },
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
  margin-right: 40px;
}

.step_body {
  display: flex;
  flex-direction: column;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.step_body_item {
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

.step_body_subitem {
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-right: 40px;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
}

.step_body_subitem_file {
  display: flex;
  flex-direction: column;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
