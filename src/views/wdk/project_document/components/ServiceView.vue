<template>
  <div class="service_view">
    <span class="title">服务记录</span>
    <div class="service_body">
      <div class="service_table_body">
        <div class="service_table">
          <div style="margin-top: 10px; margin-bottom: 10px;">
            <el-button
              style="margin-right: 10px;"
              type="submit"
              icon="el-icon-upload"
              size="small"
              @click.native.prevent="handleUpload"
            >添加</el-button>
            <el-button
              :disabled="delServiceBtnDisabled"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(multipleSelection)"
            >删除</el-button>
          </div>
          <el-table tooltip-effect="light" border :data="serviceList" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="50" />
            <el-table-column align="center" label="记录ID" width="70">
              <template slot-scope="scope">
                {{ scope.row.record.id }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="服务时间" width="100">
              <template slot-scope="scope">
                {{ scope.row.record.serviceTime.split(' ')[0] }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="照片" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div v-for="(item, index) in scope.row.photo" :key="index">
                    <el-popover placement="top-start" width="300" trigger="hover">
                      <el-image :src="item.url" fit="scale-down" :preview-src-list="[item.url]" />
                      <el-button slot="reference" type="text">{{ item.name }}</el-button>
                    </el-popover>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="行程函" :show-overflow-tooltip="true" width="300">
              <template slot-scope="scope">
                <el-button type="text" @click="handleXchFileView(scope.row.record)">
                  {{ scope.row.record.xchName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注" width="200">
              <template slot-scope="scope">
                <div style="display: flex; justify-content: center; align-items: center">
                  {{ scope.row.record.remark }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-dialog :visible.sync="dialogVisible" title="添加服务记录" :close-on-click-modal="false" width="570px">
          <el-form ref="service" :disabled="disabled" :model="service" :rules="serviceRules" label-position="left">
            <el-form-item label="服务时间" prop="serviceTime" label-width="80px">
              <el-date-picker v-model="service.serviceTime" type="date" placeholder="请选择服务时间" />
            </el-form-item>
            <el-form-item label="行程函" prop="xchFileList" label-width="80px">
              <el-upload
                action=""
                multiple
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                :on-remove="handleRemoveXchFile"
                :on-change="handleXchFileChange"
                :before-upload="beforeUpload"
                :before-remove="handleBeforeRemove"
                :file-list="service.xchFileList"
                :http-request="handleCustomUploadXchFile"
                :limit="1"
                :on-exceed="handleExceed"
              >
                <el-button slot="trigger" icon="el-icon-upload" size="small">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传单个doc/docx/xls/xlsx/ppt/pptx/pdf文件，且单个文件不超过900MB</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="照片" prop="photoList" label-width="80px">
              <el-upload
                action=""
                multiple
                accept=".jpg,.jpeg,.png,.gif"
                :on-remove="handleRemovePhoto"
                :on-change="handlePhotoChange"
                :before-upload="beforeUpload"
                :before-remove="handleBeforeRemove"
                list-type="picture"
                :file-list="service.photoList"
                :http-request="handleCustomUploadPhoto"
                :limit="8"
                :on-exceed="handleExceed"
              >
                <el-button slot="trigger" icon="el-icon-upload" size="small">选取照片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传8张jpg/jpeg/png照片，且单张照片不超过900MB</div>
              </el-upload>
            </el-form-item>
            <el-form-item style="margin-left: 10px;" label-width="70px">
              <el-progress
                v-show="service.xchFileList.length > 0 && service.photoList.length > 0"
                style="width: 200px; margin-top: 10px;"
                :percentage="progressPercent"
              />
            </el-form-item>
            <el-form-item style="margin-left: 10px;" label="备注" prop="remark" label-width="70px">
              <el-input
                v-model="service.remark"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-form>
          <div style="text-align: right;">
            <el-button :disabled="disabled" @click="dialogVisible = false">取消</el-button>
            <el-button :disabled="disabled" type="success" @click="confirm">上传</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="service_file_body">
        <div v-for="(item, index) in stepFileList" :key="index" class="service_file_item">
          <div class="service_file_subitem">
            <span style="color: #606266; margin-left: 10px; margin-right: 20px;">{{ item.stepFileName }}</span>
            <div class="service_file_subitem_file">
              <div v-for="(subitem, subindex) in item.fileList" :key="subindex">
                <span v-if="subitem.id === 0" style="color: orangered; margin-left: 10px; margin-right: 10px;">
                  {{ subitem.fileName }}
                </span>
                <el-button
                  v-else
                  style="margin-left: 10px; margin-right: 10px;"
                  type="text"
                  @click="handleFileView(subitem)"
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
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import UploadFileDialog from './UploadFileDialog'
import {
  deepClone
} from '@/utils'
import {
  formatDate
} from '@/utils/time'
import {
  getServiceRecord,
  addService,
  deleteService
} from '@/api/wdk_service'

const defaultService = {
  xchFileList: [],
  photoList: [],
  serviceTime: '',
  remark: ''
}
Object.freeze(defaultService)
Object.freeze(defaultService.xchFileList)
Object.freeze(defaultService.photoList)

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    UploadFileDialog
  },
  // 属性
  props: {
    project: {
      type: Object,
      default: () => {
        return {
          id: 0,
          name: '',
          fileUploadStatus: '0'
        }
      }
    },
    stepFileList: {
      type: Array,
      default: () => [] // es6的箭头函数
    } // 阶段文件信息
  },
  // 数据
  data() {
    const validateXchFileList = (rule, value, callback) => {
      if (value.length > 0) {
        callback()
      } else {
        return callback(new Error('请选择要上传的附件文件'))
      }
    }
    const validatePhotoList = (rule, value, callback) => {
      if (value.length > 0) {
        callback()
      } else {
        return callback(new Error('请选择要上传的照片'))
      }
    }
    // 这⾥存放数据
    return {
      serviceList: [],
      service: deepClone(defaultService),
      serviceRules: {
        xchFileList: [{
          type: 'array',
          required: true,
          validator: validateXchFileList
        }],
        photoList: [{
          type: 'array',
          required: true,
          validator: validatePhotoList
        }],
        serviceTime: [{
          required: true,
          message: '服务时间不能为空',
          trigger: 'blur'
        }]
      },
      progressPercent: 0,
      disabled: false,
      dialogVisible: false,
      uploadXchFileList: [],
      uploadPhotoList: [],
      multipleSelection: [],
      delServiceBtnDisabled: true
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
    this.handleGetServiceRecord()
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
    // 获取服务记录
    handleGetServiceRecord() {
      getServiceRecord({
        projectId: this.project.id
      }).then((res) => {
        if (res.data.list) {
          this.serviceList = res.data.list
        } else {
          this.serviceList = []
        }
      }).catch(() => { })
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delServiceBtnDisabled = false
      } else {
        this.delServiceBtnDisabled = true
      }
    },
    // 行程函文件状态改变
    handleXchFileChange(file, fileList) {
      this.service.xchFileList = fileList
      // 手动触发校验
      this.$refs.service.validate(valid => {
        if (!valid) {
          return false
        }
      })
    },
    // 照片文件状态改变
    handlePhotoChange(file, fileList) {
      this.service.photoList = fileList
      // 手动触发校验
      this.$refs.service.validate(valid => {
        if (!valid) {
          return false
        }
      })
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.size > 838860800) {
        this.service.xchFileList = []
        this.service.photoList = []
        this.uploadXchFileList = []
        this.uploadPhotoList = []
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
    // 删除行程函文件
    handleRemoveXchFile(file, fileList) {
      this.service.xchFileList = fileList
      // 手动触发校验
      this.$refs.service.validate(valid => {
        if (!valid) {
          return false
        }
      })
      var index = this.uploadXchFileList.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        this.uploadXchFileList.splice(index, 1)
      }
    },
    // 删除照片文件
    handleRemovePhoto(file, fileList) {
      this.service.photoList = fileList
      // 手动触发校验
      this.$refs.service.validate(valid => {
        if (!valid) {
          return false
        }
      })
      var index = this.uploadPhotoList.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        this.uploadPhotoList.splice(index, 1)
      }
    },
    // 上传
    handleUpload() {
      this.service = deepClone(defaultService)
      this.uploadXchFileList = []
      this.uploadPhotoList = []
      this.dialogVisible = true
    },
    // 自定义上传行程函文件
    handleCustomUploadXchFile(raw) {
      this.uploadXchFileList.push(raw.file)
    },
    // 自定义上传照片文件
    handleCustomUploadPhoto(raw) {
      this.uploadPhotoList.push(raw.file)
    },
    // 上传确认
    async confirm() {
      this.$refs.service.validate(valid => {
        if (valid) {
          this.disabled = true
          var fData = new FormData()
          fData.append('projectId', this.project.id)
          fData.append('serviceTime', formatDate(this.service.serviceTime))
          fData.append('remark', this.service.remark)
          this.uploadXchFileList.forEach(function(file) {
            fData.append('uploadXchFile', file)
          })
          if (this.uploadPhotoList.length > 1) {
            this.uploadPhotoList.forEach(function(file) {
              fData.append('uploadPhotos', file)
            })
          } else {
            this.uploadPhotoList.forEach(function(file) {
              fData.append('uploadPhoto', file)
            })
          }
          // 进度条
          const uploadProgressEvent = progressEvent => {
            this.progressPercent = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          }
          addService(fData, uploadProgressEvent).then((res) => {
            if (res.code === 0) {
              this.handleGetServiceRecord()
              this.$message({
                type: 'success',
                message: '上传成功!'
              })
            }
            this.service.xchFileList = []
            this.service.photoList = []
            this.uploadXchFileList = []
            this.uploadPhotoList = []
            this.dialogVisible = false
            this.progressPercent = 0
            this.disabled = false
          }).catch(() => {
            this.service.xchFileList = []
            this.service.photoList = []
            this.uploadXchFileList = []
            this.uploadPhotoList = []
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
    handleDelete(rowList) {
      var idList = []
      for (const item of rowList) {
        idList.push(item.record.id)
      }
      this.$confirm('是否确认删除服务记录ID为"' + idList.join(',') + '"的数据项?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteService({
          ids: idList
        }).then(() => {
          for (const id of idList) {
            var index = this.serviceList.findIndex(item => item.record.id === id)
            if (index !== -1) {
              this.serviceList.splice(index, 1)
            }
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => { })
      }).catch(() => { })
    },
    // 文件超出个数限制
    handleExceed(files, fileList) {
      this.$message({
        type: 'error',
        message: '文件超出个数限制!!!'
      })
    },
    // 查看文件
    handleFileView(item) {
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
    // 查看行程函文件
    handleXchFileView(item) {
      var tmpCnt = item.xchName.lastIndexOf('.')
      var name = item.xchName.substring(0, tmpCnt)
      this.$router.push({
        name: 'WdkDocumentPage',
        query: {
          pdfName: name,
          pdfUrl: item.xchPdfUrl
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
.service_view {
  display: flex;
  align-items: center;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  display: flex;
  width: 32px;
  height: 80px;
  justify-content: center;
  align-items: center;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
  margin-right: 20px;
  padding-left: 10px;
  padding-right: 10px;
}

.service_body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.service_table_body {
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.service_table {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.service_file_body {
  display: flex;
  flex-direction: column;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
}

.service_file_item {
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

.service_file_subitem {
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-right: 40px;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
}

.service_file_subitem_file {
  display: flex;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
