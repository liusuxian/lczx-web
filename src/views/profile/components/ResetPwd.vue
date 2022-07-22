<template>
  <el-form ref="userForm" :model="user" :rules="userRules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model.trim="user.oldPassword" style="width: 300px;" placeholder="请输入旧密码" show-password clearable />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model.trim="user.newPassword" style="width: 300px;" placeholder="请输入新密码" show-password clearable />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model.trim="user.confirmPassword" style="width: 300px;" placeholder="请确认密码" show-password clearable />
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
  pwdEdit
} from '@/api/user'

export default {
  // import引⼊的组件需要注⼊到对象中才能使⽤
  components: {},
  // 属性
  props: {},
  // 数据
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    // 这⾥存放数据
    return {
      user: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      userRules: {
        oldPassword: [
          {
            required: true,
            message: '旧密码不能为空',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 18,
            message: '密码为任意可见字符，长度在6~18之间',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
          },
          {
            required: true,
            validator: equalToPassword,
            trigger: 'blur'
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
          pwdEdit(this.user).then((res) => {
            if (res.code === 0) {
              this.user.oldPassword = ''
              this.user.newPassword = ''
              this.user.confirmPassword = ''
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
