<template>
  <div class="app-container">
    <el-form
      ref="loginLogForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="loginLogForm"
      :rules="loginLogFormRules"
      label-position="left"
    >
      <el-form-item prop="ip" label="登录IP" label-width="60px" style="margin-right: 20px;">
        <el-input
          ref="ip"
          v-model="loginLogForm.ip"
          placeholder="请输入登录IP"
          name="ip"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-form-item prop="location" label="登录地点" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="location"
          v-model="loginLogForm.location"
          placeholder="请输入登录地点"
          name="location"
          type="text"
          tabindex="2"
          clearable
        />
      </el-form-item>
      <el-form-item prop="passport" label="用户账号" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="passport"
          v-model="loginLogForm.passport"
          placeholder="请输入用户账号"
          name="passport"
          type="text"
          tabindex="3"
          clearable
        />
      </el-form-item>
      <el-form-item prop="status" label="登录状态" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="loginLogForm.status" tabindex="4" placeholder="请选择登录状态" clearable style="width: 150px">
          <el-option v-for="item in loginStatusList" :key="item.value" :label="item.name" :value="item.value" />
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
        @click.native.prevent="handleLoginLogList(1)"
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
      :data="loginLogList"
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
      <el-table-column align="center" label="登录账号" width="120">
        <template slot-scope="scope">
          {{ scope.row.passport }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录IP" width="120">
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录地点" width="200">
        <template slot-scope="scope">
          {{ scope.row.location }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览器类型" width="120">
        <template slot-scope="scope">
          {{ scope.row.browser }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作系统" width="200">
        <template slot-scope="scope">
          {{ scope.row.os }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录状态" width="100">
        <template slot-scope="scope">
          {{ getLoginLogStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作信息">
        <template slot-scope="scope">
          {{ scope.row.msg }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.time }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录模块">
        <template slot-scope="scope">
          {{ scope.row.module }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete([scope.row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px;"
      :current-page="loginLogForm.curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="loginLogForm.pageSize"
      :disabled="loginLogForm.total <= loginLogForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="loginLogForm.total"
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
  getLoginLogList,
  deleteLoginLog,
  clearLoginLog
} from '@/api/login_log'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      loginLogForm: {
        ip: '',
        location: '',
        passport: '',
        status: null,
        startTime: '',
        endTime: '',
        curPage: 1,
        pageSize: 10,
        total: 0
      },
      loginLogFormRules: {
        location: [{
          pattern: '^[\u4e00-\u9fa5]{0,255}$',
          message: '登录地点必须为中文且长度不能超过255',
          trigger: 'blur'
        }],
        passport: [{
          pattern: '^[a-zA-Z]\\w{0,18}$',
          message: '账号以字母开头，只能包含字母、数字和下划线且长度不能超过18',
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
      loginStatusList: [],
      loginLogList: [],
      multipleSelection: [],
      delBtnDisabled: true
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
    this.handleLoginLogList()
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
    // 获取登录日志客户端选项
    handleClientOptions() {
      getClientOptions().then((res) => {
        if (res.data) {
          this.loginStatusList = res.data.statusList
        } else {
          this.loginStatusList = []
        }
      }).catch(() => { })
    },
    // 获取登录日志
    handleLoginLogList(curPage) {
      var paramsData = deepClone(this.loginLogForm)
      if (curPage) {
        paramsData.curPage = curPage
      }
      getLoginLogList(paramsData).then((res) => {
        if (res.data.list) {
          this.loginLogList = res.data.list
        } else {
          this.loginLogList = []
        }
        this.loginLogForm.curPage = res.data.curPage
        this.loginLogForm.total = res.data.total
      }).catch(() => { })
    },
    // 获取登录状态
    getLoginLogStatus(status) {
      status += ''
      var index = this.loginStatusList.findIndex(item => item.value === status)
      if (index !== -1) {
        return this.loginStatusList[index].name
      }
      return ''
    },
    // 修改时间
    changeDates(dates) {
      if (dates && dates.length >= 2) {
        this.loginLogForm.startTime = formatStartDate(dates[0])
        this.loginLogForm.endTime = formatEndDate(dates[1])
      } else {
        this.loginLogForm.startTime = ''
        this.loginLogForm.endTime = ''
      }
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.loginLogForm.curPage = 1
      this.loginLogForm.pageSize = val
      this.handleLoginLogList()
    },
    // 当前页更改
    handleCurChange(val) {
      this.loginLogForm.curPage = val
      this.handleLoginLogList()
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
        await deleteLoginLog({
          ids: idList
        }).then(() => {
          for (const id of idList) {
            var index = this.loginLogList.findIndex(item => item.id === id)
            if (index !== -1) {
              this.loginLogList.splice(index, 1)
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
      this.$confirm('是否确认清空所有登录日志数据项?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await clearLoginLog().then(() => {
          this.loginLogList = []
          this.loginLogForm.curPage = 1
          this.loginLogForm.total = 0
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
