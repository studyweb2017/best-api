<template lang="pug">
  div.login.ta-c
    el-form(ref='user', :model='user', label-position='right', label-width='80px')
      el-form-item(label='账号', prop='account')
        el-input(v-model='user.account', placeholder="英文名或邮箱地址")
      el-form-item(label='密码', prop='password')
        el-input(v-model='user.password')
      el-form-item
        el-button(type='ghost', @click='reset()') {{'重置'}}
        el-button(type='primary', @click='login()', style='margin-left: 50px') {{'登录'}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
import Cache from '../../service/cache.ts'
@Component
export default class login extends Vue {
  $refs:any
  $router:any
  user: any = {
    account: '',
    password: ''
  }
  reset () {
    this.$refs.user.resetFields()
  }
  async login () {
    let resp:any = await http.post('/api/user/login', { data: this.user })
    if (resp.data.code === 0) {
      Cache.set('user', resp.data.user)
      this.$router.push('/')
      this.$router.go(0)
    }
  }
}
</script>
<style lang="stylus" scoped>
.login
  margin 50px auto
  padding 50px 50px
  text-align center
  width 500px
  border 1px solid #ddd
</style>

