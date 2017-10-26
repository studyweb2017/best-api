<template lang="pug">
  div.nav-bar-wrap.p-a
    div.nav-bar.ta-l
      router-link.menu-item(to='/')
        img.logo(src="../assets/logo.png")
        small tiduyun
      router-link.menu-item(to='/project/list', active-class='menu-active') 项目
      router-link.menu-item(to='/test', active-class='menu-active') 测试
      router-link.menu-item(v-if='user.isAdmin', to='/member', active-class='menu-active') 成员管理
      router-link.menu-item(to='/doc', active-class='menu-active') 文档
      router-link.menu-item(to='/set', active-class='menu-active') 设置
      router-link.menu-item(to='/message', active-class='menu-active') 动态
      router-link.menu-item.logout(v-if='!isLogin', to='')
        span(v-if='!isLogin', @click='showLoginDialog=true') 登录
      el-popover(ref="popover1", placement="top-start", width="100", trigger='hover')
        router-link.sub-menu-item(to='/user/set', active-class='') 个人设置
        span.sub-menu-item(@click='logout()') 退出账号
      span.d-ib.f-r.user(v-show='isLogin', v-popover:popover1="")
        img.avatar(:src='user.avatar', alt='avatar', :title='user.name')
        //- span.d-ib.avatar {{user.name || ''}}
      el-dialog.login-dialog(title='登录', :visible.sync='showLoginDialog')
        el-form(ref='userForm', :rules='rules' :model='userForm', label-position='right', label-width='80px')
          el-form-item(label='账号', prop='account')
            el-input(v-model='userForm.account', placeholder="英文名或邮箱地址", @keyup.native.enter='login')
          el-form-item(label='密码', prop='password')
            el-input(v-model='userForm.password', @keyup.native.enter='login', type='password')
          el-form-item
            el-button(type='ghost', @click='reset()') {{'重置'}}
            el-button(type='primary', @click='login()', style='margin-left: 50px') {{'登录'}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Cache from '../service/cache.ts'
import http from '../service/http.ts'
@Component
export default class navBar extends Vue {
  $confirm: any
  $message: any
  $router: any
  $refs:any
  user:any = {}
  avatarElement:any = 'img'
  beforeMount() {
    let u = JSON.parse(Cache.get('user'))
    this.user = u || this.user
    this.isLogin = !!u
  }
  showLoginDialog: boolean = false
  isLogin: boolean = false
  userForm: any = {
    account: '',
    password: ''
  }
  rules: any = {
    account: [{required: true}],
    password: [{required: true}]
  }
  reset () {
    this.$refs.userForm.resetFields()
  }
  login () {
    let that = this
    that.$refs.userForm.validate(async (valid: boolean) => {
      if (valid) {
        let resp:any = await http.post('/api/user/login', that.userForm)
        if (resp.user && resp.token) {
          Cache.set('user', JSON.stringify(resp.user))
          Cache.set('token', resp.token)
          Cache.set('password', that.userForm.password)
          Cache.set('account', that.userForm.account)
          that.isLogin = true
          that.user = resp.user
          that.showLoginDialog = false
          that.$message({type: 'success', message: '登录成功'})
          that.$router.push('/project/list')
        } else {
          that.$message({type: 'warning', message: resp.errMsg})
        }
      }
      return false
    })
  }
  async logout () {
    await this.$confirm('确认退出账号？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
    let res:any = await http.get('/api/user/logout')
    if (res.errCode === 0) {
      Cache.remove('user')
      Cache.remove('token')
      this.isLogin = false
      this.user = {}
      this.$message({type: 'success', message: '退出成功'})
      this.$router.push('/')
    } else {
      this.$message({type: 'error', message: res.errMsg || '退出失败'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.nav-bar-wrap
  top 0
  left 0
  right 0
  height 60px
.nav-bar
  margin 0 auto
  background-color #20a0ff
  color #fff
.menu-item
  display inline-block
  padding 0 10px
  height 60px
  line-height 60px
  color #fff
  text-decoration none
  .logo
    vertical-align middle
    width 50px
    height 50px
.menu-active
  color #fff
  background-color #44abf7
.menu-item:hover
  background-color #44abf7
  border 0
.el-popover
  padding 0
  min-width 0
.sub-menu-item
  display block
  padding 0 10px
  height 40px
  line-height 40px
  text-decoration none
  cursor pointer
.sub-menu-item:hover
  background-color #eee
.logout
  float right
  width 100px
.user
  width 100px
  height 60px
  line-height 60px
  vertical-align middle
  color #fff
  background-color #20a0ff
  .avatar
    line-height 50px
    width 50px
    height 50px
    border-radius 50%
    border 1px solid #fff
</style>
