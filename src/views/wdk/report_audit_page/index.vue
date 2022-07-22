<template>
  <div class="app-container">
    <show-pdf :pdf-name="report.pdfName" :pdf-url="srcPdfUrl" />
    <span v-show="report.excellence === '2'" style="display: flex; margin-top: 10px; color: orangered;">已评选为优秀报告</span>
    <div style="display: flex; justify-content: center; margin-top: 20px;">
      <el-button
        :disabled="report.auditStatus !== '1' || report.rescind === '1'"
        type="danger"
        @click="handleAudit('0', 'not_pass')"
      >
        不通过
      </el-button>
      <el-button
        :disabled="report.auditStatus !== '1' || report.rescind === '1'"
        type="primary"
        @click="handleAudit('2', 'pass')"
      >
        通过
      </el-button>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'not_pass' ? '不通过' : '通过'"
      :close-on-click-modal="false"
      width="570px"
    >
      <el-form ref="reportAudit" :model="reportAudit" label-width="80px" label-position="left">
        <el-form-item label="审核意见" prop="auditOpinion" label-width="80px">
          <el-input
            v-model="reportAudit.auditOpinion"
            :autosize="{ minRows: 5, maxRows: 20 }"
            type="textarea"
            placeholder="请输入审核意见，字数不超过255"
          />
        </el-form-item>
        <el-form-item v-if="dialogType === 'pass'" label="优秀报告推荐" prop="excellence" label-width="100px">
          <el-radio-group v-model="reportAudit.excellence">
            <el-radio label="0">不推荐</el-radio>
            <el-radio label="1">推荐</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import ShowPdf from '/src/components/ShowPdf/index.vue'
import {
  deepClone
} from '@/utils'
import {
  reportAudit
} from '@/api/wdk_report_audit'
import {
  getFileUrl
} from '@/api/file_url'

const defaultReportAudit = {
  id: 0,
  auditStatus: '',
  auditOpinion: '',
  excellence: '0'
}
Object.freeze(defaultReportAudit)

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
        reportId: 0,
        auditStatus: '1',
        rescind: '0',
        excellence: '0'
      }, // 报告信息
      srcPdfUrl: '', // 处理后的url
      reportAudit: deepClone(defaultReportAudit),
      dialogVisible: false,
      dialogType: 'not_pass'
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
  methods: {
    handleAudit(auditStatus, dialogType) {
      this.reportAudit = deepClone(defaultReportAudit)
      this.reportAudit.id = this.report.reportId
      this.reportAudit.auditStatus = auditStatus
      this.dialogType = dialogType
      this.dialogVisible = true
    },
    // 不通过/通过 确认
    async confirm() {
      await reportAudit(this.reportAudit).then(() => {
        this.report.auditStatus = this.reportAudit.auditStatus
        this.dialogVisible = false
        this.$router.push({
          path: '/wdk/report_audit',
          query: {
            activeName: this.getActiveName(this.reportAudit.auditStatus),
            auditStatus: this.reportAudit.auditStatus
          }
        })
      }).catch(() => {
        this.dialogVisible = false
      })
    },
    // 获取activeName
    getActiveName(auditStatus) {
      if (auditStatus === '2') {
        return 'pass'
      }
      return 'not_pass'
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
