<template>
  <div class="app-container">
    <el-form
      ref="operLogForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="operLogForm"
      :rules="operLogFormRules"
      label-position="left"
    >
      <el-form-item prop="title" label="系统模块" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="title"
          v-model="operLogForm.title"
          placeholder="请输入系统模块"
          name="title"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-form-item prop="operName" label="操作人员" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="operName"
          v-model="operLogForm.operName"
          placeholder="请输入操作人员"
          name="operName"
          type="text"
          tabindex="2"
          clearable
        />
      </el-form-item>
      <el-form-item prop="reqMethod" label="操作类型" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="operLogForm.reqMethod" tabindex="4" placeholder="请选择操作类型" clearable style="width: 150px">
          <el-option v-for="item in reqMethodList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="操作状态" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="operLogForm.status" tabindex="4" placeholder="请选择操作状态" clearable style="width: 150px">
          <el-option v-for="item in operStatusList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间" label-width="70px" style="margin-right: 20px;">
        <el-date-picker
          v-model="dates"
          tabindex="5"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          clearable
          @change="changeDates"
        />
      </el-form-item>

      <el-button
        style="margin-top: 2px; height: 32px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click.native.prevent="handleOperLogList(1)"
      >搜索</el-button>
    </el-form>

    <el-button
      :disabled="delBtnDisabled"
      type="danger"
      size="small"
      icon="el-icon-delete"
      @click="handleDelete(multipleSelection)"
    >删除</el-button>
    <el-button type="danger" size="small" icon="el-icon-delete" @click="handleClear">清空</el-button>

    <el-table
      :data="operLogList"
      style="width: 100%; margin-top:30px;"
      :header-cell-style="tableHeaderCellStyle"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="日志编号" width="100">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="系统模块" width="120">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作类型" width="100">
        <template slot-scope="scope">
          {{ getOperLogReqMethod(scope.row.reqMethod) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人员" width="200">
        <template slot-scope="scope">
          {{ scope.row.operName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门名称" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.deptName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作IP" width="120">
        <template slot-scope="scope">
          {{ scope.row.operIp }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作地点" width="200">
        <template slot-scope="scope">
          {{ scope.row.operLocation }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作状态" width="100">
        <template slot-scope="scope">
          {{ getOperLogStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.time }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="small" @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete([scope.row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="操作日志详情" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false" append-to-body>
      <el-form ref="operLogDetail" :model="operLogDetail" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ operLogDetail.title }} </el-form-item>
            <el-form-item label="登录信息：">{{ operLogDetail.operName }} / {{ operLogDetail.deptName }} /
              {{ operLogDetail.operIp }} / {{ operLogDetail.operLocation }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求方式：">{{ operLogDetail.reqMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ operLogDetail.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ operLogDetail.reqParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ operLogDetail.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="operLogDetail.status === 1">正常</div>
              <div v-else>异常</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作时间：">{{ operLogDetail.time }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px;"
      :current-page="operLogForm.curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="operLogForm.pageSize"
      :disabled="operLogForm.total <= operLogForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="operLogForm.total"
      @size-change="handleSizeChange"
      @current-change="handleCurChange"
    />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  deepClone
} from '@/utils'
import {
  formatStartDate,
  formatEndDate
} from '@/utils/time'
import {
  getClientOptions,
  getOperLogList,
  deleteOperLog,
  clearOperLog
} from '@/api/oper_log'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      operLogForm: {
        title: '',
        operName: '',
        reqMethod: null,
        status: null,
        startTime: '',
        endTime: '',
        curPage: 1,
        pageSize: 10,
        total: 0
      },
      operLogFormRules: {
        operName: [{
          pattern: '^[\u4e00-\u9fa5]{0,20}$',
          message: '操作人员必须为中文且长度不能超过20',
          trigger: 'blur'
        }]
      },
      dates: {
        type: Array,
        default: () => [] // es6的箭头函数
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      reqMethodList: [],
      operStatusList: [],
      operLogList: [],
      multipleSelection: [],
      delBtnDisabled: true,
      dialogVisible: false,
      operLogDetail: {},
      loading: true // 遮罩层
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
    this.handleClientOptions()
    this.handleOperLogList()
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
    // 表头
    tableHeaderCellStyle() {
      return 'color:#606266;background:#F2F6FC'
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delBtnDisabled = false
      } else {
        this.delBtnDisabled = true
      }
    },
    // 获取操作日志客户端选项
    handleClientOptions() {
      getClientOptions().then((res) => {
        if (res.data) {
          this.operStatusList = res.data.statusList
          this.reqMethodList = res.data.operTypeList
        } else {
          this.operStatusList = []
          this.reqMethodList = []
        }
      }).catch(() => { })
    },
    // 获取操作日志
    handleOperLogList(curPage) {
      var paramsData = deepClone(this.operLogForm)
      if (curPage) {
        paramsData.curPage = curPage
      }
      getOperLogList(paramsData).then((res) => {
        if (res.data.list) {
          this.operLogList = res.data.list
        } else {
          this.operLogList = []
        }
        this.operLogForm.curPage = res.data.curPage
        this.operLogForm.total = res.data.total
      }).catch(() => { })
    },
    // 获取操作状态
    getOperLogStatus(status) {
      status += ''
      var index = this.operStatusList.findIndex(item => item.value === status)
      if (index !== -1) {
        return this.operStatusList[index].name
      }
      return ''
    },
    // 获取操作类型
    getOperLogReqMethod(reqMethod) {
      var index = this.reqMethodList.findIndex(item => item.value === reqMethod)
      if (index !== -1) {
        return this.reqMethodList[index].name
      }
      return ''
    },
    // 修改时间
    changeDates(dates) {
      if (dates && dates.length >= 2) {
        this.operLogForm.startTime = formatStartDate(dates[0])
        this.operLogForm.endTime = formatEndDate(dates[1])
      } else {
        this.operLogForm.startTime = ''
        this.operLogForm.endTime = ''
      }
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.operLogForm.curPage = 1
      this.operLogForm.pageSize = val
      this.handleOperLogList()
    },
    // 当前页更改
    handleCurChange(val) {
      this.operLogForm.curPage = val
      this.handleOperLogList()
    },
    // 详情
    handleDetail(row) {
      this.dialogVisible = true
      this.operLogDetail = row
    },
    // 删除
    handleDelete(rowList) {
      var idList = []
      for (const item of rowList) {
        idList.push(item.id)
      }
      this.$confirm('是否确认删除日志编号为"' + idList.join(',') + '"的数据项?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteOperLog({
          ids: idList
        }).then(() => {
          for (const id of idList) {
            var index = this.operLogList.findIndex(item => item.id === id)
            if (index !== -1) {
              this.operLogList.splice(index, 1)
            }
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => { })
      }).catch(() => { })
    },
    // 清空
    handleClear() {
      this.$confirm('是否确认清空所有操作日志数据项?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await clearOperLog().then(() => {
          this.operLogList = []
          this.operLogForm.curPage = 1
          this.operLogForm.total = 0
          this.$message({
            type: 'success',
            message: '清空成功!'
          })
        }).catch(() => { })
      }).catch(() => { })
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
