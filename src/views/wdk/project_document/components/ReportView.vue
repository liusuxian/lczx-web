<template>
  <div class="report_view">
    <span class="title">咨询报告</span>
    <div class="report_body">
      <div style="display: flex; flex-direction: column;">
        <div v-for="(item, index) in stepReportList" :key="index" class="report_item">
          <div class="report_subitem">
            <span style="color: #606266; margin-left: 10px; margin-right: 20px;">{{ item.typeName }}</span>
            <div class="report_subitem_file">
              <div v-for="(subitem, subindex) in item.reportList" :key="subindex">
                <el-checkbox
                  v-show="subitem.id !== 0"
                  style="margin-left: 5px;"
                  :true-label="subitem.id"
                  :false-label="-subitem.id"
                  @change="handleCheckChange"
                >
                  {{ subitem.id }}
                </el-checkbox>
                <span v-if="subitem.id === 0" style="color: orangered; margin-left: 10px; margin-right: 10px;">
                  {{ subitem.reportName }}
                </span>
                <el-button
                  v-else
                  style="margin-left: 10px; margin-right: 10px;"
                  type="text"
                  @click="handleView(subitem)"
                >
                  {{ subitem.reportName }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-right: 10px;">
        <el-button
          style="margin-right: 10px;"
          type="submit"
          icon="el-icon-upload"
          size="small"
          @click.native.prevent="handleUpload"
        >
          上传
        </el-button>
        <el-button
          :disabled="delReportBtnDisabled"
          type="danger"
          size="small"
          icon="el-icon-delete"
          @click="handleDelete"
        >删除</el-button>
      </div>

      <el-dialog :visible.sync="dialogVisible" title="报告上传" :close-on-click-modal="false" width="570px">
        <el-form ref="report" :disabled="disabled" :model="report" :rules="reportRules" label-position="left">
          <el-form-item label="报告文件" prop="fileList" label-width="80px">
            <el-upload
              action=""
              multiple
              accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :before-upload="beforeUpload"
              :before-remove="handleBeforeRemove"
              :file-list="report.fileList"
              :http-request="handleCustomUpload"
              :limit="limit"
              :on-exceed="handleExceed"
            >
              <el-button slot="trigger" icon="el-icon-upload" size="small">选取文件</el-button>
              <div v-if="limit > 1" slot="tip" class="el-upload__tip">只能上传
                {{ limit }}个doc/docx/xls/xlsx/ppt/pptx/pdf文件，且单个文件不超过900MB</div>
              <div v-else slot="tip" class="el-upload__tip">只能上传单个doc/docx/xls/xlsx/ppt/pptx/pdf文件，且不超过900MB</div>
            </el-upload>
            <el-progress
              v-show="report.fileList.length > 0"
              style="width: 200px; margin-top: 10px;"
              :percentage="progressPercent"
            />
          </el-form-item>
          <el-form-item label="报告类型" prop="typeInfos" label-width="80px">
            <el-cascader
              v-model="report.typeInfos"
              style="width: 350px;"
              placeholder="请选择报告类型"
              :options="auditUserList"
              :props="{ multiple: true }"
              clearable
            />
          </el-form-item>
          <el-form-item label="项目阶段" prop="step" label-width="80px">
            <el-select v-model="report.step" placeholder="请选择项目阶段" clearable style="width: 350px">
              <el-option v-for="item in stepList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: right;">
          <el-button :disabled="disabled" @click="dialogVisible = false">取消</el-button>
          <el-button :disabled="disabled" type="success" @click="confirm">上传</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  deepClone
} from '@/utils'
import {
  getAllReportTypeCfg
} from '@/api/wdk_report_type_cfg'
import {
  getReportRecord,
  addReport,
  deleteReport
} from '@/api/wdk_report'

const defaultReport = {
  fileList: [],
  typeInfos: [],
  step: null
}
Object.freeze(defaultReport)
Object.freeze(defaultReport.fileList)
Object.freeze(defaultReport.typeInfos)

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
        return callback(new Error('请选择要上传的报告文件'))
      }
    }
    const validateTypeInfos = (rule, value, callback) => {
      if (value.length > 0) {
        callback()
      } else {
        return callback(new Error('报告类型不能为空'))
      }
    }
    // 这⾥存放数据
    return {
      report: deepClone(defaultReport),
      reportRules: {
        fileList: [{
          type: 'array',
          required: true,
          validator: validateFileList
        }],
        typeInfos: [{
          type: 'array',
          required: true,
          validator: validateTypeInfos
        }],
        step: [{
          required: true,
          message: '项目阶段不能为空',
          trigger: 'blur'
        }]
      },
      stepList: [
        {
          value: 3,
          name: '服务中-规划设计'
        },
        {
          value: 4,
          name: '服务中-项目展示区施工'
        },
        {
          value: 5,
          name: '服务中-主体结构工程'
        },
        {
          value: 6,
          name: '服务中-主体安装工程'
        },
        {
          value: 7,
          name: '服务中-装饰装修工程'
        },
        {
          value: 8,
          name: '服务中-景观市政工程'
        },
        {
          value: 9,
          name: '服务中-项目交付验收'
        }
      ],
      limit: 1,
      progressPercent: 0,
      disabled: false,
      dialogVisible: false,
      uploadReportList: [],
      reportTypeCfgList: [],
      stepReportList: [],
      auditUserList: [],
      delReportBtnDisabled: true,
      checkList: []
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
    this.handleGetAllReportTypeCfg()
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
    handleGetAllReportTypeCfg() {
      getAllReportTypeCfg().then((res) => {
        if (res.data.list) {
          this.reportTypeCfgList = res.data.list
        }
        this.handleGetReportRecord()
      })
    },
    // 处理审核人员列表
    handleAuditUserList() {
      this.auditUserList = []
      for (const item of this.reportTypeCfgList) {
        var auditUser = {
          value: item.reportCfg.id,
          label: item.reportCfg.name,
          children: []
        }
        for (const ra of item.reportAuditCfg) {
          auditUser.children.push({
            value: ra.auditUid,
            label: ra.auditName
          })
        }
        this.auditUserList.push(auditUser)
      }
    },
    // 获取文档库上传报告记录
    handleGetReportRecord() {
      getReportRecord({
        projectId: this.project.id
      }).then(res => {
        let list = []
        if (res.data.list) {
          list = res.data.list
        }
        var reportTypeCfgMap = new Map()
        if (this.project.fileUploadStatus !== '2') {
          for (const item of this.reportTypeCfgList) {
            reportTypeCfgMap.set(item.reportCfg.id, item.reportCfg.name)
          }
        } else {
          for (const item of list) {
            for (const rt of item.reportType) {
              reportTypeCfgMap.set(rt.typeId, rt.typeName)
            }
          }
        }
        this.stepReportList = []
        for (const typeId of reportTypeCfgMap.keys()) {
          const typeName = reportTypeCfgMap.get(typeId)
          var reports = this.getStepReport(typeId, typeName, list)
          this.stepReportList.push({
            typeId: typeId,
            typeName: typeName,
            reportList: reports
          })
        }
      })
    },
    getStepReport(typeId, typeName, list) {
      var tmpList = []
      for (const item of list) {
        var index = item.reportType.findIndex(item => item.typeId === typeId)
        if (index !== -1) {
          tmpList.push({
            id: item.report.id,
            reportName: item.report.name,
            originFileUrl: item.report.originUrl,
            pdfFileUrl: item.report.pdfUrl,
            excellence: item.report.excellence
          })
        }
      }
      if (tmpList.length > 0) {
        return tmpList
      }
      return [{
        id: 0,
        reportName: '未上传',
        originFileUrl: '',
        pdfFileUrl: '',
        excellence: 0
      }]
    },
    handleView(item) {
      var tmpCnt = item.reportName.lastIndexOf('.')
      var name = item.reportName.substring(0, tmpCnt)
      this.$router.push({
        name: 'WdkReportPage',
        query: {
          pdfName: name,
          pdfUrl: item.pdfFileUrl,
          excellence: item.excellence + ''
        }
      })
    },
    // 文件状态改变
    handleChange(file, fileList) {
      this.report.fileList = fileList
      // 手动触发校验
      this.$refs.report.validate(valid => {
        if (!valid) {
          return false
        }
      })
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.size > 838860800) {
        this.report = deepClone(defaultReport)
        this.uploadReportList = []
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
      this.report.fileList = fileList
      // 手动触发校验
      this.$refs.report.validate(valid => {
        if (!valid) {
          return false
        }
      })
      var index = this.uploadReportList.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        this.uploadReportList.splice(index, 1)
      }
    },
    // 上传
    handleUpload() {
      this.report = deepClone(defaultReport)
      this.handleAuditUserList()
      this.uploadReportList = []
      this.dialogVisible = true
    },
    // 自定义上传
    handleCustomUpload(raw) {
      this.uploadReportList.push(raw.file)
    },
    // 上传确认
    async confirm() {
      this.$refs.report.validate(valid => {
        if (valid) {
          this.disabled = true
          var fData = new FormData()
          fData.append('projectId', this.project.id)
          fData.append('projectName', this.project.name)
          fData.append('step', this.report.step)
          var auditTypeInfos = []
          for (const item of this.report.typeInfos) {
            var typeId = item[0]
            var index = auditTypeInfos.findIndex(item => item.typeId === typeId)
            if (index !== -1) {
              auditTypeInfos[index].auditUids.push(item[1])
            } else {
              auditTypeInfos.push({
                typeId: typeId,
                auditUids: [item[1]]
              })
            }
          }
          fData.append('auditTypeInfos', JSON.stringify(auditTypeInfos))
          this.uploadReportList.forEach(function(file) {
            fData.append('uploadReport', file)
          })
          // 进度条
          const uploadProgressEvent = progressEvent => {
            this.progressPercent = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          }
          addReport(fData, uploadProgressEvent).then((res) => {
            if (res.code === 0) {
              this.handleGetReportRecord()
              this.$message({
                type: 'success',
                message: '上传成功!'
              })
            }
            this.report = deepClone(defaultReport)
            this.uploadReportList = []
            this.dialogVisible = false
            this.progressPercent = 0
            this.disabled = false
          }).catch(() => {
            this.report = deepClone(defaultReport)
            this.uploadReportList = []
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
    },
    // 选择报告
    handleCheckChange(val) {
      if (val > 0) {
        this.checkList.push(val)
      } else {
        var index = this.checkList.findIndex(item => item === Math.abs(val))
        if (index !== -1) {
          this.checkList.splice(index, 1)
        }
      }
      if (this.checkList.length > 0) {
        this.delReportBtnDisabled = false
      } else {
        this.delReportBtnDisabled = true
      }
    },
    // 删除报告
    handleDelete() {
      this.$confirm('是否确认删除报告ID为"' + this.checkList.join(',') + '"的数据项?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteReport({
          ids: this.checkList
        }).then(() => {
          this.checkList = []
          this.delReportBtnDisabled = true
          this.handleGetReportRecord()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.checkList = []
          this.delReportBtnDisabled = true
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        })
      }).catch(() => { })
    }
  }
}
</script>

<style lang='scss' scoped>
.report_view {
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

.report_body {
  display: flex;
  align-items: center;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.report_item {
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

.report_subitem {
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-right: 40px;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
}

.report_subitem_file {
  display: flex;
  flex-direction: column;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
