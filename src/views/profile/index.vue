<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本资料" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="edit_password">
                <reset-pwd />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import Account from './components/Account'
import ResetPwd from './components/ResetPwd'
import {
  getProfile
} from '@/api/user'

export default {
  name: 'Profile',
  components: {
    UserCard,
    Account,
    ResetPwd
  },
  data() {
    return {
      user: {},
      activeTab: 'account'
    }
  },
  computed: {},
  created() {
    this.handleGetProfile()
  },
  methods: {
    handleGetProfile() {
      getProfile().then((res) => {
        var data = res.data.profileInfo
        if (data) {
          var tmpRoles = []
          for (const item of data.roles) {
            tmpRoles.push(item.name)
          }
          this.user = {
            avatar: data.user.avatar,
            name: data.user.realname,
            nickname: data.user.nickname,
            mobile: data.user.mobile,
            email: data.user.email,
            deptName: data.dept.name,
            role: tmpRoles.join(' | '),
            createdAt: data.user.createdAt
          }
        }
      }).catch(() => { })
    }
  }
}
</script>
