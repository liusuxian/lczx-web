<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="text-center">
        <UserAvatar :avatar="user.avatar" />
      </div>
      <div>
        <ul class="list-group list-group-striped">
          <li class="list-group-item">
            <svg-icon icon-class="user" />用户名称
            <div class="pull-right">{{ user.name }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="phone" />手机号码
            <div class="pull-right">{{ user.mobile }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="email" />用户邮箱
            <div class="pull-right">{{ user.email }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="tree" />所属部门
            <div class="pull-right">{{ user.deptName }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="peoples" />所属角色
            <div class="pull-right">{{ user.role }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="date" />创建日期
            <div class="pull-right">{{ user.createdAt }}</div>
          </li>
        </ul>
      </div>
    </div>
  </el-card>
</template>

<script>
import UserAvatar from './UserAvatar'

export default {
  components: {
    UserAvatar
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          avatar: '',
          name: '',
          mobile: '',
          email: '',
          deptName: '',
          role: '',
          createdAt: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-profile {
  .text-center {
    text-align: center
  }

  .list-group-striped>.list-group-item {
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
  }

  .list-group {
    padding-left: 0px;
    list-style: none;
  }

  .list-group-item {
    border-bottom: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    margin-bottom: -1px;
    padding: 11px 0px;
    font-size: 13px;
  }

  .pull-right {
    float: right !important;
  }
}
</style>
