<template>
  <div class="fast-access-menu-wrapper">
    <div class="fast-access-menu">
      <i
        class="fast-access-menu-expand-icon"
        :class="isExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
        @click="isExpand = !isExpand"
      />
      <span>{{ data.name }}</span>
    </div>
    <div v-show="isExpand">
      <div
        v-for="(item, index) in data.children"
        :key="index"
        class="fast-access-child-menu"
        @click="fastAccess(item)"
        @contextmenu="fastContextMenu(item, $event)"
      >
        <div class="fast-access-child-menu-item">
          <img class="fast-access-child-menu-img" :src="item.img">
          <div @mouseover="isShowTooltip('refFastChildMenuName' + index)">
            <el-tooltip :disabled="showTooltip" effect="light" :content="item.name" placement="top">
              <div class="fast-access-child-menu-name">
                <span :ref="'refFastChildMenuName' + index">{{ item.name }}</span>
              </div>
            </el-tooltip>
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
      type: Object,
      default: () => {
        return {
          name: '快捷访问',
          children: []
        }
      }
    }, // 数据
    expand: {
      type: Boolean,
      default: true
    } // 是否展开
  },
  // 数据
  data() {
    // 这⾥存放数据
    return {
      showTooltip: true, // 是否开启tooltip功能
      isExpand: this.expand // 默认展开
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
    // 快捷访问点击快速访问
    fastAccess(data) {
      this.$emit('fastAccess', data)
    },
    // 快捷访问右键菜单
    fastContextMenu(data, event) {
      this.$emit('fastContextMenu', data, event)
    }
  }
}
</script>

<style lang='scss' scoped>
.fast-access-menu-wrapper {
  padding-left: 10px;
  padding-right: 10px;
}

.fast-access-menu-wrapper::before {
  content: '';
  position: absolute;
  width: 120px;
  height: 1px;
  border-top: 1px solid #DCDFE6;
  margin-left: 10px;
}

.fast-access-menu {
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

.fast-access-menu:hover {
  background-color: #F5F7FA;
}

.fast-access-menu-expand-icon {
  font-size: 16px;
  color: #D4DED7;
  padding-right: 6px;
}

.fast-access-child-menu {
  display: flex;
  width: 140px;
  height: 40px;
  border-radius: 15px;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
}

.fast-access-child-menu:hover {
  background-color: #F5F7FA;
}

.fast-access-child-menu-item {
  display: flex;
  align-items: center;
  padding-left: 45px;
}

.fast-access-child-menu-img {
  width: 20px;
  height: 20px;
}

.fast-access-child-menu-name {
  width: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
