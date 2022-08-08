<template>
  <div id="green-disk" class="app-container">
    <!-- 侧边栏区域 -->
    <AsideMenu @treeMenuClick="treeMenuClick" @fastAccess="fastAccess" @fastContextMenu="fastContextMenu" />
    <div style="width: 100%;" @contextmenu="onContextMenu(null, null, $event)">
      <!-- 操作按钮区域 -->
      <div class="operation-menu-wrapper">
        <div>
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-upload">上传</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus">新建文件夹</el-button>
            <el-button type="primary" size="small" icon="el-icon-rank" :disabled="disabled">移动</el-button>
            <el-button type="primary" size="small" icon="el-icon-download" :disabled="disabled">下载</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" :disabled="disabled">删除</el-button>
          </el-button-group>
        </div>
        <div style="display: flex;">
          <div style="margin-right: 10px;">
            <el-input v-model="searchName" placeholder="搜索您的文件" type="text" size="small" maxlength="255" clearable>
              <el-button slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
          </div>
          <div style="margin-right: 10px;">
            <el-radio-group v-model="showType" size="small">
              <el-radio-button label="list"><i class="el-icon-tickets" />列表</el-radio-button>
              <el-radio-button label="grid"><i class="el-icon-s-grid" />网格</el-radio-button>
            </el-radio-group>
          </div>
          <div style="margin-right: 20px;">
            <el-button size="small" icon="el-icon-refresh-right" />
          </div>
        </div>
      </div>
      <!-- 当前位置区域 -->
      <div class="breadcrumb-wrapper">
        <div style="display: flex; align-items: center;">
          <span class="breadcrumb-title">当前位置：</span>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in pathList" :key="index" :to="{ query: { pid: item.id } }">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <span v-show="multipleSelection.length > 0 || fileGridSelectList.length > 0" class="file-select-tips">
          已选中{{ multipleSelection.length || fileGridSelectList.length }}个文件/文件夹
        </span>
      </div>
      <!-- 列表展示区域 -->
      <div v-show="showType === 'list'" class="file-list-wrapper">
        <el-table
          id="file-list-table"
          height="calc(100% - 10px)"
          tooltip-effect="light"
          :data="fileList"
          :row-style="tableRowStyle"
          :header-cell-style="tableHeaderCellStyle"
          :default-sort="{ prop: 'updatedAt', order: 'descending' }"
          @selection-change="handleSelectionChange"
          @row-contextmenu="onContextMenu"
        >
          <el-table-column align="center" type="selection" width="50" />
          <el-table-column align="left" prop="name" label="文件名" sortable :show-overflow-tooltip="true" width="300">
            <template slot-scope="scope">
              <div class="file-list-item">
                <el-image class="file-list-img" :src="getFileImg(scope.row.type)" fit="cover" />
                <div class="file-list-name">{{ scope.row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="size" label="大小" sortable width="160">
            <template slot-scope="scope">
              {{ fileSizeFormat(scope.row.size) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="type" label="类型" sortable width="160">
            <template slot-scope="scope">
              {{ getFileType(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="updatedAt" label="修改时间" sortable width="200">
            <template slot-scope="scope">
              {{ scope.row.updatedAt }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 网格展示区域 -->
      <div v-show="showType === 'grid'" class="file-grid-wrapper">
        <el-checkbox v-model="selectAllFile" style="margin-left: 20px;" @change="handleCheckChange">
          全部文件
        </el-checkbox>
        <vue-drag-select
          ref="dragSelect"
          v-model="fileGridSelectList"
          value-key="id"
          :item-width="120"
          :item-height="130"
          :item-margin="[0, 0, 0, 0]"
        >
          <template v-for="(item, index) in fileList">
            <drag-select-option :key="item.id" :value="item" :item-index="index">
              <div
                :class="isFileGridSelect(item) ? 'file-grid-item-select' : 'file-grid-item'"
                @contextmenu="onContextMenu(item, null, $event)"
              >
                <div class="file-grid-img-border" :class="{ 'file-grid-img-border-select': isFileGridSelect(item) }">
                  <el-image class="file-grid-img" :src="getFileImg(item.type)" fit="cover" />
                </div>
                <div class="file-grid-name" :class="{ 'file-grid-name-select': isFileGridSelect(item) }">
                  {{ item.name }}
                </div>
              </div>
            </drag-select-option>
          </template>
        </vue-drag-select>
      </div>
      <!-- 底部分页栏区域 -->
      <div class="bottom-pagination-wrapper">
        <el-pagination
          :current-page="fileInfo.curPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="fileInfo.pageSize"
          :disabled="fileInfo.total <= fileInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="fileInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import AsideMenu from './components/AsideMenu/AsideMenu'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    AsideMenu
  },
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      showType: 'list', // 展现形式
      selectAllFile: false, // 是否选择全部文件
      searchName: '', // 搜索文件或文件夹名称
      pathList: [
        {
          id: 0,
          name: '咨询公司'
        },
        {
          id: 1,
          name: '招投标'
        }
      ], // 路径列表
      fileList: [
        {
          id: 1,
          name: '咨询公司',
          size: 54000,
          updatedAt: '2022-07-29 16:00:00'
        },
        {
          id: 2,
          name: '联盟公司',
          size: 54001,
          updatedAt: '2022-07-29 16:00:01'
        },
        {
          id: 3,
          name: '未来社区公司',
          size: 54002,
          updatedAt: '2022-07-29 16:00:02'
        },
        {
          id: 4,
          name: '未来社区公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司公司',
          size: 54003,
          updatedAt: '2022-07-29 16:00:03'
        },
        {
          id: 5,
          name: '未来社区公司',
          size: 54004,
          updatedAt: '2022-07-29 16:00:04'
        },
        {
          id: 6,
          name: '未来社区公司',
          size: 54005,
          updatedAt: '2022-07-29 16:00:05'
        },
        {
          id: 7,
          name: '未来社区公司',
          size: 54006,
          updatedAt: '2022-07-29 16:00:06'
        },
        {
          id: 8,
          name: '未来社区公司',
          size: 54007,
          updatedAt: '2022-07-29 16:00:07'
        },
        {
          id: 9,
          name: '未来社区公司',
          size: 54008,
          updatedAt: '2022-07-29 16:00:08'
        },
        {
          id: 10,
          name: '未来社区公司',
          size: 54009,
          updatedAt: '2022-07-29 16:00:09'
        }
      ], // 文件列表
      multipleSelection: [],
      disabled: true, // 按钮禁用状态
      fileInfo: {
        curPage: 1,
        pageSize: 10,
        total: 0
      }, // 文件信息
      fileGridSelectList: [], // 文件网格被选中列表
      pageDom: null // 整个页面区域的dom信息
    }
  },
  // 计算属性类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 在实例初始化之后,进行数据侦听和事件/侦听器的配置之前同步调用
  beforeCreate() { },
  // 在实例创建完成后被立即同步调用（可以访问当前this实例）
  created() { },
  // 在挂载开始之前被调用
  beforeMount() { },
  // 实例被挂载后调用（可以访问DOM元素）
  mounted() {
    this.pageDom = document.getElementById('green-disk')
  },
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
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 选中复选框表格变色
    tableRowStyle({ row, rowIndex }) {
      const checkIdList = this.multipleSelection.map((item) => item.id)
      const tableNode = document.getElementById('file-list-table')
      if (checkIdList.includes(row.id)) {
        if (tableNode) {
          const targetRow = tableNode.getElementsByClassName('el-table__body-wrapper')[0].getElementsByTagName('tbody')[0].children[rowIndex]
          targetRow.classList.add('file-list-table-row')
        }
        return {
          color: 'white',
          backgroundColor: '#1FA9FC'
        }
      } else {
        if (tableNode) {
          const targetRow = tableNode.getElementsByClassName('el-table__body-wrapper')[0].getElementsByTagName('tbody')[0].children[rowIndex]
          if (targetRow.classList.contains('file-list-table-row')) {
            targetRow.classList.remove('file-list-table-row')
          }
        }
      }
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.fileInfo.curPage = 1
      this.fileInfo.pageSize = val
    },
    // 当前页更改
    handleCurChange(val) {
      this.fileInfo.curPage = val
    },
    // 格式化文件大小
    fileSizeFormat(size) {
      size = parseFloat(size)
      let rank = 0
      let rankChar = 'Bytes'
      while (size > 1024 && rankChar !== 'GB') {
        size = size / 1024
        rank++
        if (rank === 1) {
          rankChar = 'KB'
        } else if (rank === 2) {
          rankChar = 'MB'
        } else if (rank === 3) {
          rankChar = 'GB'
        }
      }
      return size.toFixed(2) + ' ' + rankChar
    },
    // 获取文件图片
    getFileImg(type) {
      return require('../../assets/images/file/dir.png')
    },
    // 获取文件类型
    getFileType(type) {
      return '文件夹'
    },
    // 右键菜单
    onContextMenu(row, column, event) {
      event.preventDefault() // 不能阻止冒泡，但是可以阻止默认事件
      event.stopPropagation() // 会阻止冒泡事件，但是不会阻止默认事件
      if (!row && this.pageDom.contains(event.target)) {
        this.$contextmenu({
          items: [
            {
              label: '上传',
              onClick: () => {
                console.log('上传: ')
              }
            },
            {
              label: '新建文件夹',
              divided: true,
              onClick: () => {
                console.log('新建文件夹: ')
              }
            },
            {
              label: '刷新',
              onClick: () => {
                console.log('刷新: ')
              }
            }
          ],
          event,
          customClass: 'custom-class',
          zIndex: 3,
          minWidth: 100
        })
      } else if (row) {
        this.$contextmenu({
          items: [
            {
              label: '打开',
              onClick: () => {
                console.log('打开: ', row)
              }
            },
            {
              label: '下载',
              divided: true,
              onClick: () => {
                console.log('下载: ', row)
              }
            },
            {
              label: '权限',
              onClick: () => {
                console.log('分享: ', row)
              }
            },
            {
              label: '分享',
              divided: true,
              disabled: true,
              onClick: () => {
                console.log('分享: ', row)
              }
            },
            {
              label: '移动到',
              onClick: () => {
                console.log('移动到: ', row)
              }
            },
            {
              label: '复制到',
              divided: true,
              onClick: () => {
                console.log('复制到: ', row)
              }
            },
            {
              label: '删除',
              onClick: () => {
                console.log('删除: ', row)
              }
            },
            {
              label: '重命名',
              onClick: () => {
                console.log('重命名: ', row)
              }
            }
          ],
          event,
          customClass: 'custom-class',
          zIndex: 3,
          minWidth: 100
        })
      }
      return false
    },
    // 文件网格是否被选中
    isFileGridSelect(val) {
      if (this.fileGridSelectList.length === 0) {
        if (this.selectAllFile) {
          this.selectAllFile = false
        }
        return false
      }
      var index = this.fileGridSelectList.findIndex(item => item.id === val.id)
      return index !== -1
    },
    // 选择/取消所有文件
    handleCheckChange(val) {
      if (val) {
        this.fileGridSelectList = this.fileList
      } else {
        this.fileGridSelectList = []
      }
    },
    // 点击菜单树菜单
    treeMenuClick(data) {
      console.log('treeMenuClick: ', data)
    },
    // 快捷访问点击快速访问
    fastAccess(data) {
      console.log('fastAccess: ', data)
    },
    // 快捷访问右键菜单
    fastContextMenu(data, event) {
      console.log('fastContextMenu: ', data, event)
    }
  }
}
</script>

<style lang='scss'>
// 去掉表格单元格边框
#file-list-table th {
  border: none;
}

#file-list-table td,
#file-list-table th.is-leaf {
  border: none;
}

// 表格最外边框
.el-table--border,
.el-table--group {
  border: none;
}

// 表格最外层边框-底部边框
.el-table--border::after,
.el-table--group::after {
  width: 0;
}

#file-list-table::before {
  width: 0;
}

#file-list-table .el-table__fixed-right::before,
.el-table__fixed::before {
  width: 0;
}

// 表格有滚动时表格头边框
.el-table--border th.gutter:last-of-type {
  border: 1px solid #EBEEF5;
  border-left: none;
}

// 选中行鼠标hover效果
.file-list-table-row:hover>td {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
<style lang='scss' scoped>
.app-container {
  display: flex;

  .permission-tree {
    margin-bottom: 30px;
  }
}

.operation-menu-wrapper {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-bottom: 20px;
}

.breadcrumb-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 20px;
}

.breadcrumb-title {
  font-size: 14px;
  padding-bottom: 2px;
}

.file-list-wrapper {
  width: calc(100% - 40px);
  height: calc(100vh - 250px);
  margin-left: 20px;
  margin-top: 20px;
}

.file-list-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.file-list-img {
  width: 30px;
  height: 30px;
}

.file-list-name {
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;
  width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-grid-wrapper {
  margin-top: 20px;
  margin-right: 40px;
}

::v-deep {
  .select-wrapper {
    height: calc(100vh - 269px);
  }
}

.file-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
}

.file-grid-item:hover {
  background-color: #F8F8F8;
}

.file-grid-item-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  background-color: #F1FAFF;
}

.file-grid-item-select:hover {
  background-color: #FFFFFF;
}

.file-grid-img-border {
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 4px;
}

.file-grid-img-border-select {
  background-color: #EEEEEE;
}

.file-grid-img {
  width: 60px;
  height: 60px;
}

.file-grid-name {
  width: 100px;
  height: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  text-align: center;
  margin: 10px 10px 10px 10px;
  font-size: 14px;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-grid-name-select {
  color: white;
  background-color: #1FA9FC;
}

.file-select-tips {
  font-size: 14px;
  color: #606266;
  margin-right: 20px;
}

.bottom-pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-left: 20px;
  border-top: 1px solid #DCDFE6;
}
</style>
