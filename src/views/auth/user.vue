<template>
  <div class="app-container">
    <el-form
      ref="userForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="userForm"
      :rules="userFormRules"
      label-position="left"
    >
      <el-form-item prop="deptId" label="部门" label-width="50px">
        <treeselect
          v-model="userForm.deptId"
          class="user-treeselect"
          :options="deptsTree"
          :default-expand-level="Infinity"
          placeholder="请选择或搜索部门"
        />
      </el-form-item>
      <el-form-item prop="passport" label="账号" label-width="50px" style="margin-right: 20px;">
        <el-input
          ref="passport"
          v-model="userForm.passport"
          placeholder="请输入账号"
          name="passport"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-form-item prop="realname" label="姓名" label-width="50px" style="margin-right: 20px;">
        <el-input
          ref="realname"
          v-model="userForm.realname"
          placeholder="请输入姓名"
          name="realname"
          type="text"
          tabindex="2"
          clearable
        />
      </el-form-item>
      <el-form-item prop="mobile" label="手机" label-width="50px" style="margin-right: 20px;">
        <el-input
          ref="mobile"
          v-model="userForm.mobile"
          placeholder="请输入手机号"
          name="mobile"
          type="text"
          tabindex="3"
          clearable
        />
      </el-form-item>
      <el-form-item prop="status" label="用户状态" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="userForm.status" tabindex="4" placeholder="请选择用户状态" clearable style="width: 150px">
          <el-option v-for="item in userStatusList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" label-width="70px">
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
        style="margin-left: 20px; margin-top: 2px; height: 32px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click.native.prevent="handleUsers(1)"
      >搜索
      </el-button>
    </el-form>

    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    <el-button
      :disabled="delUsersBtnDisabled"
      type="danger"
      size="small"
      icon="el-icon-delete"
      @click="handleDelete(multipleSelection)"
    >删除</el-button>

    <el-table
      :data="usersList"
      style="width: 100%; margin-top:30px;"
      :header-cell-style="tableHeaderCellStyle"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="用户ID" width="70">
        <template slot-scope="scope">
          {{ scope.row.user.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" width="100">
        <template slot-scope="scope">
          {{ scope.row.user.passport }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.user.realname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          {{ scope.row.dept.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="140">
        <template slot-scope="scope">
          {{ getRoleNames(scope.row.roles) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="70">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.user.status"
            active-value="1"
            inactive-value="0"
            @change="handleSetStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="50">
        <template slot-scope="scope">
          {{ getGenderNames(scope.row.user) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户类型" width="80">
        <template slot-scope="scope">
          {{ getUserType(scope.row.user) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="120">
        <template slot-scope="scope">
          {{ scope.row.user.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户邮箱" width="160">
        <template slot-scope="scope">
          {{ scope.row.user.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="200">
        <template slot-scope="scope">
          {{ scope.row.user.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.user.createdAt }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.user.updatedAt }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete([scope.row])">删除</el-button>
          <el-button type="text" icon="el-icon-key" size="small" @click="handleResetPwd(scope.row)">重置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改用户' : '新增用户'"
      :close-on-click-modal="false"
      width="570px"
    >
      <el-form ref="userData" :model="userData" :rules="userRules" label-width="80px" label-position="left">
        <div v-show="dialogType === 'new'" style="display: flex;">
          <el-form-item style="margin-right: 20px;" label="账号" prop="passport" label-width="50px">
            <el-input v-model="userData.passport" placeholder="请输入账号" clearable />
          </el-form-item>
          <el-form-item label="密码" prop="password" label-width="50px">
            <el-input v-model="userData.password" placeholder="请输入密码" clearable />
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item style="margin-right: 20px;" label="姓名" prop="realname" label-width="50px">
            <el-input v-model="userData.realname" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item style="margin-left: 10px;" label="昵称" prop="nickname" label-width="40px">
            <el-input v-model="userData.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item style="margin-right: 20px;" label="手机" prop="mobile" label-width="50px">
            <el-input v-model="userData.mobile" placeholder="请输入手机" clearable />
          </el-form-item>
          <el-form-item style="margin-left: 10px;" label="邮箱" prop="email" label-width="40px">
            <el-input v-model="userData.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
        </div>
        <el-form-item label="部门" prop="deptId" label-width="50px">
          <treeselect
            v-model="userData.deptId"
            class="user-treeselect"
            :options="deptsTree"
            :default-expand-level="Infinity"
            placeholder="请选择或搜索部门"
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds" label-width="50px">
          <el-select
            v-model="userData.roleIds"
            placeholder="请选择角色"
            multiple
            clearable
            style="width: 340px;"
            @change="handleChange"
          >
            <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="gender" label="性别" label-width="50px">
          <el-radio-group v-model="userData.gender">
            <el-radio v-for="item in userGenderList" :key="item.value" :label="item.value">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="status" label="状态" label-width="50px">
          <el-radio-group v-model="userData.status">
            <el-radio v-for="item in userStatusList" :key="item.value" :label="item.value">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="isAdmin" label="用户类型" label-width="80px">
          <el-radio-group v-model="userData.isAdmin">
            <el-radio v-for="item in userTypeList" :key="item.value" :label="item.value">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-left: 10px;" label="备注" prop="remark" label-width="50px">
          <el-input
            v-model="userData.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="resetDialogVisible" title="重置密码" :close-on-click-modal="false" width="570px">
      <el-form ref="userData" :model="userData" :rules="resetUserPwdRules" label-position="left">
        <el-form-item>
          <span>{{ getResetPwdHint() }}</span>
        </el-form-item>
        <el-form-item prop="password" label="新密码" label-width="70px">
          <el-input v-model="userData.password" placeholder="请输入密码" clearable />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="resetDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="resetUserPwdConfirmRole">确认</el-button>
      </div>
    </el-dialog>

    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px;"
      :current-page="userForm.curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="userForm.pageSize"
      :disabled="userForm.total <= userForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userForm.total"
      @size-change="handleSizeChange"
      @current-change="handleCurChange"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  deepClone
} from '@/utils'
import {
  formatStartDate,
  formatEndDate
} from '@/utils/time'
import {
  getEnableRoles
} from '@/api/role'
import {
  getDeptTree
} from '@/api/dept'
import {
  getClientOptions,
  getUserList,
  addUser,
  getUserEdit,
  updateUser,
  resetUserPwd,
  setUserStatus,
  deleteUser
} from '@/api/user_manager'

const defaultUser = {
  passport: '',
  password: '',
  realname: '',
  nickname: '',
  deptId: null,
  roleIds: [],
  gender: '1',
  status: '1',
  isAdmin: '0',
  mobile: '',
  email: '',
  remark: ''
}
Object.freeze(defaultUser)
Object.freeze(defaultUser.roleIds)

export default {
  components: {
    Treeselect
  },
  data() {
    const validateRoleIds = (rule, value, callback) => {
      if (this.userData.roleIds.length > 0) {
        callback()
      } else {
        return callback(new Error('角色不能为空'))
      }
    }
    return {
      dates: {
        type: Array,
        default: () => [] // es6的箭头函数
      },
      userForm: {
        deptId: null,
        passport: '',
        realname: '',
        mobile: '',
        status: null,
        startTime: '',
        endTime: '',
        curPage: 1,
        pageSize: 10,
        total: 0
      },
      userStatusList: [],
      userGenderList: [],
      userTypeList: [],
      userFormRules: {
        passport: [{
          pattern: '^[a-zA-Z]\\w{0,18}$',
          message: '账号以字母开头，只能包含字母、数字和下划线且长度不能超过18',
          trigger: 'blur'
        }],
        realname: [{
          pattern: '^[\u4e00-\u9fa5]{0,10}$',
          message: '姓名必须为中文且长度不能超过10',
          trigger: 'blur'
        }],
        mobile: [{
          pattern: '^\\d{0,11}$',
          message: '手机号必须为无符号整数且长度不能超过11',
          trigger: 'blur'
        }]
      },
      userRules: {
        passport: [{
          required: true,
          pattern: '^[a-zA-Z]\\w{0,18}$',
          message: '账号以字母开头，只能包含字母、数字和下划线，长度在6~18之间',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          min: 6,
          max: 18,
          message: '密码为任意可见字符，长度在6~18之间',
          trigger: 'blur'
        }],
        realname: [{
          required: true,
          pattern: '^[\u4e00-\u9fa5]{0,10}$',
          message: '姓名必须为中文且长度不能超过10',
          trigger: 'blur'
        }],
        nickname: [{
          pattern: '^[\u4e00-\u9fa5]{0,20}$',
          message: '昵称必须为中文且长度不能超过20',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          pattern: '^\\d{0,11}$',
          message: '手机号为11位的数字',
          trigger: 'blur'
        }],
        deptId: [{
          required: true,
          message: '部门不能为空',
          trigger: 'blur'
        }],
        roleIds: [{
          type: 'array',
          required: true,
          validator: validateRoleIds
        }],
        gender: [{
          required: true,
          message: '用户性别不能为空',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '用户状态不能为空',
          trigger: 'blur'
        }],
        isAdmin: [{
          required: true,
          message: '用户类型不能为空',
          trigger: 'blur'
        }]
      },
      resetUserPwdRules: {
        password: [{
          required: true,
          min: 6,
          max: 18,
          message: '密码为任意可见字符，长度在6~18之间',
          trigger: 'blur'
        }]
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
      userData: deepClone(defaultUser),
      deptsTree: [],
      usersList: [],
      rolesList: [],
      multipleSelection: [],
      delUsersBtnDisabled: true,
      dialogVisible: false,
      resetDialogVisible: false,
      dialogType: 'new'
    }
  },
  computed: {},
  created() {
    // Mock: get all routes and users list from server
    this.handleClientOptions()
    this.getDeptTree()
    this.handleGetUserList()
  },
  methods: {
    // 表头
    tableHeaderCellStyle() {
      return 'color:#606266;background:#F2F6FC'
    },
    handleChange() {
      this.$forceUpdate()
    },
    // 获取用户管理客户端选项
    handleClientOptions() {
      getClientOptions().then((res) => {
        if (res.data) {
          this.userStatusList = res.data.statusList
          this.userGenderList = res.data.genderList
          this.userTypeList = res.data.userTypeList
        } else {
          this.userStatusList = []
          this.userGenderList = []
          this.userTypeList = []
        }
      }).catch(() => { })
    },
    // 获取角色名称
    getRoleNames(roles) {
      var roleNames = []
      for (const item of roles) {
        roleNames.push(item.name)
      }
      return roleNames.join(', ')
    },
    // 获取性别名称
    getGenderNames(user) {
      var gender = user.gender + ''
      var index = this.userGenderList.findIndex(item => item.value === gender)
      if (index !== -1) {
        return this.userGenderList[index].name
      }
      return ''
    },
    // 获取用户类型
    getUserType(user) {
      var isAdmin = user.isAdmin + ''
      var index = this.userTypeList.findIndex(item => item.value === isAdmin)
      if (index !== -1) {
        return this.userTypeList[index].name
      }
      return ''
    },
    // 获取重置密码提示
    getResetPwdHint() {
      return '请输入"' + this.userData.realname + '"的新密码'
    },
    // 修改时间
    changeDates(dates) {
      if (dates && dates.length >= 2) {
        this.userForm.startTime = formatStartDate(dates[0])
        this.userForm.endTime = formatEndDate(dates[1])
      } else {
        this.userForm.startTime = ''
        this.userForm.endTime = ''
      }
    },
    // 递归处理部门树节点
    getDeptTreeNode(deptList) {
      var list = []
      for (const item of deptList) {
        var treeNode = item.dept
        treeNode.label = item.dept.name
        if (item.children !== undefined && item.children !== null && item.children.length !== 0) {
          treeNode.children = this.getDeptTreeNode(item.children)
        }
        list.push(treeNode)
      }
      return list
    },
    // 获取部门树
    getDeptTree() {
      getDeptTree().then((res) => {
        this.deptsTree = this.getDeptTreeNode(res.data.list)
      }).catch(() => { })
    },
    // 获取用户列表
    handleUsers(curPage) {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.handleGetUserList(curPage)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取用户列表
    handleGetUserList(curPage) {
      var paramsData = deepClone(this.userForm)
      if (curPage) {
        paramsData.curPage = curPage
      }
      getUserList(paramsData).then(res => {
        for (const item of res.data.profileInfoList) {
          item.user.status += ''
        }
        this.usersList = res.data.profileInfoList
        this.userForm.curPage = res.data.curPage
        this.userForm.total = res.data.total
      })
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.userForm.curPage = 1
      this.userForm.pageSize = val
      this.handleUsers()
    },
    // 当前页更改
    handleCurChange(val) {
      this.userForm.curPage = val
      this.handleUsers()
    },
    // 设置用户状态
    handleSetStatus(row) {
      if (row.user.status === '0') {
        this.$confirm('确认要"停用" "' + row.user.realname + '" 用户吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setUserStatus({
            id: row.user.id,
            status: row.user.status
          })
        }).catch(() => {
          row.user.status = '1'
        })
      } else {
        setUserStatus({
          id: row.user.id,
          status: row.user.status
        })
      }
    },
    // 添加
    handleAdd() {
      getEnableRoles().then((res) => {
        this.rolesList = res.data.list
      }).catch(() => { })

      this.userData = deepClone(defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 修改
    handleEdit(row) {
      getUserEdit({
        id: row.user.id
      }).then((res) => {
        this.userData = res.data.user
        this.userData.gender += ''
        this.userData.isAdmin += ''
        this.userData.status += ''
        this.rolesList = res.data.roleList
        this.userData.roleIds = res.data.roleIds
        this.userData.passport = 'a123456'
        this.userData.password = 'a123456'
      }).catch(() => { })

      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 重置密码
    handleResetPwd(row) {
      this.userData = deepClone(defaultUser)
      this.userData.realname = row.user.realname
      this.userData.id = row.user.id
      this.resetDialogVisible = true
    },
    // 重置密码确认
    async resetUserPwdConfirmRole() {
      this.$refs.userData.validate(valid => {
        if (valid) {
          this.handleResetUserPwd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置密码
    async handleResetUserPwd() {
      await resetUserPwd(this.userData).then(() => {
        this.resetDialogVisible = false
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
      }).catch(() => {
        this.resetDialogVisible = false
      })
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delUsersBtnDisabled = false
      } else {
        this.delUsersBtnDisabled = true
      }
    },
    // 删除
    handleDelete(rowList) {
      var idList = []
      var nameList = []
      for (const item of rowList) {
        idList.push(item.user.id)
        nameList.push(item.user.realname)
      }
      var names = nameList.join('; ')
      this.$confirm('确认要"移除" "' + names + '" 用户吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteUser({
          ids: idList
        }).then(() => {
          for (const userId of idList) {
            var index = this.usersList.findIndex(item => item.user.id === userId)
            if (index !== -1) {
              this.usersList.splice(index, 1)
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
      this.$refs.userData.validate(valid => {
        if (valid) {
          this.AddOrEditUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加/修改
    async AddOrEditUser() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateUser(this.userData).then(() => {
          this.dialogVisible = false
          this.handleGetUserList()
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                <div>用户姓名: ${this.userData.realname}</div>
                <div>备注: ${this.userData.remark || '无内容'}</div>
              `,
            type: 'success'
          })
        }).catch(() => {
          this.dialogVisible = false
        })
      } else {
        await addUser(this.userData).then(() => {
          this.dialogVisible = false
          var curPage = parseInt(this.userForm.total / this.userForm.pageSize) + 1
          this.handleGetUserList(curPage)
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                <div>用户姓名: ${this.userData.realname}</div>
                <div>备注: ${this.userData.remark || '无内容'}</div>
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

<style lang="scss" scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}

// 调整treeselect高度和横向滚动条
.user-treeselect {
  width: 340px;
  display: flex;
  margin-right: 20px;
}

::v-deep {
  .vue-treeselect__menu {
    overflow-x: auto !important;
    max-height: 280px !important;
  }

  .vue-treeselect__label {
    overflow: unset;
    text-overflow: unset;
  }

  .vue-treeselect__control {
    height: 20px !important;
  }

  .vue-treeselect__multi-value-item-container,
  .vue-treeselect--has-value .vue-treeselect__multi-value {
    height: 30px;
    line-height: 24px;
    padding: 0;
  }

  .vue-treeselect__limit-tip,
  .vue-treeselect--searchable.vue-treeselect--multi.vue-treeselect--has-value .vue-treeselect__input-container {
    padding-top: 0;
  }

  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    height: 28px;
    line-height: 32px;
    font-size: small;
    color: "#CCCFD6";
  }

  .vue-treeselect--has-value .vue-treeselect__input {
    height: 18px !important;
    line-height: 18px !important;
  }

  .vue-treeselect div,
  .vue-treeselect span {
    box-sizing: content-box;
  }

  // 选中后的溢出隐藏
  .vue-treeselect__multi-value-label {
    display: block;
    width: 140px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .vue-treeselect__value-container {
    display: block;
    height: 32px;
  }
}
</style>
