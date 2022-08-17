<template>
  <el-container>
    <el-main>
      <el-card shadow="hover">
        <!-- 搜索区域 -->
        <div class="report-search-wrapper">
          <el-form ref="reportForm" :model="reportForm">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <el-form-item prop="reportName" label="报告名称" label-width="70px">
                  <el-input v-model="reportForm.reportName" placeholder="请输入报告名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <el-form-item prop="projectName" label="项目名称" label-width="70px">
                  <el-input v-model="reportForm.projectName" placeholder="请输入项目名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <el-form-item prop="typeId" label="专业类别" label-width="70px">
                  <el-select v-model="reportForm.typeId" placeholder="请选择专业类别" clearable>
                    <el-option v-for="item in reportTypeCfgList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <el-form-item prop="excellence" label="是否优秀报告" label-width="100px">
                  <el-select v-model="reportForm.excellence" placeholder="请选择是否优秀报告" clearable>
                    <el-option v-for="item in exStatusList" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click.stop="handleGetReportList(1)">
                    搜索
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 报告卡片区域 -->
        <div class="report-card-wrapper">
          <el-row :gutter="20">
            <el-col v-for="(item, index) in reportList" :key="index" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <div class="report-card-item">
                <div class="report-card-item-box" @click.stop="handleReportPage(item)">
                  <div class="report-img">
                    <img :src="reportImg">
                  </div>
                  <div class="report-info">
                    <div @mouseover="isShowTooltip('refReportName' + index)">
                      <el-tooltip :disabled="showTooltip" effect="light" :content="getReportName(item)" placement="top">
                        <div class="report-name">
                          <span :ref="'refReportName' + index">{{ getReportName(item) }}</span>
                        </div>
                      </el-tooltip>
                    </div>
                    <div class="report-info-item">
                      <div style="width: 70px; white-space: nowrap;">
                        <svg-icon icon-class="project1" />项目名称
                      </div>
                      <div
                        style="margin-left: 20px;"
                        @mouseover="isShowTooltip('refReportProject' + index)"
                        @click.stop="handleProjectPage(item)"
                      >
                        <el-tooltip
                          :disabled="showTooltip"
                          effect="light"
                          :content="item.report.projectName"
                          placement="top"
                        >
                          <div class="report-info-item-val report-project">
                            <span :ref="'refReportProject' + index">{{ item.report.projectName }}</span>
                          </div>
                        </el-tooltip>
                      </div>
                    </div>
                    <div class="report-info-item">
                      <div style="width: 70px; white-space: nowrap;">
                        <svg-icon icon-class="classification" />专业类别
                      </div>
                      <div style="margin-left: 20px;" @mouseover="isShowTooltip('refReportType' + index)">
                        <el-tooltip
                          :disabled="showTooltip"
                          effect="light"
                          :content="getReportType(item)"
                          placement="top"
                        >
                          <div class="report-info-item-val">
                            <span :ref="'refReportType' + index">{{ getReportType(item) }}</span>
                          </div>
                        </el-tooltip>
                      </div>
                    </div>
                    <div class="report-info-item">
                      <div style="width: 98px; white-space: nowrap;">
                        <svg-icon icon-class="excellence" />是否优秀报告
                      </div>
                      <div v-show="item.report.excellence === 2" style="color: orangered;">
                        {{ getIsExcellenceReport(item) }}
                      </div>
                      <div v-show="item.report.excellence === 1" style="color: forestgreen;">
                        {{ getIsExcellenceReport(item) }}
                      </div>
                      <div v-show="item.report.excellence === 0">
                        {{ getIsExcellenceReport(item) }}
                      </div>
                    </div>
                    <div class="report-info-item">
                      <div style="width: 56px; white-space: nowrap;">
                        <svg-icon icon-class="user1" />上传者
                      </div>
                      <div>{{ item.report.createName }}</div>
                    </div>
                    <div class="report-info-item">
                      <div style="width: 70px; white-space: nowrap;">
                        <svg-icon icon-class="date" />上传时间
                      </div>
                      <div>{{ item.report.createdAt }}</div>
                    </div>
                    <div class="report-info-item report-info-item-end">
                      <div style="width: 98px; white-space: nowrap;">
                        <svg-icon icon-class="operation" />评选优秀报告
                      </div>
                      <div>
                        <el-button
                          class="report-choiceness-button"
                          :disabled="item.report.excellence !== 1"
                          type="text"
                          @click.stop="handleChoose(item, 2)"
                        >
                          是
                        </el-button>
                        <el-button
                          class="report-choiceness-button"
                          :disabled="item.report.excellence !== 1"
                          type="text"
                          @click.stop="handleChoose(item, 0)"
                        >
                          否
                        </el-button>
                      </div>
                    </div>
                  </div>
                  <div class="report-edit">
                    <el-button class="report-edit-button" disabled type="text" @click.stop="handleEdit(item)">
                      编辑
                    </el-button>
                    <el-button class="report-edit-button" type="text" @click.stop="handleDownload(item)">
                      下载
                    </el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 底部分页栏区域 -->
        <div class="bottom-pagination-wrapper">
          <el-pagination
            :current-page="reportForm.curPage"
            :page-sizes="[12, 24, 36, 48, 60]"
            :page-size="reportForm.pageSize"
            :disabled="reportForm.total <= reportForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="reportForm.total"
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurChange"
          />
        </div>
      </el-card>
    </el-main>
  </el-container>
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
        excellence: '', // 是否是优秀报告
        typeId: null, // 报告类型ID
        reportName: '', // 报告名称
        projectName: '', // 所属项目名称
        sortName: '', // 排序字段
        sortOrder: '', // 排序方式
        curPage: 1, // 当前页码
        pageSize: 12, // 每页数量
        total: 0 // 数据总量
      }, // 报告查询表单
      exStatusList: [], // 是否是优秀报告选项列表
      reportTypeCfgList: [], // 报告类型配置信息列表
      reportList: [], // 报告信息列表
      showTooltip: true // 是否开启tooltip功能
    }
  },
  // 计算属性类似于data概念
  computed: {
    // 报告背景图片
    reportImg() {
      return require('../../assets/images/report/report_background.png')
    }
  },
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
    // 是否开启tooltip功能
    isShowTooltip(refName) {
      var parentHeight = this.$refs[refName][0].parentNode.offsetHeight
      var contentHeight = this.$refs[refName][0].offsetHeight
      // 判断是否开启tooltip功能
      if (contentHeight > parentHeight) {
        this.showTooltip = false
      } else {
        this.showTooltip = true
      }
    },
    // 获取报告管理客户端选项
    handleClientOptions() {
      getClientOptions().then((res) => {
        if (res.data) {
          this.exStatusList = res.data.excellenceStatusList
        } else {
          this.exStatusList = []
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
          this.reportList = dataList
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
      var index = this.exStatusList.findIndex(item => item.value === excellence)
      if (index !== -1) {
        return this.exStatusList[index].name
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
.report-search-wrapper {
  margin-bottom: 10px;
}

.report-card-item {
  width: 100%;
  height: 480px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.report-card-item-box {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  border: 1px solid #DCDFE6;
}

.report-card-item-box:hover {
  cursor: pointer;
  border: 1px solid #409EFF;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.report-img {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.report-img img {
  width: 100%;
  height: 100%;
}

.report-info {
  display: flex;
  flex-direction: column;
  padding: 15px;
  font-size: 14px;
  color: #666666;
  overflow: hidden;
}

.report-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 33px;
  margin-bottom: 8px;
}

.report-name:hover {
  text-decoration: underline;
  transition: all 0.3s ease;
}

.report-card-item-box:hover .report-img img {
  transform: translateZ(0) scale(1.05);
  transition: all 0.3s ease;
}

.report-card-item-box:hover .report-name {
  color: #1890ff;
  transition: all 0.3s ease;
}

.report-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
  border-top: 1px solid #DCDFE6;
}

.report-info-item-val {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.report-project {
  color: #1890ff;
}

.report-project:hover {
  text-decoration: underline;
  transition: all 0.3s ease;
}

.report-info-item-end {
  border-bottom: 1px solid #DCDFE6;
}

::v-deep {
  .report-choiceness-button {
    padding: 0;
  }

  .report-edit-button {
    padding: 0;
  }
}

.report-edit {
  padding-left: 15px;
  padding-right: 15px;
  float: right;
}

.bottom-pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  border-top: 1px solid #DCDFE6;
}
</style>
