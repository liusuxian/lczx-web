<template>
  <div class="aside-menu-wrapper">
    <!-- 菜单树区域 -->
    <TreeMenu :data="menuTreeData" @treeMenuClick="treeMenuClick" />
    <!-- 快捷访问菜单区域 -->
    <FastAccessMenu :data="fastAccessMenuData" @fastAccess="fastAccess" @fastContextMenu="fastContextMenu" />
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import TreeMenu from './components/TreeMenu'
import FastAccessMenu from './components/FastAccessMenu'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {
    TreeMenu,
    FastAccessMenu
  },
  // 属性
  props: {},
  // 数据
  data() {
    // 这⾥存放数据
    return {
      menuTreeData: [
        {
          id: 0,
          name: '所有文件',
          expand: true,
          children: [
            {
              id: 1,
              icon: 'el-icon-headset',
              name: '音频'
            },
            {
              id: 2,
              icon: 'el-icon-video-play',
              name: '视频'
            },
            {
              id: 3,
              icon: 'el-icon-picture',
              name: '图片'
            },
            {
              id: 4,
              icon: 'el-icon-document',
              name: '文档'
            },
            {
              id: 5,
              icon: 'el-icon-more',
              name: '其他'
            }
          ]
        },
        {
          id: 100,
          icon: 'el-icon-share',
          name: '我的分享',
          divided: true,
          disabled: true
        },
        {
          id: 101,
          icon: 'el-icon-delete',
          name: '回收站'
        }
      ], // 菜单树数据
      fastAccessMenuData: {
        name: '快捷访问',
        children: []
      } // 快捷访问菜单数据
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
    this.getFastItem()
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
    // 获取文件夹图片
    getFolderImg() {
      return require('../../../../assets/images/file/dir.png')
    },
    // 获取快捷访问项
    getFastItem() {
      // var data = {
      //   id: 1,
      //   name: 'Book1',
      // }
      // this.$set(data, 'img', this.getFolderImg())
      // this.fastAccessMenuData.children.push(data)
    },
    // 添加快捷访问项
    addFastItems(dataList) {
      for (const data of dataList) {
        this.$set(data, 'img', this.getFolderImg())
        this.fastAccessMenuData.children.push(data)
      }
    },
    // 点击菜单树菜单
    treeMenuClick(data) {
      this.$emit('treeMenuClick', data)
    },
    // 快捷访问点击快速访问
    fastAccess(data) {
      this.$emit('fastAccess', data)
    },
    // 快捷访问右键菜单
    fastContextMenu(data, event) {
      event.preventDefault() // 不能阻止冒泡，但是可以阻止默认事件
      event.stopPropagation() // 会阻止冒泡事件，但是不会阻止默认事件
      this.$contextmenu({
        items: [
          {
            label: '从边栏移除',
            onClick: () => {
              this.removeFastItem(data)
            }
          }
        ],
        event,
        customClass: 'fast-context-menu-custom-class',
        zIndex: 3,
        minWidth: 100
      })
      return false
    },
    // 从边栏移除快捷访问项
    removeFastItem(data) {
      var index = this.fastAccessMenuData.children.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        this.fastAccessMenuData.children.splice(index, 1)
      }
    }
  }
}
</script>

<style lang='scss'>
// 右键菜单样式
.fast-context-menu-custom-class {
  padding: 0px !important;
}

// 右键菜单样式
.fast-context-menu-custom-class .menu_item__available:hover,
.fast-context-menu-custom-class .menu_item_expand {
  border-radius: 4px !important;
  color: white !important;
  background-color: #1FA9FC !important;
}
</style>
<style lang='scss' scoped>
.aside-menu-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  border-right: 1px solid #DCDFE6;
}
</style>
