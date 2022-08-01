<template>
  <div class="app-container">
    <el-form
      ref="deptForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="deptForm"
      :rules="deptFormRules"
      label-position="left"
    >
      <el-form-item prop="name" label="部门名称" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="name"
          v-model="deptForm.name"
          placeholder="请输入部门名称"
          name="name"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-form-item prop="status" label="部门状态" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="deptForm.status" tabindex="2" placeholder="请选择部门状态" clearable style="width: 150px">
          <el-option v-for="item in deptStatusList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-button
        style="margin-top: 2px; height: 32px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click.native.prevent="handleDepts"
      >搜索</el-button>
    </el-form>

    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>

    <el-table
      :data="deptsList"
      style="width: 100%; margin-top:30px;"
      :header-cell-style="tableHeaderCellStyle"
      row-key="id"
      default-expand-all
      tooltip-effect="light"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column align="left" label="部门名称" width="500">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          {{ getDeptStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人">
        <template slot-scope="scope">
          {{ scope.row.principalName }}
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
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            v-show="scope.row.status === 1"
            type="text"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            v-show="scope.row.parentId !== 0"
            type="text"
            icon="el-icon-delete"
            size="small"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑部门' : '新增部门'"
      :close-on-click-modal="false"
      width="570px"
    >
      <el-form ref="dept" :model="dept" :rules="deptRules" label-width="80px" label-position="left">
        <el-form-item v-show="dept.parentId !== 0" label="上级部门" prop="parentId">
          <treeselect
            v-model="dept.parentId"
            class="dept-treeselect"
            :options="deptsTree"
            :default-expand-level="Infinity"
            placeholder="请选择或搜索上级部门"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="dept.name" placeholder="请输入部门名称" clearable />
        </el-form-item>
        <el-form-item label="负责人" prop="principalUid" label-width="70px" style="margin-left: 10px;">
          <el-select
            v-model="dept.principalUid"
            placeholder="请搜索负责人"
            clearable
            filterable
            remote
            :remote-method="principalRemoteMethod"
            :loading="principalLoading"
            style="width: 170px"
          >
            <el-option v-for="item in principalUserList" :key="item.id" :label="item.realname" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio-group v-model="dept.status">
            <el-radio v-for="item in deptStatusList" :key="item.value" :label="item.value">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDept">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  deepClone
} from '@/utils'
import {
  getClientOptions,
  getDeptList,
  getDeptTree,
  addDept,
  getDept,
  updateDept,
  deleteDept
} from '@/api/dept'
import {
  searchByRealname
} from '@/api/user_manager'

const defaultDept = {
  parentId: null,
  name: '',
  principalUid: null,
  status: '1'
}
Object.freeze(defaultDept)

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      deptForm: {
        name: '',
        status: ''
      },
      deptStatusList: [],
      deptFormRules: {
        name: [{
          pattern: '^[\u4e00-\u9fa5]{0,20}$',
          message: '部门名称必须为中文且长度不能超过20',
          trigger: 'blur'
        }]
      },
      deptRules: {
        parentId: [{
          required: true,
          message: '上级部门不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          pattern: '^[\u4e00-\u9fa5]{0,20}$',
          message: '部门名称必须为中文且长度不能超过20',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '部门状态不能为空',
          trigger: 'blur'
        }]
      },
      dept: deepClone(defaultDept),
      deptsList: [],
      deptsTree: [],
      principalUserList: [],
      principalLoading: false,
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  computed: {},
  created() {
    // Mock: get all routes and roles list from server
    this.handleClientOptions()
    this.handleGetDeptList()
  },
  methods: {
    // 表头
    tableHeaderCellStyle() {
      return 'color: #606266; background: #F2F6FC;'
    },
    // 获取部门管理客户端选项
    handleClientOptions() {
      getClientOptions().then((res) => {
        if (res.data) {
          this.deptStatusList = res.data.statusList
        } else {
          this.deptStatusList = []
        }
      }).catch(() => { })
    },
    // 通过姓名搜索用户
    principalRemoteMethod(query) {
      if (query !== '') {
        this.principalLoading = true
        setTimeout(() => {
          searchByRealname({
            realname: query
          }).then((res) => {
            this.principalLoading = false
            this.principalUserList = res.data.list
          }).catch(() => { })
        }, 200)
      } else {
        this.principalUserList = []
      }
    },
    // 获取部门状态
    getDeptStatus(status) {
      status += ''
      var index = this.deptStatusList.findIndex(item => item.value === status)
      if (index !== -1) {
        return this.deptStatusList[index].name
      }
      return ''
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
    // 获取部门列表
    handleDepts() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          this.handleGetDeptList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取部门列表
    handleGetDeptList() {
      getDeptList(this.deptForm).then((res) => {
        this.deptsList = this.getDeptTreeNode(res.data.list)
      })
    },
    // 添加
    handleAdd(row) {
      getDeptTree().then((res) => {
        this.deptsTree = this.getDeptTreeNode(res.data.list)
      }).catch(() => { })

      this.dept = deepClone(defaultDept)
      if (row) {
        this.dept.parentId = row.id
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.dept = deepClone(defaultDept)
      getDept({
        id: row.id
      }).then((res) => {
        this.dept = res.data.info
        if (res.data.parentIdStatus === 0) {
          this.dept.parentId = null
        }
        if (res.data.info.principalUid === 0) {
          this.dept.principalUid = null
        }
        this.deptsTree = this.getDeptTreeNode(res.data.list)
        this.dept.status += ''
        this.principalUserList = [{
          id: this.dept.principalUid,
          realname: this.dept.principalName
        }]
      }).catch(() => { })

      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认要"移除" "' + row.name + '" 部门吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteDept({
          ids: [row.id]
        }).then(() => {
          this.handleGetDeptList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => { })
      }).catch(() => { })
    },
    // 添加/修改 确认
    async confirmDept() {
      this.$refs.dept.validate(valid => {
        if (valid) {
          this.AddOrEditDept()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加/修改
    async AddOrEditDept() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateDept(this.dept).then(() => {
          this.dialogVisible = false
          this.handleGetDeptList()
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                        <div>部门名称: ${this.dept.name}</div>
                      `,
            type: 'success'
          })
        }).catch(() => {
          this.dialogVisible = false
        })
      } else {
        await addDept(this.dept).then(() => {
          this.dialogVisible = false
          this.handleGetDeptList()
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `
                        <div>部门名称: ${this.dept.name}</div>
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
.dept-treeselect {
  display: flex;
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
