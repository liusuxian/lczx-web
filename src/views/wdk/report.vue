<template>
  <div class="app-container">
    <el-form
      ref="reportForm"
      style="display: flex; margin-bottom: 20px; flex-wrap: wrap;"
      :model="reportForm"
      label-position="left"
    >
      <el-form-item prop="reportName" label="报告名称" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="reportName"
          v-model="reportForm.reportName"
          placeholder="请输入报告名称"
          name="reportName"
          type="text"
          tabindex="1"
          clearable
        />
      </el-form-item>
      <el-form-item prop="projectName" label="项目名称" label-width="70px" style="margin-right: 20px;">
        <el-input
          ref="projectName"
          v-model="reportForm.projectName"
          placeholder="请输入项目名称"
          name="projectName"
          type="text"
          tabindex="2"
          clearable
        />
      </el-form-item>
      <el-form-item prop="typeId" label="专业类别" label-width="70px" style="margin-right: 20px;">
        <el-select v-model="reportForm.typeId" tabindex="3" placeholder="请选择专业类别" clearable style="width: 180px">
          <el-option v-for="item in reportTypeCfgList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="excellence" label="是否优秀报告" label-width="100px" style="margin-right: 20px;">
        <el-select v-model="reportForm.excellence" tabindex="4" placeholder="请选择是否优秀报告" clearable style="width: 180px">
          <el-option v-for="item in excellenceStatusList" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-button
        style="margin-top: 2px; height: 32px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click.native.prevent="handleGetReportList(1)"
      >搜索</el-button>
    </el-form>

    <el-row v-for="(itemList, index) in reportList" :key="index" :gutter="20">
      <el-col v-for="(item, subIndex) in itemList" :key="subIndex" :span="6">
        <el-card>
          <div slot="header" class="report_title" @click="handleReportPage(item)">
            {{ getReportName(item) }}
          </div>
          <ul class="list-group list-group-striped">
            <li class="list-group-item">
              <div class="list-group-item-title">
                <svg-icon icon-class="project1" />项目名称
              </div>
              <div class="pull-right">
                <div
                  style="cursor: pointer; color: #1890ff;"
                  class="pull-right-content"
                  @click="handleProjectPage(item)"
                >{{ item.report.projectName }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="list-group-item-title">
                <svg-icon icon-class="classification" />专业类别
              </div>
              <div class="pull-right">
                <div class="pull-right-content">{{ getReportType(item) }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="list-group-item-title">
                <svg-icon icon-class="excellence" />是否优秀报告
              </div>
              <div class="pull-right">
                <div v-show="item.report.excellence === 2" style="color: orangered;" class="pull-right-content">
                  {{ getIsExcellenceReport(item) }}
                </div>
                <div v-show="item.report.excellence === 1" style="color: forestgreen;" class="pull-right-content">
                  {{ getIsExcellenceReport(item) }}
                </div>
                <div v-show="item.report.excellence === 0" class="pull-right-content">
                  {{ getIsExcellenceReport(item) }}
                </div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="list-group-item-title">
                <svg-icon icon-class="user1" />上传者
              </div>
              <div class="pull-right">
                <div class="pull-right-content">{{ item.report.createName }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="list-group-item-title">
                <svg-icon icon-class="date" />上传时间
              </div>
              <div class="pull-right">
                <div class="pull-right-content">{{ item.report.createdAt }}</div>
              </div>
            </li>
            <li class="list-group-item">
              <div class="list-group-item-title">
                <svg-icon icon-class="operation" />评选优秀报告
              </div>
              <div class="pull-right">
                <div class="pull-right-content">
                  <el-button
                    :disabled="item.report.excellence !== 1"
                    class="pull-right-button"
                    type="text"
                    @click="handleChoose(item, 2)"
                  >是</el-button>
                  <el-button
                    :disabled="item.report.excellence !== 1"
                    class="pull-right-button"
                    type="text"
                    @click="handleChoose(item, 0)"
                  >否</el-button>
                </div>
              </div>
            </li>
          </ul>
          <div class="pull-right">
            <div style="margin-right: 10px; margin-bottom: 10px;" class="pull-right-content">
              <el-button disabled type="text" @click="handleEdit(item)">编辑</el-button>
              <el-button type="text" @click="handleDownload(item)">下载</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px;"
      :current-page="reportForm.curPage"
      :page-sizes="[12, 24, 36, 48, 60]"
      :page-size="reportForm.pageSize"
      :disabled="reportForm.total <= reportForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="reportForm.total"
      @size-change="handleSizeChange"
      @current-change="handleCurChange"
    />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  downloadByUrl
} from '@/utils/download'
import {
  deepClone
} from '@/utils'
import {
  getAllReportTypeCfg
} from '@/api/wdk_report_type_cfg'
import {
  getClientOptions,
  getReportList,
  chooseExcellence,
  downloadReport
} from '@/api/wdk_report'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      reportForm: {
        excellence: '',
        typeId: null,
        reportName: '',
        projectName: '',
        sortName: '',
        sortOrder: '',
        curPage: 1,
        pageSize: 12,
        total: 0
      },
      excellenceStatusList: [],
      reportTypeCfgList: [],
      reportList: []
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
    this.handleGetAllReportTypeCfg()
    this.handleGetReportList()
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
    // 获取报告管理客户端选项
    handleClientOptions() {
      getClientOptions().then((res) => {
        if (res.data) {
          this.excellenceStatusList = res.data.excellenceStatusList
        } else {
          this.excellenceStatusList = []
        }
      }).catch(() => { })
    },
    // 获取全部报告类型配置信息列表
    handleGetAllReportTypeCfg() {
      getAllReportTypeCfg().then((res) => {
        if (res.data.list) {
          for (const item of res.data.list) {
            this.reportTypeCfgList.push({
              id: item.reportCfg.id,
              name: item.reportCfg.name
            })
          }
        } else {
          this.reportTypeCfgList = []
        }
      })
    },
    // 获取文档库报告列表
    handleGetReportList(curPage) {
      var paramsData = deepClone(this.reportForm)
      if (curPage) {
        paramsData.curPage = curPage
      }
      getReportList(paramsData).then((res) => {
        this.reportList = []
        var dataList = res.data.list
        if (dataList) {
          var tmpList = []
          for (let i = 0; i < dataList.length; i++) {
            tmpList.push(dataList[i])
            if ((i + 1) % 4 === 0) {
              this.reportList.push(tmpList)
              tmpList = []
            }
          }
          if (tmpList.length > 0) {
            this.reportList.push(tmpList)
          }
        }
        this.reportForm.curPage = res.data.curPage
        this.reportForm.total = res.data.total
      }).catch(() => { })
    },
    // 每页记录数更改
    handleSizeChange(val) {
      this.reportForm.curPage = 1
      this.reportForm.pageSize = val
      this.handleGetReportList()
    },
    // 当前页更改
    handleCurChange(val) {
      this.reportForm.curPage = val
      this.handleGetReportList()
    },
    // 获取报告名称
    getReportName(val) {
      var tmpCnt = val.report.name.lastIndexOf('.')
      return val.report.name.substring(0, tmpCnt)
    },
    // 报告查看
    handleReportPage(val) {
      var tmpCnt = val.report.name.lastIndexOf('.')
      var name = val.report.name.substring(0, tmpCnt)
      this.$router.push({
        name: 'WdkReportPage',
        query: {
          pdfName: name,
          pdfUrl: val.report.pdfUrl,
          reportId: val.report.id,
          excellence: val.report.excellence + ''
        }
      })
    },
    // 进入项目管理页
    handleProjectPage(val) {
      this.$router.push({
        name: 'WdkProject',
        query: {
          id: val.report.projectId
        }
      })
    },
    // 获取报告专业类别
    getReportType(val) {
      var typeList = []
      for (const item of val.reportType) {
        typeList.push(item.typeName)
      }
      return typeList.join(' | ')
    },
    // 获取是否优秀报告
    getIsExcellenceReport(val) {
      var excellence = val.report.excellence + ''
      var index = this.excellenceStatusList.findIndex(item => item.value === excellence)
      if (index !== -1) {
        return this.excellenceStatusList[index].name
      }
      return ''
    },
    // 评选优秀报告
    handleChoose(val, excellence) {
      var message = this.getReportName(val) + '"为优秀报告吗？'
      if (excellence === 2) {
        message = '确认要选择"' + message
      } else {
        message = '确认要放弃"' + message
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await chooseExcellence({
          id: val.report.id,
          excellence: excellence
        }).then(() => {
          val.report.excellence = excellence
          this.$message({
            type: 'success',
            message: '评选优秀报告操作成功!'
          })
        }).catch(() => { })
      }).catch(() => { })
    },
    // 编辑
    handleEdit(val) {
      console.log('handleEdit: ', val)
    },
    // 下载
    handleDownload(val) {
      downloadReport({ filePath: val.report.originUrl }).then((res) => {
        downloadByUrl(res.data.fileUrl, val.report.name)
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

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-card ::v-deep .el-card__header {
  padding: 0px 0px;
  background-color: #409EFF;
}

.el-card ::v-deep .el-card__body {
  padding: 0px 10px;
}

.report_title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 10px;
  height: 100px;
  cursor: pointer;
  color: #FFFFFF;
}

.report_title:hover {
  background-color: #1890ff;
}

.list-group-striped>.list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.list-group {
  padding-left: 0px;
  list-style: none;
}

.list-group-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 10px 0px;
  font-size: 13px;
}

.list-group-item-title {
  display: inline-block;
  white-space: nowrap;
}

.pull-right {
  width: 100%;
  margin-left: 10px;
}

.pull-right-content {
  float: right !important;
}

.pull-right-button {
  padding: 0px 0px;
}
</style>
