<template>
  <div class="app-container">
    <el-form
      ref="roleForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="roleForm"
      :rules="roleFormRules"
      label-position="left"
    >
      <el-form-item prop="name" label="角色名称" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="name"
          v-model="roleForm.name"
          placeholder="请输入角色名称"
          name="name"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-form-item prop="status" label="角色状态" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="roleForm.status" tabindex="2" placeholder="请选择角色状态" clearable style="width: 150px">
          <el-option v-for="item in roleStatusList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" label-width="70px" style="margin-right: 20px;">
        <el-date-picker
          v-model="dates"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          tabindex="3"
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
        @click.native.prevent="handleRoles(1)"
      >搜索</el-button>
    </el-form>

    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddRole">新增</el-button>
    <el-button
      :disabled="delRolesBtnDisabled"
      type="danger"
      size="small"
      icon="el-icon-delete"
      @click="handleDelete(multipleSelection)"
    >删除</el-button>

    <el-table
      :data="rolesList"
      style="width: 100%; margin-top:30px;"
      :header-cell-style="tableHeaderCellStyle"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="角色ID" width="100">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleSetStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="200">
        <template slot-scope="scope">
          {{ scope.row.updatedAt }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-circle-check" size="small" @click="handleSetDataScope(scope.row)">数据权限
          </el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete([scope.row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改角色' : '新增角色'"
      :close-on-click-modal="false"
      width="570px"
    >
      <el-form ref="role" :model="role" :rules="roleRules" label-width="80px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="role.status">
            <el-radio v-for="item in roleStatusList" :key="item.value" :label="item.value">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单" prop="menuIds">
          <el-tree
            ref="menuTree"
            style="margin-top: 5px;"
            :data="routesData"
            :props="defaultProps"
            node-key="id"
            check-on-click-node
            default-expand-all
            show-checkbox
            check-strictly
            class="permission-tree"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="50px" style="margin-left: 10px;">
          <el-input v-model="role.remark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dataScopeDialogVisible" title="设置数据权限" :close-on-click-modal="false" width="570px">
      <el-form ref="role" :model="role" :rules="dataScopeRules" label-width="80px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="角色名称" disabled />
        </el-form-item>
        <el-form-item label="权限范围" prop="dataScope">
          <el-select v-model="role.dataScope" placeholder="权限范围" style="width: 200px">
            <el-option v-for="item in roleDataScopeList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="role.dataScope === '2'" label="部门" prop="deptIds">
          <el-tree
            ref="roleDeptTree"
            style="margin-top: 5px;"
            :data="roleDeptsData"
            :props="defaultProps"
            node-key="id"
            check-on-click-node
            default-expand-all
            show-checkbox
            check-strictly
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dataScopeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setRoleDataScopeConfirmRole">确认</el-button>
      </div>
    </el-dialog>
    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px;"
      :current-page="roleForm.curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="roleForm.pageSize"
      :disabled="roleForm.total <= roleForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="roleForm.total"
      @size-change="handleSizeChange"
      @current-change="handleCurChange"
    />
  </div>
</template>

<script>
import {
  deepClone
} from '@/utils'
import {
  formatStartDate,
  formatEndDate
} from '@/utils/time'
import {
  getClientOptions,
  getRoleList,
  setRoleStatus,
  setRoleDataScope,
  getRole,
  addRole,
  deleteRole,
  updateRole
} from '@/api/role'
import {
  getMenuTree
} from '@/api/menu'
import {
  getRoleDeptTree
} from '@/api/dept'

const defaultRole = {
  name: '',
  status: '1',
  menuIds: [],
  remark: '',
  dataScope: '3',
  deptIds: []
}
Object.freeze(defaultRole)
Object.freeze(defaultRole.menuIds)
Object.freeze(defaultRole.deptIds)

export default {
  data() {
    const validateDeptIds = (rule, value, callback) => {
      if (this.role.dataScope === '2') {
        if (this.$refs.roleDeptTree) {
          var deptIds = this.$refs.roleDeptTree.getCheckedKeys()
          this.role.deptIds = deptIds
        }
      } else {
        this.role.deptIds = [0]
      }
      if (this.role.deptIds.length > 0) {
        callback()
      } else {
        return callback(new Error('部门不能为空'))
      }
    }
    const validateMenuIds = (rule, value, callback) => {
      if (this.$refs.menuTree) {
        var menuIds = this.$refs.menuTree.getCheckedKeys()
        this.role.menuIds = menuIds
      }
      if (this.role.menuIds.length > 0) {
        callback()
      } else {
        return callback(new Error('菜单不能为空'))
      }
    }
    return {
      dates: {
        type: Array,
        default: () => [] // es6的箭头函数
      },
      roleForm: {
        name: '',
        status: '',
        startTime: '',
        endTime: '',
        curPage: 1,
        pageSize: 10,
        total: 0
      },
      roleStatusList: [],
      roleDataScopeList: [],
      roleFormRules: {
        name: [{
          pattern: '^[\u4e00-\u9fa5]{0,20}$',
          message: '角色名称必须为中文且长度不能超过20',
          trigger: 'blur'
        }]
      },
      roleRules: {
        name: [{
          required: true,
          pattern: '^[\u4e00-\u9fa5]{1,20}$',
          message: '角色名称必须为中文且长度不能超过20',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '角色状态不能为空',
          trigger: 'blur'
        }],
        menuIds: [{
          type: 'array',
          required: true,
          validator: validateMenuIds
        }]
      },
      dataScopeRules: {
        name: [{
          required: true,
          pattern: '^[\u4e00-\u9fa5]{1,20}$',
          message: '角色名称必须为中文且长度不能超过20',
          trigger: 'blur'
        }],
        dataScope: [{
          required: true,
          message: '权限范围不能为空',
          trigger: 'blur'
        }],
        deptIds: [{
          type: 'array',
          required: true,
          validator: validateDeptIds
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
      role: deepClone(defaultRole),
      routes: [],
      roleDepts: [],
      rolesList: [],
      multipleSelection: [],
      delRolesBtnDisabled: true,
      dialogVisible: false,
      dataScopeDialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 0
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    },
    roleDeptsData() {
      return this.roleDepts
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.handleClientOptions()
    this.getMenuTree()
    this.handleGetRoleList()
  },
  methods: {
    // 表头
    tableHeaderCellStyle() {
      return 'color:#606266;background:#F2F6FC'
    },
    // 获取角色管理客户端选项
    handleClientOptions() {
      getClientOptions().then((res) => {
        if (res.data) {
          this.roleStatusList = res.data.statusList
          this.roleDataScopeList = res.data.dataScopeList
        } else {
          this.roleStatusList = []
          this.roleDataScopeList = []
        }
      }).catch(() => { })
    },
    // 修改时间
    changeDates(dates) {
      if (dates && dates.length >= 2) {
        this.roleForm.startTime = formatStartDate(dates[0])
        this.roleForm.endTime = formatEndDate(dates[1])
      } else {
        this.roleForm.startTime = ''
        this.roleForm.endTime = ''
      }
    },
    // 递归处理菜单树节点
    getMenuTreeNode(menuList) {
      var list = []
      for (const item of menuList) {
        var treeNode = {
          label: item.menu.name,
          id: item.menu.id
        }
        if (item.children !== undefined && item.children !== null && item.children.length !== 0) {
          treeNode.children = this.getMenuTreeNode(item.children)
        }
        list.push(treeNode)
      }
      return list
    },
    // 递归处理角色部门树节点
    getRoleDeptTreeNode(deptList) {
      var list = []
      for (const item of deptList) {
        var treeNode = {
          label: item.dept.name,
          id: item.dept.id
        }
        if (item.children !== undefined && item.children !== null && item.children.length !== 0) {
          treeNode.children = this.getRoleDeptTreeNode(item.children)
        }
        list.push(treeNode)
      }
      return list
    },
    // 获取菜单树
    async getMenuTree() {
      await getMenuTree().then(res => {
        this.routes = this.getMenuTreeNode(res.data.list)
      }).catch(() => { })
    },
    // 获取角色列表
    handleRoles(curPage) {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.handleGetRoleList(curPage)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取角色列表
    handleGetRoleList(curPage) {
      var paramsData = deepClone(this.roleForm)
      if (curPage) {
        paramsData.curPage = curPage
      }
      getRoleList(paramsData).then(res => {
        if (res.data.list) {
          for (const item of res.data.list) {
            item.status += ''
          }
          this.rolesList = res.data.list
        } else {
          this.rolesList = []
        }
        this.roleForm.curPage = res.data.curPage
        this.roleForm.total = res.data.total
      })
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.roleForm.curPage = 1
      this.roleForm.pageSize = val
      this.handleRoles()
    },
    // 当前页更改
    handleCurChange(val) {
      this.roleForm.curPage = val
      this.handleRoles()
    },
    // 设置角色状态
    handleSetStatus(row) {
      if (row.status === '0') {
        this.$confirm('确认要"停用" "' + row.name + '" 角色吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setRoleStatus({
            id: row.id,
            status: row.status
          })
        }).catch(() => {
          row.status = '1'
        })
      } else {
        setRoleStatus({
          id: row.id,
          status: row.status
        })
      }
    },
    // 添加
    handleAddRole() {
      this.role = deepClone(defaultRole)
      if (this.$refs.menuTree) {
        this.$refs.menuTree.setCheckedKeys([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 修改
    handleEdit(row) {
      getRole({
        id: row.id
      }).then(res => {
        this.role = res.data.info
        this.role.status += ''
        this.routes = this.getMenuTreeNode(res.data.list)
        this.$refs.menuTree.setCheckedKeys(res.data.menuIds, false)
      }).catch(() => { })

      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 设置数据权限
    handleSetDataScope(row) {
      getRoleDeptTree({
        id: row.id
      }).then((res) => {
        this.roleDepts = this.getRoleDeptTreeNode(res.data.list)
        this.$refs.roleDeptTree.setCheckedKeys(res.data.deptIds, false)
      }).catch(() => { })

      getRole({
        id: row.id
      }).then(res => {
        this.role = res.data.info
        this.role.status += ''
        this.role.dataScope += ''
      }).catch(() => { })

      this.dataScopeDialogVisible = true
    },
    // 设置数据权限确认
    async setRoleDataScopeConfirmRole() {
      this.$refs.role.validate(valid => {
        if (valid) {
          this.handleSetRoleDataScope()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 设置数据权限
    async handleSetRoleDataScope() {
      await setRoleDataScope(this.role).then(() => {
        this.dataScopeDialogVisible = false
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].id === this.role.id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
      }).catch(() => {
        this.dataScopeDialogVisible = false
      })
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.delRolesBtnDisabled = false
      } else {
        this.delRolesBtnDisabled = true
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
      this.$confirm('确认要"移除" "' + names + '" 角色吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteRole({
          ids: idList
        }).then(() => {
          for (const roleId of idList) {
            var index = this.rolesList.findIndex(item => item.id === roleId)
            if (index !== -1) {
              this.rolesList.splice(index, 1)
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
    async confirmRole() {
      this.$refs.role.validate(valid => {
        if (valid) {
          this.AddOrEditRole()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加/修改
    async AddOrEditRole() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateRole(this.role).then(() => {
          this.dialogVisible = false
          for (let index = 0; index < this.rolesList.length; index++) {
            if (this.rolesList[index].id === this.role.id) {
              this.rolesList.splice(index, 1, Object.assign({}, this.role))
              break
            }
          }
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                <div>角色名称: ${this.role.name}</div>
                <div>备注: ${this.role.remark || '无内容'}</div>
              `,
            type: 'success'
          })
        }).catch(() => {
          this.dialogVisible = false
        })
      } else {
        await addRole(this.role).then(() => {
          this.dialogVisible = false
          var curPage = parseInt(this.roleForm.total / this.roleForm.pageSize) + 1
          this.handleGetRoleList(curPage)
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                <div>角色名称: ${this.role.name}</div>
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

<style lang="scss" scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
