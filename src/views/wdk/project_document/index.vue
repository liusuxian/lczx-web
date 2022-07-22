<template>
  <div class="app-container">
    <h1>{{ project.name }}</h1>
    <file-card step-title="合同签约" :step-file-list="step1Files" :project="project" @upStepFiles="handleGetFileRecord" />
    <file-card step-title="项目启动会" :step-file-list="step2Files" :project="project" @upStepFiles="handleGetFileRecord" />
    <server-step-card
      :step-title-list="['首次专业服务', '阶段性服务']"
      :step-file-list="step3Files"
      :project="project"
      @upStepFiles="handleGetFileRecord"
    />
    <file-card step-title="合同结束" :step-file-list="step4Files" :project="project" @upStepFiles="handleGetFileRecord" />
    <file-card step-title="复盘" :step-file-list="step5Files" :project="project" @upStepFiles="handleGetFileRecord" />
    <attachment-card :project="project" />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import FileCard from './components/FileCard'
import ServerStepCard from './components/ServerStepCard'
import AttachmentCard from './components/AttachmentCard'
import {
  deepClone
} from '@/utils'
import {
  getProject
} from '@/api/wdk_project'
import {
  getFileRecord
} from '@/api/wdk_file'

const defaultStepFiles = [
  [
    {
      type: 0,
      limit: 1,
      stepFileName: '合同扫描文件',
      fileList: []
    }
  ], // 1:合同签约
  [
    {
      type: 1,
      limit: 1,
      stepFileName: '年度服务计划书',
      fileList: []
    }
  ], // 2:项目启动会
  [
    {
      type: 5,
      limit: 1,
      stepFileName: '文件签收单',
      fileList: []
    },
    {
      type: 6,
      limit: 1,
      stepFileName: '满意度调查表',
      fileList: []
    }
  ], // 3:服务中
  [
    {
      type: 2,
      limit: 1,
      stepFileName: '总结报告',
      fileList: []
    },
    {
      type: 3,
      limit: 8,
      stepFileName: '项目移交',
      fileList: []
    }
  ], // 4:合同结束
  [
    {
      type: 4,
      limit: 1,
      stepFileName: '复盘报告',
      fileList: []
    }
  ] // 5:复盘
]
Object.freeze(defaultStepFiles)

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    FileCard,
    ServerStepCard,
    AttachmentCard
  },
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      project: {
        id: 0,
        name: '',
        fileUploadStatus: '0'
      },
      reportTypeCfgList: [],
      stepFiles: deepClone(defaultStepFiles)
    }
  },
  // 计算属性类似于data概念
  computed: {
    // 1:合同签约
    step1Files() {
      return this.stepFiles[0]
    },
    // 2:项目启动会
    step2Files() {
      return this.stepFiles[1]
    },
    // 3:服务中
    step3Files() {
      return this.stepFiles[2]
    },
    // 4:合同结束
    step4Files() {
      return this.stepFiles[3]
    },
    // 5:复盘
    step5Files() {
      return this.stepFiles[4]
    }
  },
  // 监控data中的数据变化
  watch: {},
  // 在实例初始化之后,进行数据侦听和事件/侦听器的配置之前同步调用
  beforeCreate() { },
  // 在实例创建完成后被立即同步调用（可以访问当前this实例）
  created() {
    this.project.id = this.$route.query.id
    this.handleGetProject()
    this.handleGetFileRecord()
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
  methods: {
    // 获取项目信息
    handleGetProject() {
      getProject({
        id: this.project.id
      }).then((res) => {
        var data = res.data.info.projectInfo
        if (data) {
          this.project.id = data.id
          this.project.name = data.name
          this.project.fileUploadStatus = data.fileUploadStatus + ''
        }
      }).catch(() => { })
    },
    // 获取文档库上传文件记录
    handleGetFileRecord() {
      this.stepFiles = deepClone(defaultStepFiles)
      getFileRecord({
        projectId: this.project.id
      }).then(res => {
        var list = []
        if (res.data.list) {
          list = res.data.list
        }
        for (const items of this.stepFiles) {
          for (const item of items) {
            var files = list.filter((i) => {
              return item.type === i.type
            })
            for (const file of files) {
              item.fileList.push({
                id: file.id,
                fileName: file.name,
                originFileUrl: file.originUrl,
                pdfFileUrl: file.pdfUrl
              })
            }
            if (item.fileList.length === 0) {
              item.fileList.push({
                id: 0,
                fileName: '未上传',
                originFileUrl: '',
                pdfFileUrl: ''
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
