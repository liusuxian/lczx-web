<template>
  <div class="app-container">
    <el-form
      ref="crontabForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="crontabForm"
      label-position="left"
    >
      <el-form-item prop="name" label="任务名称" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="name"
          v-model="crontabForm.name"
          placeholder="请输入任务名称"
          name="name"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-form-item prop="group" label="任务组名" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="crontabForm.group" tabindex="2" placeholder="请选择任务组名" clearable style="width: 150px">
          <el-option v-for="item in crontabGroupList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="任务状态" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="crontabForm.status" tabindex="3" placeholder="请选择任务状态" clearable style="width: 150px">
          <el-option v-for="item in crontabStatusList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-button
        style="margin-top: 2px; height: 32px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click.native.prevent="handleCrontabList(1)"
      >搜索</el-button>
    </el-form>

    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddCrontab">新增</el-button>
    <el-button
      :disabled="delCrontabBtnDisabled"
      type="danger"
      size="small"
      icon="el-icon-delete"
      @click="handleDelete(multipleSelection)"
    >删除</el-button>

    <el-table
      :data="crontabList"
      style="width: 100%; margin-top:30px;"
      :header-cell-style="tableHeaderCellStyle"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="任务名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务组名" width="100">
        <template slot-scope="scope">
          {{ getGroupName(scope.row.group) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数">
        <template slot-scope="scope">
          {{ scope.row.params }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务方法名" width="200">
        <template slot-scope="scope">
          {{ getInvokeTargetName(scope.row.invokeTarget) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="cron执行表达式" width="150">
        <template slot-scope="scope">
          {{ scope.row.cronExpression }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align=" center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete([scope.row])">删除</el-button>
          <el-button type="text" icon="el-icon-caret-right" size="small" @click="handleRun(scope.row)">执行一次</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改任务' : '添加任务'"
      :close-on-click-modal="false"
      width="570px"
    >
      <el-form ref="crontab" :model="crontab" :rules="crontabRules" label-width="80px" label-position="left">
        <div style="display: flex;">
          <el-form-item label="任务名称" prop="name" style="margin-right: 20px;">
            <el-input v-model="crontab.name" placeholder="请输入任务名称" clearable />
          </el-form-item>
          <el-form-item label="任务分组" prop="group">
            <el-select v-model="crontab.group" placeholder="请选择任务分组" clearable style="width: 150px">
              <el-option v-for="item in crontabGroupList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item prop="params" label-width="90px" style="margin-left: 10px;">
          <span slot="label">
            执行参数
            <el-tooltip placement="top">
              <div slot="content">
                以|分隔多个参数 示例：param1|param1
                <br>参数说明：支持字符串，布尔类型，长整型，浮点型，整型
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input v-model="crontab.params" placeholder="若有参数，请输入" clearable />
        </el-form-item>
        <el-form-item label="调用方法" prop="invokeTarget">
          <el-select v-model="crontab.invokeTarget" placeholder="请选择调用方法" clearable style="width: 100%;">
            <el-option
              v-for="item in crontabInvokeTargetList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="cron执行表达式" prop="cronExpression" label-width="125px">
          <el-input v-model="crontab.cronExpression" placeholder="请输入cron执行表达式" clearable />
        </el-form-item>
        <el-form-item>
          <ul style="list-style: none;">
            <li><i class="el-icon-warning" /> * * * * * * : 每秒执行</li>
            <li><i class="el-icon-warning" /> */5 * * * * * : 每5秒执行一次</li>
            <li><i class="el-icon-warning" /> 2 * * * * * : 每分钟的第2秒执行</li>
            <li><i class="el-icon-warning" /> 0 */1 * * * * : 每分钟执行一次</li>
            <li><i class="el-icon-warning" /> 0 */30 * * * * : 每30分钟执行一次</li>
            <li><i class="el-icon-warning" /> 0 0 */2 * * * : 每2小时执行一次</li>
            <li><i class="el-icon-warning" /> 0 0 23 * * * : 每天23点执行一次</li>
            <li><i class="el-icon-warning" /> 0 0 2 * * * : 每天凌晨2点执行</li>
            <li><i class="el-icon-warning" /> 0 0 1 1 * * : 每月1号凌晨1点执行一次</li>
            <li><i class="el-icon-warning" /> 0 */30 9-18 * * * : 每天9点到18点，每隔30分钟执行一次</li>
            <li><i class="el-icon-warning" /> 0 0 9 * * MON,FRI : 每周一和周五在9点执行一次</li>
          </ul>
        </el-form-item>
        <el-form-item label="执行策略" prop="misfirePolicy" style="margin-left: 10px;">
          <el-radio-group v-model="crontab.misfirePolicy">
            <el-radio v-for="item in crontabMisfirePolicyList" :key="item.value" :label="item.value">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status" label-width="50px" style="margin-left: 10px;">
          <el-radio-group v-model="crontab.status">
            <el-radio v-for="item in crontabStatusList" :key="item.value" :label="item.value">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="50px" style="margin-left: 10px;">
          <el-input
            v-model="crontab.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入备注"
            clearable
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCrontab">确认</el-button>
      </div>
    </el-dialog>

    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px;"
      :current-page="crontabForm.curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="crontabForm.pageSize"
      :disabled="crontabForm.total <= crontabForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="crontabForm.total"
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
  getClientOptions,
  getCrontabList,
  addCrontab,
  getCrontab,
  updateCrontab,
  startCrontab,
  stopCrontab,
  runCrontab,
  deleteCrontab
} from '@/api/crontab'

const defaultCrontab = {
  name: '',
  group: null,
  params: '',
  invokeTarget: null,
  cronExpression: '',
  misfirePolicy: '1',
  status: '1',
  remark: ''
}
Object.freeze(defaultCrontab)

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      crontabForm: {
        name: '',
        group: null,
        status: null,
        curPage: 1,
        pageSize: 10,
        total: 0
      },
      crontabRules: {
        name: [{
          required: true,
          pattern: '^.{1,20}$',
          message: '任务名称不能为空且长度不能超过20',
          trigger: 'blur'
        }],
        group: [{
          required: true,
          message: '任务组名不能为空',
          trigger: 'blur'
        }],
        params: [{
          pattern: '^.{0,255}$',
          message: '执行参数长度不能超过255',
          trigger: 'blur'
        }],
        invokeTarget: [{
          required: true,
          message: '调用方法不能为空',
          trigger: 'blur'
        }],
        cronExpression: [{
          required: true,
          pattern: '^.{1,255}$',
          message: 'cron执行表达式不能为空且长度不能超过255',
          trigger: 'blur'
        }]
      },
      crontab: deepClone(defaultCrontab),
      dialogVisible: false,
      dialogType: 'new',
      delCrontabBtnDisabled: true,
      multipleSelection: [],
      crontabMisfirePolicyList: [],
      crontabGroupList: [],
      crontabStatusList: [],
      crontabInvokeTargetList: [],
      crontabList: []
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
    this.handleCrontabList()
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
      return 'color: #606266; background: #F2F6FC;'
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delCrontabBtnDisabled = false
      } else {
        this.delCrontabBtnDisabled = true
      }
    },
    // 获取任务组名显示名
    getGroupName(group) {
      var index = this.crontabGroupList.findIndex(item => item.value === group)
      if (index !== -1) {
        return this.crontabGroupList[index].name
      }
      return ''
    },
    // 获取任务方法名显示名
    getInvokeTargetName(invokeTarget) {
      var index = this.crontabInvokeTargetList.findIndex(item => item.value === invokeTarget)
      if (index !== -1) {
        return this.crontabInvokeTargetList[index].name
      }
      return ''
    },
    // 获取定时任务客户端选项
    handleClientOptions() {
      getClientOptions().then((res) => {
        if (res.data) {
          this.crontabGroupList = res.data.groupList
          this.crontabMisfirePolicyList = res.data.misfirePolicyList
          this.crontabStatusList = res.data.statusList
          this.crontabInvokeTargetList = res.data.invokeTargetList
        } else {
          this.crontabGroupList = []
          this.crontabMisfirePolicyList = []
          this.crontabStatusList = []
          this.crontabInvokeTargetList = []
        }
      }).catch(() => { })
    },
    // 获取定时任务列表
    handleCrontabList(curPage) {
      var paramsData = deepClone(this.crontabForm)
      if (curPage) {
        paramsData.curPage = curPage
      }
      getCrontabList(paramsData).then((res) => {
        if (res.data.list) {
          for (const item of res.data.list) {
            item.misfirePolicy += ''
            item.status += ''
          }
          this.crontabList = res.data.list
        } else {
          this.crontabList = []
        }
        this.crontabForm.curPage = res.data.curPage
        this.crontabForm.total = res.data.total
      })
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.crontabForm.curPage = 1
      this.crontabForm.pageSize = val
      this.handleCrontabList()
    },
    // 当前页更改
    handleCurChange(val) {
      this.crontabForm.curPage = val
      this.handleCrontabList()
    },
    // 添加
    handleAddCrontab() {
      this.crontab = deepClone(defaultCrontab)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 修改
    handleEdit(row) {
      getCrontab({ id: row.id }).then((res) => {
        this.crontab = res.data.info
        this.crontab.misfirePolicy += ''
        this.crontab.status += ''
      }).catch(() => { })

      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 执行
    handleRun(row) {
      runCrontab({ id: row.id }).then(() => {
        this.$message({
          type: 'success',
          message: '执行成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '执行失败!'
        })
      })
    },
    // 状态变化
    handleStatusChange(row) {
      if (row.status === '0') {
        this.$confirm('确认要"停用" "' + row.name + '" 任务吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stopCrontab({ id: row.id }).then(() => { }).catch(() => { row.status = '1' })
        }).catch(() => { row.status = '1' })
      } else {
        startCrontab({ id: row.id }).then(() => { }).catch(() => { row.status = '0' })
      }
    },
    // 删除
    handleDelete(rowList) {
      var idList = []
      var nameList = []
      for (const item of rowList) {
        idList.push(item.id)
        nameList.push(item.name)
      }
      var names = nameList.join('; ')
      this.$confirm('确认要"移除" "' + names + '" 任务吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteCrontab({ ids: idList }).then(() => {
          for (const crontabId of idList) {
            var index = this.crontabList.findIndex(item => item.id === crontabId)
            if (index !== -1) {
              this.crontabList.splice(index, 1)
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
    async confirmCrontab() {
      this.$refs.crontab.validate(valid => {
        if (valid) {
          this.AddOrEditCrontab()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加/修改
    async AddOrEditCrontab() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateCrontab(this.crontab).then(() => {
          this.dialogVisible = false
          for (let index = 0; index < this.crontabList.length; index++) {
            if (this.crontabList[index].id === this.crontab.id) {
              this.crontabList.splice(index, 1, Object.assign({}, this.crontab))
              break
            }
          }
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                <div>任务名称: ${this.crontab.name}</div>
                <div>备注: ${this.crontab.remark || '无内容'}</div>
              `,
            type: 'success'
          })
        }).catch(() => {
          this.dialogVisible = false
        })
      } else {
        await addCrontab(this.crontab).then(() => {
          this.dialogVisible = false
          var curPage = parseInt(this.crontabForm.total / this.crontabForm.pageSize) + 1
          this.handleCrontabList(curPage)
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                <div>任务名称: ${this.role.name}</div>
                <div>备注: ${this.role.remark || '无内容'}</div>
              `,
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

<style lang='scss' scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
