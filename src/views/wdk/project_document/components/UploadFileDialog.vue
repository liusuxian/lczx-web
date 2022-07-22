<template>
  <div class="upload_dialog">
    <el-button
      style="margin-right: 10px;"
      type="submit"
      icon="el-icon-upload"
      size="small"
      @click.native.prevent="handleUpload"
    >上传</el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="stepFile.stepFileName + '上传'"
      :close-on-click-modal="false"
      width="570px"
    >
      <el-form ref="file" :disabled="disabled" :model="file" :rules="fileRules" label-position="left">
        <el-form-item label="项目文件" prop="fileList" label-width="80px">
          <el-upload
            action=""
            multiple
            accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :before-remove="handleBeforeRemove"
            :file-list="file.fileList"
            :http-request="handleCustomUpload"
            :limit="stepFile.limit"
            :on-exceed="handleExceed"
          >
            <el-button slot="trigger" icon="el-icon-upload" size="small">选取文件</el-button>
            <div v-if="stepFile.limit > 1" slot="tip" class="el-upload__tip">只能上传{{ stepFile.limit }}个
              doc/docx/xls/xlsx/ppt/pptx/pdf文件，且单个文件不超过900MB</div>
            <div v-else slot="tip" class="el-upload__tip">只能上传单个doc/docx/xls/xlsx/ppt/pptx/pdf文件，且不超过900MB</div>
          </el-upload>
          <el-progress
            v-show="file.fileList.length > 0"
            style="width: 200px; margin-top: 10px;"
            :percentage="progressPercent"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button :disabled="disabled" @click="dialogVisible = false">取消</el-button>
        <el-button :disabled="disabled" type="success" @click="confirm">上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  deepClone
} from '@/utils'
import {
  addFile
} from '@/api/wdk_file'

const defaultFile = {
  fileList: []
}
Object.freeze(defaultFile)
Object.freeze(defaultFile.fileList)

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {
    stepFile: {
      type: Object,
      default: () => {
        return {
          type: 0,
          limit: 1,
          stepFileName: '',
          fileList: []
        }
      } // es6的箭头函数
    },
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
    const validateFileList = (rule, value, callback) => {
      if (value.length > 0) {
        callback()
      } else {
        return callback(new Error('请选择要上传的项目文件'))
      }
    }
    // 这⾥存放数据
    return {
      file: deepClone(defaultFile),
      fileRules: {
        fileList: [{
          type: 'array',
          required: true,
          validator: validateFileList
        }]
      },
      progressPercent: 0,
      disabled: false,
      dialogVisible: false,
      uploadFileList: []
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
    // 文件状态改变
    handleChange(file, fileList) {
      this.file.fileList = fileList
      // 手动触发校验
      this.$refs.file.validate(valid => {
        if (!valid) {
          return false
        }
      })
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.size > 838860800) {
        this.file.fileList = []
        this.uploadFileList = []
        this.dialogVisible = false
        this.progressPercent = 0
        this.disabled = false
        this.$message({
          type: 'error',
          message: '文件大小超出限制!!!!'
        })
      }
    },
    // 删除文件之前
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 删除文件
    handleRemove(file, fileList) {
      this.file.fileList = fileList
      // 手动触发校验
      this.$refs.file.validate(valid => {
        if (!valid) {
          return false
        }
      })
      var index = this.uploadFileList.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        this.uploadFileList.splice(index, 1)
      }
    },
    // 上传
    handleUpload() {
      this.file = deepClone(defaultFile)
      this.uploadFileList = []
      this.dialogVisible = true
    },
    // 自定义上传
    handleCustomUpload(raw) {
      this.uploadFileList.push(raw.file)
    },
    // 上传确认
    async confirm() {
      this.$refs.file.validate(valid => {
        if (valid) {
          this.disabled = true
          var fData = new FormData()
          fData.append('projectId', this.project.id)
          fData.append('type', this.stepFile.type)
          if (this.uploadFileList.length > 1) {
            this.uploadFileList.forEach(function(file) {
              fData.append('uploadFiles', file)
            })
          } else {
            this.uploadFileList.forEach(function(file) {
              fData.append('uploadFile', file)
            })
          }
          // 进度条
          const uploadProgressEvent = progressEvent => {
            this.progressPercent = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          }
          addFile(fData, uploadProgressEvent).then((res) => {
            if (res.code === 0) {
              // 通知父组件更新
              this.$emit('upStepFiles')
              this.$message({
                type: 'success',
                message: '上传成功!'
              })
            }
            this.file.fileList = []
            this.uploadFileList = []
            this.dialogVisible = false
            this.progressPercent = 0
            this.disabled = false
          }).catch(() => {
            this.file.fileList = []
            this.uploadFileList = []
            this.dialogVisible = false
            this.progressPercent = 0
            this.disabled = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 文件超出个数限制
    handleExceed(files, fileList) {
      this.$message({
        type: 'error',
        message: '文件超出个数限制!!!'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
