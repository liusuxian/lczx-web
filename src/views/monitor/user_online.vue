<template>
  <div class="app-container">
    <el-form
      ref="userOnlineForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="userOnlineForm"
      :rules="userOnlineFormRules"
      label-position="left"
    >
      <el-form-item prop="ip" label="登录IP" label-width="60px" style="margin-right: 20px;">
        <el-input
          ref="ip"
          v-model="userOnlineForm.ip"
          placeholder="请输入登录IP"
          name="ip"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-form-item prop="passport" label="用户账号" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="passport"
          v-model="userOnlineForm.passport"
          placeholder="请输入用户账号"
          name="passport"
          type="text"
          tabindex="2"
          clearable
        />
      </el-form-item>
      <el-button
        style="margin-top: 2px; height: 32px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click.native.prevent="handleUserOnlineList(1)"
      >搜索</el-button>
    </el-form>

    <el-button
      :disabled="forceLogoutBtnDisabled"
      type="danger"
      size="small"
      icon="el-icon-delete"
      @click="handleForceLogout(multipleSelection)"
    >强退</el-button>

    <el-table
      :data="userOnlineList"
      style="width: 100%; margin-top:30px;"
      :header-cell-style="tableHeaderCellStyle"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="用户标识" width="300">
        <template slot-scope="scope">
          {{ scope.row.uuid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录账号">
        <template slot-scope="scope">
          {{ scope.row.passport }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览器类型">
        <template slot-scope="scope">
          {{ scope.row.browser }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作系统">
        <template slot-scope="scope">
          {{ scope.row.os }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录ip">
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录时间">
        <template slot-scope="scope">
          {{ scope.row.time }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" size="small" @click="handleForceLogout([scope.row])">强退
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px;"
      :current-page="userOnlineForm.curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="userOnlineForm.pageSize"
      :disabled="userOnlineForm.total <= userOnlineForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userOnlineForm.total"
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
  getUserOnlineList,
  forceLogout
} from '@/api/user_online'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      userOnlineForm: {
        ip: '',
        passport: '',
        curPage: 1,
        pageSize: 10,
        total: 0
      },
      userOnlineFormRules: {
        passport: [{
          pattern: '^[a-zA-Z]\\w{0,18}$',
          message: '账号以字母开头，只能包含字母、数字和下划线且长度不能超过18',
          trigger: 'blur'
        }]
      },
      userOnlineList: [],
      multipleSelection: [],
      forceLogoutBtnDisabled: true
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
    this.handleUserOnlineList()
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
        this.forceLogoutBtnDisabled = false
      } else {
        this.forceLogoutBtnDisabled = true
      }
    },
    // 获取在线用户列表
    handleUserOnlineList(curPage) {
      var paramsData = deepClone(this.userOnlineForm)
      if (curPage) {
        paramsData.curPage = curPage
      }
      getUserOnlineList(paramsData).then((res) => {
        if (res.data.list) {
          this.userOnlineList = res.data.list
        } else {
          this.userOnlineList = []
        }
        this.userOnlineForm.curPage = res.data.curPage
        this.userOnlineForm.total = res.data.total
      }).catch(() => { })
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.userOnlineForm.curPage = 1
      this.userOnlineForm.pageSize = val
      this.handleUserOnlineList()
    },
    // 当前页更改
    handleCurChange(val) {
      this.userOnlineForm.curPage = val
      this.handleUserOnlineList()
    },
    // 强退
    handleForceLogout(rowList) {
      var idList = []
      var nameList = []
      for (const item of rowList) {
        idList.push(item.id)
        nameList.push(item.passport)
      }
      var names = nameList.join('; ')
      this.$confirm('确认要"强退" "' + names + '" 用户吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await forceLogout({
          ids: idList
        }).then(() => {
          for (const id of idList) {
            var index = this.userOnlineList.findIndex(item => item.id === id)
            if (index !== -1) {
              this.userOnlineList.splice(index, 1)
            }
          }
          this.$message({
            type: 'success',
            message: '强退成功!'
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
