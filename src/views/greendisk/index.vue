<template>
  <div class="app-container">
    <wlExplorer
      ref="wl-explorer-cpt"
      :header-dropdown="headerHandle"
      :upload-options="uploadOptions"
      :columns="fileTableColumns"
      :all-path="allFolderList"
      :is-folder-fn="isFolderFn"
      :folder-type="sourceType"
      :data="fileTableData"
      :props="explorerProps"
      size="small"
      @handleFolder="handleFolder"
      @upload="fileUpload"
      @download="download"
      @search="fileSearch"
      @del="fileDel"
      @closeFade="closeOtherLayout(fade)"
    />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  closeOtherLayout
} from 'wl-explorer' // 导入关闭其他弹出类视图函数

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {},
  // 数据
  data() {
    const _GB = 1024 * 1024
    // 这⾥存放数据
    return {
      load: {
        folder: false
      }, // loading管理
      fade: {
        folder: false
      }, // 弹出类视图管理
      headerHandle: [
        {
          name: '权限',
          command: 'auth'
        }
      ], // 头部按钮更多操作自定义菜单
      uploadOptions: {
        aa: 1212
      }, // 上传文件附加参数
      fileTableColumns: [
        {
          label: '名称',
          prop: 'Name',
          minWidth: 120
        },
        {
          label: '修改日期',
          align: 'center',
          width: 120,
          formatter(row) {
            return row.EditTime.split('T')[0] || '-'
          }
        },
        {
          label: '类型',
          align: 'center',
          width: 90,
          formatter(row) {
            return row.Type === 1 ? '文件夹' : row.SuffixName
          }
        },
        {
          label: '大小',
          minWidth: 90,
          align: 'center',
          formatter(row) {
            if (row.Size === null) {
              return '-'
            }
            if (row.Size < 1024) {
              // 1024以下显示kb
              return row.Size + 'KB'
            }
            if (row.Size < _GB) {
              // 1024*1024
              const _mb = (row.Size / 1024).toFixed(2)
              return parseFloat(_mb) + 'MB'
            }
            const _gb = (row.Size / _GB).toFixed(2)
            return parseFloat(_gb) + 'GB'
          }
        },
        {
          label: '创建日期',
          align: 'center',
          width: 120,
          formatter(row) {
            return row.CreateTime.split('T')[0] || '-'
          }
        },
        {
          label: '作者',
          minWidth: 100,
          align: 'center',
          formatter(row) {
            return row.CreateUserName || '-'
          }
        },
        {
          label: '描述',
          minWidth: 100,
          formatter(row) {
            return row.Describe || '-'
          }
        }
      ], // 自定义表格列
      allFolderList: [], // 所有文件夹列表
      type: {
        folder: 1,
        img: 2,
        video: 3,
        other: 4
      }, // 文件类型
      sourceType: {
        self: 1 // 自建
      }, // 数据来源类型
      fileTableData: [], // 表格数据
      explorerProps: {
        name: 'Name',
        match: 'Name',
        splic: true,
        suffix: 'SuffixName',
        pathId: 'Id',
        pathPid: 'ParentId',
        pathName: 'Name',
        pathChildren: 'Children', // String 路径数据 children字段
        pathConnector: '\\', // String 路径父子数据拼接连接符,默认为'\'
        pathParents: 'Parents', // String 路径数据所有直系祖先节点自增长identityId逗号拼接
        pathIdentityId: 'IdentityId' // String 路径数据自增长id
      }, // 文件管理器配置项
      path: {}, // 路径数据
      folder_form: {
        ParentId: '',
        Name: '',
        preview: [],
        handle: [],
        Describe: ''
      }, // 文件夹表单
      folder_rules: {
        ParentId: [
          { required: true, message: '请选择文件路径', trigger: 'blur' }
        ],
        Name: [
          { required: true, message: '请填写文件夹名称', trigger: 'blur' }
        ]
      } // 文件夹表单验证
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
    this.closeOtherLayout = closeOtherLayout
    this.getAllFolders()
    this.getFileList()
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
    // 判断是否文件夹函数
    isFolderFn(row) {
      return row.Type === this.type.folder
    },
    /**
     * 编辑文件夹
     * act:Object 当前选中文件夹
     * type:String 操作类型 add添加edit编辑
     * file:Object 当前路径信息
     */
    handleFolder(act, type, file) {
      this.path = file
      this.fade.folder = true
      if (type === 'add') {
        this.$refs['folder_form'].resetFields()
        this.folder_form.Id = ''
        this.folder_form.ParentId = file.id
        return
      }
      this.child_act_saved = act
      this.folder_form = { ...act }
    },
    /**
     * @name 上传文件提交操作
     */
    fileUpload(file, cb) {
      this.uploadOptions.bb = 1
      cb()
    },
    download(data, func) {
      console.log(data, func)
    },
    /**
     * 根据关键词搜索文件
     * file: Object 文件属性
     * update: Boolean 数据是否需要更新（不需要表示已存在）
     */
    fileSearch(file, update) {
      if (update) {
        this.path = file
        this.getFileList()
      }
    },
    // 获取文件夹列表
    getFileList() {
    },
    // 删除文件
    fileDel(data) {
    },
    // 获取所有文件夹
    getAllFolders() {
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
