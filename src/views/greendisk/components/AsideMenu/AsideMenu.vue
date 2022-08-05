<template>
  <div class="aside-menu-wrapper">
    <!-- 菜单树位置区域 -->
    <el-tree
      id="menu-tree"
      ref="menuTree"
      :data="menuTreeData"
      :props="defaultProps"
      :expand-on-click-node="false"
      :indent="50"
      default-expand-all
      highlight-current
      node-key="id"
      @node-click="handleMenuNodeClick"
    >
      <span slot-scope="{node, data}">
        <span v-if="data.id === 0" class="menu-first-node">
          <i :class="data.icon" />
          {{ node.label }}
        </span>
        <span v-else-if="data.id === 6 || data.id === 7" class="menu-node">
          <i :class="data.icon" style="margin-right: 2px;" />
          {{ node.label }}
        </span>
        <span v-else>
          <i :class="data.icon" style="margin-right: 10px;" />
          {{ node.label }}
        </span>
      </span>
    </el-tree>
    <!-- 快捷访问菜单区域 -->
    <FastAccessMenu :data="fastAccessBtnData" @fastAccess="fastAccess" @fastContextMenu="fastContextMenu" />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import FastAccessMenu from './components/FastAccessMenu'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    FastAccessMenu
  },
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      menuTreeData: [
        {
          id: 0,
          icon: '',
          label: '所有文件',
          children: [
            {
              id: 1,
              icon: 'el-icon-headset',
              label: '音频',
              children: []
            },
            {
              id: 2,
              icon: 'el-icon-video-play',
              label: '视频',
              children: []
            },
            {
              id: 3,
              icon: 'el-icon-picture',
              label: '图片',
              children: []
            },
            {
              id: 4,
              icon: 'el-icon-document',
              label: '文档',
              children: []
            },
            {
              id: 5,
              icon: 'el-icon-more',
              label: '其他',
              children: []
            }
          ]
        },
        {
          id: 6,
          icon: 'el-icon-share',
          label: '我的分享',
          children: []
        },
        {
          id: 7,
          icon: 'el-icon-delete',
          label: '回收站',
          children: []
        }
      ], // 菜单树数据
      fastAccessBtnData: {
        name: '快捷访问',
        children: [
          {
            id: 1,
            img: this.getFolderImg(),
            name: 'BookBookBookBook1'
          },
          {
            id: 2,
            img: this.getFolderImg(),
            name: 'Book2'
          }
        ]
      } // 快捷访问数据
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
    var menuFirstNode = this.menuTreeData[0]
    // 默认选中第一个节点
    this.$nextTick(function() {
      this.$refs.menuTree.setCurrentKey(menuFirstNode.id)
    })
    // 画分割线
    var menuTreeDomList = document.getElementById('menu-tree').getElementsByClassName('el-tree-node__content')
    // var fastTreeDomList = document.getElementById('fast-tree').getElementsByClassName('el-tree-node__content')
    menuTreeDomList[menuFirstNode.children.length + 1].classList.add('el-tree-node__content-line')
    // fastTreeDomList[0].classList.add('el-tree-node__content-line')
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
    // 获取文件夹图片
    getFolderImg() {
      return require('../../../../assets/images/file/dir.png')
    },
    // 选择菜单
    handleMenuNodeClick(data) {
      console.log('handleMenuNodeClick: ', data)
    },
    // 选择快捷访问文件/文件夹
    handleFastNodeClick(data) {
      // this.$refs.fastTree.setCurrentKey(null)
      console.log('handleFastNodeClick: ', data)
    },
    // 快捷访问点击快速访问
    fastAccess(data) {
      console.log('fastAccess: ', data)
      this.$emit('fastAccess', data)
    },
    // 快捷访问右键菜单
    fastContextMenu(data, event) {
      console.log('fastContextMenu: ', data)
      this.$emit('fastContextMenu', data, event)
    }
  }
}
</script>

<style lang='scss'>
// menu-tree节点样式
#menu-tree .el-tree-node__content {
  width: 160px;
  height: 40px;
  border-radius: 10px;
}

// fast-tree节点样式
#fast-tree .el-tree-node__content {
  width: 160px;
  height: 40px;
  border-radius: 10px;
}

// menu-tree选中节点高亮样式
#menu-tree.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  color: #1FA9FC;
  background-color: #EFF9FE;
}

// menu-tree节点展开图标样式
#menu-tree.el-tree .el-tree-node__expand-icon {
  font-size: 16px;
  color: #D4DED7;
  margin-left: 30px;
}

// fast-tree节点展开图标样式
#fast-tree.el-tree .el-tree-node__expand-icon {
  font-size: 16px;
  color: #D4DED7;
  margin-left: 30px;
}

// menu-tree隐藏叶子节点的图标
#menu-tree .el-tree-node__expand-icon.is-leaf {
  display: none;
}

// fast-tree隐藏叶子节点的图标
#fast-tree .el-tree-node__expand-icon.is-leaf {
  display: none;
}

// menu-tree选中节点展开图标样式
#menu-tree.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .el-tree-node__expand-icon {
  color: #1FA9FC;
}

// 节点分割线
.el-tree-node__content-line::before {
  content: '';
  position: absolute;
  width: 140px;
  height: 1px;
  border-top: 1px solid #DCDFE6;
  margin-left: 10px;
  margin-bottom: 40px;
}
</style>
<style lang='scss' scoped>
.aside-menu-wrapper {
  width: 200px;
  font-size: 14px;
  border-right: 1px solid #DCDFE6;
}

.menu-first-node {
  font-weight: bold;
}

.menu-node {
  font-weight: bold;
  margin-left: 38px;
}
</style>
