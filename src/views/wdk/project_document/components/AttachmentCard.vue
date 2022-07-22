<template>
  <el-card style="margin-bottom: 10px;">
    <div style="display: flex; align-items: center;">
      <div class="attachment_title"><span>附件</span></div>
      <div class="attachment_body">
        <span class="title">附件上传记录</span>
        <div class="attachment_sub_body">
          <div class="attachment_table">
            <div style="margin-top: 10px; margin-bottom: 10px;">
              <el-button
                style="margin-right: 10px;"
                type="submit"
                icon="el-icon-upload"
                size="small"
                @click.native.prevent="handleUpload"
              >上传</el-button>
              <el-button
                :disabled="delAttachmentBtnDisabled"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelete(multipleSelection)"
              >删除</el-button>
            </div>
            <el-table tooltip-effect="light" border :data="attachmentList" @selection-change="handleSelectionChange">
              <el-table-column align="center" type="selection" width="50" />
              <el-table-column align="center" label="记录ID" width="70">
                <template slot-scope="scope">
                  {{ scope.row.record.id }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="上传时间" width="160">
                <template slot-scope="scope">
                  {{ scope.row.record.createdAt }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="附件" width="300" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <div v-for="(item, index) in scope.row.attachment" :key="index">
                      <el-button type="text" @click="handleView(item)">
                        {{ item.name }}
                      </el-button>
                    </div>
                  </div>
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

          <el-dialog :visible.sync="dialogVisible" title="附件上传" :close-on-click-modal="false" width="570px">
            <el-form
              ref="attachment"
              :disabled="disabled"
              :model="attachment"
              :rules="attachmentRules"
              label-position="left"
            >
              <el-form-item label="附件文件" prop="fileList" label-width="80px">
                <el-upload
                  action=""
                  multiple
                  accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                  :on-remove="handleRemove"
                  :on-change="handleChange"
                  :before-upload="beforeUpload"
                  :before-remove="handleBeforeRemove"
                  :file-list="attachment.fileList"
                  :http-request="handleCustomUpload"
                  :limit="8"
                  :on-exceed="handleExceed"
                >
                  <el-button slot="trigger" icon="el-icon-upload" size="small">选取文件</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传8个doc/docx/xls/xlsx/ppt/pptx/pdf文件，且单个文件不超过900MB</div>
                </el-upload>
                <el-progress
                  v-show="attachment.fileList.length > 0"
                  style="width: 200px; margin-top: 10px;"
                  :percentage="progressPercent"
                />
              </el-form-item>
              <el-form-item style="margin-left: 10px;" label="备注" prop="remark" label-width="70px">
                <el-input
                  v-model="attachment.remark"
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
      </div>
    </div>
  </el-card>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  deepClone
} from '@/utils'
import {
  getAttachmentRecord,
  addAttachment,
  deleteAttachment
} from '@/api/wdk_attachment'

const defaultAttachment = {
  fileList: [],
  remark: ''
}
Object.freeze(defaultAttachment)
Object.freeze(defaultAttachment.fileList)

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
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
    }
  },
  // 数据
  data() {
    const validateFileList = (rule, value, callback) => {
      if (value.length > 0) {
        callback()
      } else {
        return callback(new Error('请选择要上传的附件文件'))
      }
    }
    // 这⾥存放数据
    return {
      attachmentList: [],
      attachment: deepClone(defaultAttachment),
      attachmentRules: {
        fileList: [{
          type: 'array',
          required: true,
          validator: validateFileList
        }]
      },
      progressPercent: 0,
      disabled: false,
      dialogVisible: false,
      uploadFileList: [],
      multipleSelection: [],
      delAttachmentBtnDisabled: true
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
    this.handleGetAttachmentRecord()
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
    // 获取上传附件记录
    handleGetAttachmentRecord() {
      getAttachmentRecord({
        projectId: this.project.id
      }).then((res) => {
        if (res.data.list) {
          this.attachmentList = res.data.list
        } else {
          this.attachmentList = []
        }
      }).catch(() => { })
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delAttachmentBtnDisabled = false
      } else {
        this.delAttachmentBtnDisabled = true
      }
    },
    // 文件状态改变
    handleChange(file, fileList) {
      this.attachment.fileList = fileList
      // 手动触发校验
      this.$refs.attachment.validate(valid => {
        if (!valid) {
          return false
        }
      })
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.size > 838860800) {
        this.attachment.fileList = []
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
      this.attachment.fileList = fileList
      // 手动触发校验
      this.$refs.attachment.validate(valid => {
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
      this.attachment = deepClone(defaultAttachment)
      this.uploadFileList = []
      this.dialogVisible = true
    },
    // 自定义上传
    handleCustomUpload(raw) {
      this.uploadFileList.push(raw.file)
    },
    // 上传确认
    async confirm() {
      this.$refs.attachment.validate(valid => {
        if (valid) {
          this.disabled = true
          var fData = new FormData()
          fData.append('projectId', this.project.id)
          fData.append('remark', this.attachment.remark)
          if (this.uploadFileList.length > 1) {
            this.uploadFileList.forEach(function(file) {
              fData.append('uploadAttachments', file)
            })
          } else {
            this.uploadFileList.forEach(function(file) {
              fData.append('uploadAttachment', file)
            })
          }
          // 进度条
          const uploadProgressEvent = progressEvent => {
            this.progressPercent = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          }
          addAttachment(fData, uploadProgressEvent).then((res) => {
            if (res.code === 0) {
              this.handleGetAttachmentRecord()
              this.$message({
                type: 'success',
                message: '上传成功!'
              })
            }
            this.attachment.fileList = []
            this.uploadFileList = []
            this.dialogVisible = false
            this.progressPercent = 0
            this.disabled = false
          }).catch(() => {
            this.attachment.fileList = []
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
    handleDelete(rowList) {
      var idList = []
      for (const item of rowList) {
        idList.push(item.record.id)
      }
      this.$confirm('是否确认删除附件记录ID为"' + idList.join(',') + '"的数据项?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteAttachment({
          ids: idList
        }).then(() => {
          for (const id of idList) {
            var index = this.attachmentList.findIndex(item => item.record.id === id)
            if (index !== -1) {
              this.attachmentList.splice(index, 1)
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
    // 查看附件
    handleView(item) {
      var tmpCnt = item.name.lastIndexOf('.')
      var name = item.name.substring(0, tmpCnt)
      this.$router.push({
        name: 'WdkDocumentPage',
        query: {
          pdfName: name,
          pdfUrl: item.pdfUrl
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.attachment_title {
  display: flex;
  width: 100px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: #409EFF;
  color: white;
  font-size: 14px;
  font-weight: bold;
  margin-right: 40px;
}

.attachment_body {
  display: flex;
  align-items: center;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  display: flex;
  width: 32px;
  height: 120px;
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

.attachment_sub_body {
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.attachment_table {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
