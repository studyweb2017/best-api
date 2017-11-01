<template lang="pug">
div.nav-bar-wrap.p-a.t-0.r-0.l-0.h-40
  div.nav-bar.ta-l.p-r
    div.d-ib.company
      img.logo(src="")
      small company name
    router-link.menu-item(v-for="item in menu", :key="item.routeName", v-if='!item.needAdmin||user.isAdmin', :to='{name:item.routeName}', active-class='menu-active', v-text="item.name")
    el-popover(ref="popover1", placement="top-start", width="100", trigger='hover')
      router-link.sub-menu-item(:to="{name: 'userProfile'}") 个人设置
      span.sub-menu-item(@click='logout()') 退出账号
    span.d-ib.f-r.user(v-show='user.name', v-popover:popover1="")
      span.c-f.username {{user.name}}
      img.avatar(:src='user.avatar', alt='avatar', :title='user.name')
    router-link(:to="{name:'messageIndex'}")
      el-badge.f-r.message(v-if="user.name", :value='10')
        i.fa.fa-bell-o.va-m
    el-popover(ref='popover2', title='通知' placement='bottom', width='200', trigger='hover')
      router-link.sub-menu-item(to='/message', active-class='') 查看全部
    el-dialog(size="tiny", :visible.sync='showLoginDialog', :show-close="false", :close-on-click-modal="false", :close-on-press-escape="false")
      LoginForm(@success="hideDialog")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Cache from '../service/cache.ts'
import http from '../service/http.ts'
import { Watch } from 'vue-property-decorator'
import LoginForm from './LoginForm'

@Component({
  components: {
    LoginForm
  }
})
export default class navBar extends Vue {
  $confirm: any
  $message: any
  $router: any
  $refs:any
  user:any = {}
  showLoginDialog: boolean = false
  rules: any = {
    account: [{required: true}],
    password: [{required: true}]
  }
  menu: any = [{
    name: '项目',
    routeName: 'projectIndex'
  }, {
    name: '测试',
    routeName: 'testIndex'
  }, {
    name: '成员',
    routeName: 'memberIndex',
    needAdmin: true
  }, {
    name: '文档',
    routeName: 'docIndex'
  }, {
    name: '设置',
    routeName: 'setIndex',
    needAdmin: true
  }]
  mounted() {
    let _this = this
    http.initLogin(() => {
      _this.showLoginDialog = true
    })
    this.routeChanged()
  }
  @Watch('$route')
  routeChanged() {
    this.user = JSON.parse(Cache.get('user'))
  }
  hideDialog() {
    this.showLoginDialog = false
  }
  async logout () {
    await this.$confirm('确认退出账号？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
    let res:any = await http.get('/api/user/logout')
    if (res.errCode === 0) {
      Cache.clear()
      this.$router.push({
        name: 'login'
      })
    } else {
      this.$message({type: 'error', message: res.errMsg || '退出失败'})
    }
  }
}
</script>

<style lang="stylus">
.company
  padding 0 20px
.nav-bar
  margin 0 auto
  background-color #20a0ff
  color #fff
.menu-item
  display inline-block
  padding 0 20px
  height 40px
  line-height 40px
  color #fff
  text-decoration none
.logo
  vertical-align middle
  height 30px
  min-width 30px
  margin-right 10px
.menu-active
  color #fff
  background-color #44abf7
.menu-item:hover
  background-color #44abf7
  border 0
.message
  color #fff
  cursor pointer
  margin-top 10px
  margin-right 40px
  width 20px
  height 20px
  sup
    border-width 0
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
  height 40px
  line-height 40px
  vertical-align middle
  color #fff
  margin-right 20px
  background-color #20a0ff
  .username
    cursor default
    margin-right 10px 
    user-select none
  .avatar
    width 40px
    height 40px
    border-radius 50%
    border 1px solid #fff
    vertical-align middle
</style>
