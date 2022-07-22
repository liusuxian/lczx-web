<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="wait_audit" />
      <el-tab-pane label="已通过" name="pass" />
      <el-tab-pane label="未通过" name="not_pass" />
      <el-tab-pane label="已撤销" name="rescind" />
    </el-tabs>

    <el-table
      :data="reportAuditList"
      style="width: 100%;"
      :header-cell-style="tableHeaderCellStyle"
      tooltip-effect="light"
    >
      <el-table-column align="center" label="报告名称">
        <template slot-scope="scope">
          <el-button type="text" @click="handleReportAuditPage(scope.row)">
            {{ scope.row.report.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属项目">
        <template slot-scope="scope">
          {{ scope.row.report.projectName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="专业类别">
        <template slot-scope="scope">
          {{ getReportType(scope.row.reportAuditType) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="上传时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.report.createdAt }}
        </template>
      </el-table-column>
      <el-table-column v-if="activeName !== 'wait_audit'" align="center" label="审核时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.reportAudit.auditTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="上传用户" width="100">
        <template slot-scope="scope">
          {{ scope.row.report.createName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="small" @click="handleAuditView(scope.row)">流程查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" title="审核流程" :close-on-click-modal="false" width="860px">
      <el-card style="margin-bottom: 20px;">
        <el-steps :active="active" :process-status="processStatus" finish-status="success" align-center>
          <el-step
            v-for="item in reportAuditProcessList"
            :key="item.index"
            :title="getStepTitle(item)"
            :description="item.reportAudit.auditName"
          />
        </el-steps>
      </el-card>
      <el-card>
        <el-table
          style="width: 100%;"
          :data="reportAuditProcessList"
          :header-cell-style="tableHeaderCellStyle"
          tooltip-effect="light"
        >
          <el-table-column align="center" label="审核人" width="100">
            <template slot-scope="scope">
              {{ scope.row.reportAudit.auditName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="审核类型">
            <template slot-scope="scope">
              {{ getReportType(scope.row.reportAuditType) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="审核时间" width="160">
            <template slot-scope="scope">
              {{ scope.row.reportAudit.auditTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="审核意见">
            <template slot-scope="scope">
              {{ scope.row.reportAudit.auditOpinion }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="审核状态" width="100">
            <template slot-scope="scope">
              {{ getReportAuditStatus(scope.row.reportAudit.status) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px;"
      :current-page="reportAudit.curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="reportAudit.pageSize"
      :disabled="reportAudit.total <= reportAudit.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="reportAudit.total"
      @size-change="handleSizeChange"
      @current-change="handleCurChange"
    />
  </div>
</template>

<script>
import {
  getReportAuditList,
  getReportAuditProcess
} from '@/api/wdk_report_audit'

export default {
  data() {
    return {
      activeName: 'wait_audit',
      reportAudit: {
        status: 1,
        rescind: 0,
        curPage: 1,
        pageSize: 10,
        total: 0
      },
      reportAuditList: [],
      reportAuditProcessList: [],
      dialogVisible: false,
      active: 0,
      processStatus: 'process'
    }
  },
  computed: {},
  created() {
    if (Object.keys(this.$route.query).length > 0) {
      this.activeName = this.$route.query.activeName
      this.reportAudit.status = parseInt(this.$route.query.auditStatus)
    }
    this.handleGetReportAuditList()
  },
  methods: {
    // 表头
    tableHeaderCellStyle() {
      return 'color:#606266;background:#F2F6FC'
    },
    // 获取文档库报告审核记录列表
    handleGetReportAuditList() {
      getReportAuditList(this.reportAudit).then((res) => {
        if (res.data.list) {
          this.reportAuditList = res.data.list
        } else {
          this.reportAuditList = []
        }
        this.reportAudit.curPage = res.data.curPage
        this.reportAudit.total = res.data.total
      })
    },
    // 获取报告类型
    getReportType(list) {
      var typeList = []
      for (const item of list) {
        typeList.push(item.typeName)
      }
      return typeList.join(', ')
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.reportAudit.curPage = 1
      this.reportAudit.pageSize = val
      this.handleGetReportAuditList()
    },
    // 当前页更改
    handleCurChange(val) {
      this.reportAudit.curPage = val
      this.handleGetReportAuditList()
    },
    // 切片标签
    handleClick(tab, event) {
      if (tab.name === 'wait_audit') {
        this.reportAudit.status = 1
        this.reportAudit.rescind = 0
      } else if (tab.name === 'pass') {
        this.reportAudit.status = 2
        this.reportAudit.rescind = 0
      } else if (tab.name === 'rescind') {
        this.reportAudit.rescind = 1
      } else {
        this.reportAudit.status = 0
        this.reportAudit.rescind = 0
      }
      this.handleGetReportAuditList()
    },
    // 进入报告审核页
    handleReportAuditPage(row) {
      var tmpCnt = row.report.name.lastIndexOf('.')
      var name = row.report.name.substring(0, tmpCnt)
      this.$router.push({
        name: 'WdkReportAuditPage',
        query: {
          pdfName: name,
          pdfUrl: row.report.pdfUrl,
          reportId: row.report.id,
          auditStatus: row.reportAudit.status + '',
          rescind: row.report.rescind + '',
          excellence: row.report.excellence + ''
        }
      })
    },
    // 流程查看
    handleAuditView(row) {
      this.active = 0
      this.processStatus = 'process'
      this.dialogVisible = true
      getReportAuditProcess({ id: row.report.id }).then((res) => {
        if (res.data.list) {
          this.reportAuditProcessList = res.data.list
        } else {
          this.reportAuditProcessList = []
        }
        // 处理active
        for (const item of this.reportAuditProcessList) {
          if (item.reportAudit.status === 0 || item.reportAudit.status === 1) {
            // 未通过或审核中
            break
          }
          if (item.reportAudit.status === 2) {
            // 已通过
            this.active++
          }
        }
        // 处理processStatus
        var item = this.reportAuditProcessList[this.active]
        if (item.reportAudit.status === 0) {
          // 未通过
          this.processStatus = 'error'
        }
      }).catch(() => { })
    },
    // 获取流程步骤标题
    getStepTitle(item) {
      if (item.reportAudit.auditorType === 0) {
        return '负责人'
      }
      return '专家组'
    },
    // 获取审核状态
    getReportAuditStatus(auditStatus) {
      if (auditStatus === 0) {
        return '未通过'
      } else if (auditStatus === 2) {
        return '已通过'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
