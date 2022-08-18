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
            <div @mouseover="isShowTooltip('refTreeMultiParentName' + index)">
              <el-tooltip :disabled="showTooltip" effect="light" :content="item.name" placement="top">
                <div class="tree-multi-parent-menu-name">
                  <span :ref="'refTreeMultiParentName' + index">{{ item.name }}</span>
                </div>
              </el-tooltip>
            </div>
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
            <div @mouseover="isShowTooltip('refTreeMultiChildName' + subindex)">
              <el-tooltip :disabled="showTooltip" effect="light" :content="subitem.name" placement="top">
                <div class="tree-multi-child-menu-name">
                  <span :ref="'refTreeMultiChildName' + subindex">{{ subitem.name }}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <!-- 单级菜单区域 -->
      <div v-else>
        <div :class="getTreeMenuClass(item)" @click="treeMenuClick(item)">
          <div class="tree-single-menu">
            <i :class="item.icon" class="tree-single-menu-icon" />
            <div @mouseover="isShowTooltip('refTreeSingleName' + index)">
              <el-tooltip :disabled="showTooltip" effect="light" :content="item.name" placement="top">
                <div class="tree-single-menu-name">
                  <span :ref="'refTreeSingleName' + index">{{ item.name }}</span>
                </div>
              </el-tooltip>
            </div>
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
      showTooltip: true, // 是否开启tooltip功能
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
    // 是否开启tooltip功能
    isShowTooltip(refName) {
      var parentWidth = this.$refs[refName][0].parentNode.offsetWidth
      var contentWidth = this.$refs[refName][0].offsetWidth
      // 判断是否开启tooltip功能
      if (contentWidth > parentWidth) {
        this.showTooltip = false
      } else {
        this.showTooltip = true
      }
    },
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
.tree-menu-wrapper {
  padding-left: 10px;
  padding-right: 10px;
}

.tree-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
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
  width: 140px;
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
  width: 120px;
  height: 1px;
  border-top: 1px solid #DCDFE6;
  margin-bottom: 40px;
}

.tree-multi-parent-menu {
  display: flex;
  width: 80px;
}

.tree-multi-parent-menu-name {
  width: 58px;
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
  display: flex;
  width: 80px;
  margin-left: 40px;
  font-weight: normal;
}

.tree-multi-child-menu-name {
  width: 58px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-multi-child-menu-icon {
  padding-right: 6px;
}

.tree-single-menu {
  display: flex;
  width: 80px;
  margin-left: 6px;
}

.tree-single-menu-name {
  width: 58px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-single-menu-icon {
  padding-right: 6px;
}
</style>
