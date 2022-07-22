<template>
  <el-form ref="userForm" :model="user" :rules="userRules" label-width="70px">
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model.trim="user.nickname" style="width: 300px;" clearable />
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model.trim="user.mobile" style="width: 300px;" clearable />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model.trim="user.email" style="width: 300px;" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  profileEdit
} from '@/api/user'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          nickname: '',
          mobile: '',
          email: ''
        }
      }
    }
  },
  // 数据
  data() {
    // 这⾥存放数据
    return {
      userRules: {
        nickname: [
          {
            pattern: '^[\u4e00-\u9fa5]{0,20}$',
            message: '昵称必须为中文且长度不能超过20',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '手机号码不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ]
      }
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
    submit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          profileEdit({
            nickname: this.user.nickname,
            mobile: this.user.mobile,
            email: this.user.email
          }).then((res) => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            }
          }).catch(() => { })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
