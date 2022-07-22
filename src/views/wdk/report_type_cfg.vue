<template>
  <div class="app-container">
    <el-form
      ref="reportTypeCfgForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="reportTypeCfgForm"
      :rules="reportTypeCfgFormRules"
      label-position="left"
    >
      <el-form-item prop="name" label="类型名称" label-width="70px">
        <el-input
          ref="name"
          v-model="reportTypeCfgForm.name"
          placeholder="请输入类型名称"
          name="name"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-button
        style="margin-left: 20px; margin-top: 2px; height: 32px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click.native.prevent="handleReportTypeCfgs"
      >搜索</el-button>
    </el-form>

    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    <el-button
      :disabled="delReportTypeCfgBtnDisabled"
      type="danger"
      size="small"
      icon="el-icon-delete"
      @click="handleDelete(multipleSelection)"
    >删除</el-button>

    <el-table
      :data="reportTypeCfgList"
      style="width: 100%; margin-top:30px;"
      :header-cell-style="tableHeaderCellStyle"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="类型ID" width="100">
        <template slot-scope="scope">
          {{ scope.row.reportCfg.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型名称">
        <template slot-scope="scope">
          {{ scope.row.reportCfg.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核人员">
        <template slot-scope="scope">
          {{ getReportAuditNames(scope.row.reportAuditCfg) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.reportCfg.createdAt }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.reportCfg.updatedAt }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete([scope.row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改类型配置' : '新增类型配置'"
      :close-on-click-modal="false"
      width="570px"
    >
      <el-form
        ref="reportTypeCfg"
        :model="reportTypeCfg"
        :rules="reportTypeCfgRules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item prop="name" label="类型名称" label-width="80px">
          <el-input v-model="reportTypeCfg.name" placeholder="请输入类型名称" clearable />
        </el-form-item>
        <el-form-item prop="auditUids" label="审核人员" label-width="80px">
          <el-select
            v-model="reportTypeCfg.auditUids"
            placeholder="请搜索审核人员"
            clearable
            multiple
            filterable
            remote
            :remote-method="auditRemoteMethod"
            :loading="auditLoading"
            style="width: 170px"
          >
            <el-option v-for="item in auditUserList" :key="item.id" :label="item.realname" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  deepClone
} from '@/utils'
import {
  searchByRealname
} from '@/api/user_manager'
import {
  getReportTypeCfgList,
  addReportTypeCfg,
  getReportTypeCfg,
  updateReportTypeCfg,
  deleteReportTypeCfg
} from '@/api/wdk_report_type_cfg'

const defaultReportTypeCfg = {
  id: 0,
  name: '',
  auditUids: []
}
Object.freeze(defaultReportTypeCfg)
Object.freeze(defaultReportTypeCfg.auditUids)

export default {
  data() {
    const validateAuditUids = (rule, value, callback) => {
      if (this.reportTypeCfg.auditUids.length > 0) {
        callback()
      } else {
        return callback(new Error('审核人员不能为空'))
      }
    }
    return {
      reportTypeCfgForm: {
        name: ''
      },
      reportTypeCfgFormRules: {
        name: [{
          pattern: '^[\u4e00-\u9fa5]{0,20}$',
          message: '报告类型名称必须为中文且长度不能超过20',
          trigger: 'blur'
        }]
      },
      reportTypeCfgRules: {
        name: [{
          required: true,
          pattern: '^[\u4e00-\u9fa5]{0,20}$',
          message: '报告类型名称必须为中文且长度不能超过20',
          trigger: 'blur'
        }],
        auditUids: [{
          type: 'array',
          required: true,
          validator: validateAuditUids
        }]
      },
      reportTypeCfg: deepClone(defaultReportTypeCfg),
      reportTypeCfgList: [],
      multipleSelection: [],
      auditUserList: [],
      auditLoading: false,
      delReportTypeCfgBtnDisabled: true,
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  computed: {},
  created() {
    // Mock: get all routes and users list from server
    this.handleGetReportTypeCfgList()
  },
  methods: {
    // 表头
    tableHeaderCellStyle() {
      return 'color:#606266;background:#F2F6FC'
    },
    // 通过姓名搜索用户
    auditRemoteMethod(query) {
      if (query !== '') {
        this.auditLoading = true
        setTimeout(() => {
          searchByRealname({
            realname: query
          }).then((res) => {
            this.auditLoading = false
            this.auditUserList = res.data.list
          }).catch(() => { })
        }, 200)
      } else {
        this.auditUserList = []
      }
    },
    // 获取报告类型配置列表
    handleReportTypeCfgs() {
      this.$refs.reportTypeCfgForm.validate(valid => {
        if (valid) {
          this.handleGetReportTypeCfgList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取报告类型配置列表
    handleGetReportTypeCfgList() {
      getReportTypeCfgList(this.reportTypeCfgForm).then(res => {
        if (res.data.list) {
          this.reportTypeCfgList = res.data.list
        } else {
          this.reportTypeCfgList = []
        }
      })
    },
    // 获取审核人员姓名
    getReportAuditNames(reportAuditCfg) {
      var names = []
      for (const item of reportAuditCfg) {
        names.push(item.auditName)
      }
      return names.join(', ')
    },
    // 添加
    handleAdd() {
      this.reportTypeCfg = deepClone(defaultReportTypeCfg)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 修改
    handleEdit(row) {
      getReportTypeCfg({
        id: row.reportCfg.id
      }).then((res) => {
        this.reportTypeCfg = deepClone(defaultReportTypeCfg)
        this.reportTypeCfg.id = res.data.info.reportCfg.id
        this.reportTypeCfg.name = res.data.info.reportCfg.name
        this.auditUserList = []
        for (const item of res.data.info.reportAuditCfg) {
          this.reportTypeCfg.auditUids.push(item.auditUid)
          this.auditUserList.push({
            id: item.auditUid,
            realname: item.auditName
          })
        }
      }).catch(() => { })

      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delReportTypeCfgBtnDisabled = false
      } else {
        this.delReportTypeCfgBtnDisabled = true
      }
    },
    // 删除
    handleDelete(rowList) {
      var idList = []
      var nameList = []
      for (const item of rowList) {
        idList.push(item.reportCfg.id)
        nameList.push(item.reportCfg.name)
      }
      var names = nameList.join('; ')
      this.$confirm('确认要"移除" "' + names + '" 报告类型吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteReportTypeCfg({
            ids: idList
          }).then(() => {
            for (const id of idList) {
              var index = this.reportTypeCfgList.findIndex(item => item.reportCfg.id === id)
              if (index !== -1) {
                this.reportTypeCfgList.splice(index, 1)
              }
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => { })
        }).catch(() => { })
    },
    // 添加/修改 确认
    async confirmUser() {
      this.$refs.reportTypeCfg.validate(valid => {
        if (valid) {
          this.AddOrEditReportTypeCfg()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加/修改
    async AddOrEditReportTypeCfg() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateReportTypeCfg(this.reportTypeCfg).then(() => {
          this.dialogVisible = false
          this.handleGetReportTypeCfgList()
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `<div>报告类型名称: ${this.reportTypeCfg.name}</div>`,
            type: 'success'
          })
        }).catch(() => {
          this.dialogVisible = false
        })
      } else {
        await addReportTypeCfg(this.reportTypeCfg).then(() => {
          this.dialogVisible = false
          this.handleGetReportTypeCfgList()
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `<div>报告类型名称: ${this.reportTypeCfg.name}</div>`,
            type: 'success'
          })
        }).catch(() => {
          this.dialogVisible = false
        })
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
