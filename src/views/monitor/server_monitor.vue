<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>CPU</span>
          </div>
          <table style="width: 100%;">
            <tr>
              <th align="left">属性</th>
              <th align="left">值</th>
            </tr>
            <tr>
              <td align="left">核心数</td>
              <td align="left">{{ serverInfo.cpuNum }}</td>
            </tr>
            <tr>
              <td align="left">cpu使用率</td>
              <td align="left">{{ serverInfo.cpuUsed }}%</td>
            </tr>
            <tr>
              <td align="left">Load Avg 5</td>
              <td align="left">{{ serverInfo.cpuAvg5 }}%</td>
            </tr>
            <tr>
              <td align="left">Load Avg 15</td>
              <td align="left">{{ serverInfo.cpuAvg15 }}%</td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>内存</span>
          </div>
          <table style="width: 100%;">
            <tr>
              <th align="left">属性</th>
              <th align="left">服务器内存</th>
              <th align="left">本系统使用内存</th>
            </tr>
            <tr>
              <td align="left">总内存</td>
              <td align="left">{{ memorySizeFormat(serverInfo.memTotal) }}</td>
              <td align="left">{{ memorySizeFormat(serverInfo.goTotal) }}</td>
            </tr>
            <tr>
              <td align="left">已用内存</td>
              <td align="left">{{ memorySizeFormat(serverInfo.memUsed) }}</td>
              <td align="left">{{ memorySizeFormat(serverInfo.goUsed) }}</td>
            </tr>
            <tr>
              <td align="left">剩余内存</td>
              <td align="left">{{ memorySizeFormat(serverInfo.memFree) }}</td>
              <td align="left">{{ memorySizeFormat(serverInfo.goFree) }}</td>
            </tr>
            <tr>
              <td align="left">使用率</td>
              <td align="left">{{ serverInfo.memUsage }}%</td>
              <td align="left">{{ serverInfo.goUsage }}%</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header">
            <span>服务器信息</span>
          </div>
          <table style="width: 100%;">
            <tr>
              <td align="left">服务器名称</td>
              <td align="left">{{ serverInfo.serverName }}</td>
              <td align="left">操作系统</td>
              <td align="left">{{ serverInfo.osName }}</td>
            </tr>
            <tr>
              <td align="left">服务器IP</td>
              <td align="left">{{ serverInfo.serverIp }}</td>
              <td align="left">系统架构</td>
              <td align="left">{{ serverInfo.osArch }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header">
            <span>GO信息</span>
          </div>
          <table style="width: 100%;">
            <tr>
              <td align="left">语言环境</td>
              <td align="left">{{ serverInfo.programName }}</td>
              <td align="left">版本</td>
              <td align="left">{{ serverInfo.programVersion }}</td>
            </tr>
            <tr>
              <td align="left">安装路径</td>
              <td align="left">{{ serverInfo.programHome }}</td>
              <td align="left">项目路径</td>
              <td align="left">{{ serverInfo.serverDir }}</td>
            </tr>
            <tr>
              <td align="left">启动时间</td>
              <td align="left">{{ serverInfo.serverStartTime }}</td>
              <td align="left">运行时长</td>
              <td align="left">{{ timeFormat(serverInfo.serverRunTime) }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header">
            <span>磁盘状态</span>
          </div>
          <table style="width: 100%;">
            <tr>
              <th align="left">盘符路径</th>
              <th align="left">文件系统</th>
              <th align="left">总大小</th>
              <th align="left">可用大小</th>
              <th align="left">已用大小</th>
              <th align="left">已用百分比</th>
            </tr>
            <tr v-for="(sysFile, index) in serverInfo.diskList" :key="index">
              <td>{{ sysFile.path }}</td>
              <td>{{ sysFile.fstype }}</td>
              <td>{{ memorySizeFormat(sysFile.total) }}</td>
              <td>{{ memorySizeFormat(sysFile.free) }}</td>
              <td>{{ memorySizeFormat(sysFile.used) }}</td>
              <td>{{ sysFile.usedPercent }}%</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  getServerMonitorInfo
} from '@/api/server_monitor'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      // 加载层信息
      loading: [],
      // 服务器信息
      serverInfo: {},
      runTag: null
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
    this.handleGetServerMonitorInfo()
    this.runTag = setInterval(this.handleGetServerMonitorInfo, 5000)
    this.openLoading()
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
  activated() {
    if (!this.runTag) {
      this.runTag = setInterval(this.handleGetServerMonitorInfo, 5000)
    }
  },
  // 被keep-alive缓存的组件失活时调用
  deactivated() {
    clearInterval(this.runTag)
    this.runTag = null
  },
  // 实例销毁之前调用
  beforeDestroy() { },
  // 实例销毁后调用
  destroyed() {
    clearInterval(this.runTag)
    this.runTag = null
  },
  // 在捕获一个来自后代组件的错误时被调用
  errorCaptured() { },
  // ⽅法集合
  methods: {
    // 获取服务监控信息
    handleGetServerMonitorInfo() {
      getServerMonitorInfo().then((res) => {
        if (res.data.info) {
          this.serverInfo = res.data.info
        }
        this.loading.close()
      }).catch(() => {
        this.loading.close()
      })
    },
    // 打开加载层
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命读取中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    memorySizeFormat(size) {
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
    timeFormat(second) {
      second = parseFloat(second)
      let rank = 0
      let rankChar = '秒'
      while (second > 60 && rankChar !== '小时') {
        second = second / 60
        rank++
        if (rank === 1) {
          rankChar = '分'
        } else if (rank === 2) {
          rankChar = '小时'
        }
      }
      return second.toFixed(2) + ' ' + rankChar
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
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
