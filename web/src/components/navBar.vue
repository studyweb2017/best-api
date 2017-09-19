<template lang="pug">
  el-menu.ta-c(mode='horizontal', router=true, theme='light')
    el-menu-item(index='/')
      img.logo(src="../assets/logo.png")
      small tiduyun
    el-menu-item(index='/project/list') 项目
    el-menu-item(index='/test') 测试
    el-menu-item(index='/people') 人员管理
    el-menu-item(index='/doc') 文档
    el-menu-item(index='/set') 设置
    el-menu-item.login(v-if='!user', index='/user/login') 登录
    el-menu-item.login(v-if='user', index='')
      div.d-ib.avatar {{user ? user.name : ''}}
      span.c-f(type='text', v-if='user', @click='logout') {{ ' ' + '登出' }}
    el-menu-item.el-icon-message.news(index='/news')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Cache from '../service/cache.ts'
@Component
export default class navBar extends Vue {
  $confirm: any
  $message: any
  $router: any
  get user () {
    return JSON.parse(Cache.get('user'))
  }
  // dialogLogoutVisible: boolean = false
  logout () {
    this.$confirm('确认退出账号？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      Cache.remove('user')
      this.$router.go(0)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消退出'
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.el-menu
  margin 0 auto
  // max-width 1000px
  background-color #20a0ff
  .login
    float right
    .avatar
      line-height 40px
      width 40px
      height 40px
      border-radius 50%
      border 1px solid #fff
  .news
    float right
  .el-menu-item
    color #fff
    transition none
  .el-menu-item.is-active
    color #fff
    background-color #44abf7
  .el-menu-item:hover
    background-color #44abf7
    border 0
.logo
  vertical-align middle
  width 50px
  height 50px
</style>
