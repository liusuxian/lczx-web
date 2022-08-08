<template>
  <div class="tree-menu-wrapper">
    <div v-for="(item, index) in data" :key="index">
      <!-- 多级菜单区域 -->
      <div v-if="item.children && item.children.length > 0">
        <div :class="getTreeMenuClass(item)" @click="treeMenuClick(item)">
          <!-- 多级菜单父菜单区域 -->
          <div class="tree-multi-parent-menu">
            <i
              class="tree-multi-parent-menu-expand-icon"
              :class="item.expand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
              @click.stop="item.expand = !item.expand"
            />
            <el-tooltip v-if="item.name.length > 4" effect="light" :content="item.name" placement="right">
              <span>{{ item.name }}</span>
            </el-tooltip>
            <span v-else>{{ item.name }}</span>
          </div>
        </div>
        <!-- 多级菜单子菜单区域 -->
        <div
          v-for="(subitem, subindex) in item.children"
          v-show="item.expand"
          :key="subindex"
          :class="getTreeMenuClass(subitem)"
          @click="treeMenuClick(subitem)"
        >
          <div class="tree-multi-child-menu">
            <i :class="subitem.icon" class="tree-multi-child-menu-icon" />
            <el-tooltip v-if="subitem.name.length > 4" effect="light" :content="subitem.name" placement="right">
              <span>{{ subitem.name }}</span>
            </el-tooltip>
            <span v-else>{{ subitem.name }}</span>
          </div>
        </div>
      </div>
      <!-- 单级菜单区域 -->
      <div v-else>
        <div :class="getTreeMenuClass(item)" @click="treeMenuClick(item)">
          <div class="tree-single-menu">
            <i :class="item.icon" class="tree-single-menu-icon" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {
    data: {
      type: Array,
      default: () => []
    } // 数据
  },
  // 数据
  data() {
    // 这⾥存放数据
    return {
      curMenuId: 0 // 当前被选中的菜单id
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
    this.treeMenuClick(this.data[0])
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
    // 获取菜单树菜单绑定的class
    getTreeMenuClass(item) {
      return {
        'tree-menu': this.curMenuId !== item.id,
        'tree-menu-select': this.curMenuId === item.id,
        'tree-menu-disabled': item.disabled,
        'tree-menu-line': item.divided
      }
    },
    // 点击菜单树菜单
    treeMenuClick(data) {
      if (!data.disabled) {
        this.curMenuId = data.id
        this.$emit('treeMenuClick', data)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.tree-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 40px;
  border-radius: 15px;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  font-weight: bold;
}

.tree-menu:hover {
  background-color: #F5F7FA;
}

.tree-menu-select {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 40px;
  border-radius: 15px;
  cursor: pointer;
  color: #1FA9FC;
  background-color: #EFF9FE;
  font-size: 14px;
  font-weight: bold;
}

.tree-menu-disabled {
  color: #C0C4CC;
  cursor: not-allowed;
}

.tree-menu-line::before {
  content: '';
  position: absolute;
  width: 140px;
  height: 1px;
  border-top: 1px solid #DCDFE6;
  margin-bottom: 40px;
}

.tree-multi-parent-menu {
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-multi-parent-menu-expand-icon {
  font-size: 16px;
  color: #D4DED7;
  padding-right: 6px;
}

.tree-menu-select .tree-multi-parent-menu-expand-icon {
  font-size: 16px;
  color: #1FA9FC;
  padding-right: 6px;
}

.tree-multi-child-menu {
  width: 80px;
  margin-left: 40px;
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-multi-child-menu-icon {
  padding-right: 6px;
}

.tree-single-menu {
  width: 80px;
  margin-left: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-single-menu-icon {
  padding-right: 6px;
}
</style>
