<template lang="pug">
  div
    el-form(ref='userForm', :rules='rules' :model='userForm', label-position='right', label-width='80px')
      el-form-item(label='账号', prop='account')
        el-input(v-model='userForm.account', placeholder="英文名或邮箱地址", @keyup.native.enter='login')
      el-form-item(label='密码', prop='password')
        el-input(v-model='userForm.password', @keyup.native.enter='login')
      el-form-item
        el-button(type='ghost', @click='reset()') {{'重置'}}
        el-button(type='primary', @click='login()', style='margin-left: 50px') {{'登录'}}
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Cache from '../../service/cache.ts'
import http from '../../service/http.ts'
@Component
export default class login extends Vue {
  $confirm: any
  $message: any
  $router: any
  $refs:any
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
          that.$message({type: 'success', message: '登录成功'})
          that.$router.push('/project/list')
        } else {
          that.$message({type: 'warning', message: resp.errMsg})
        }
      }
      return false
    })
  }
}
</script>

<style lang="stylus" scoped>
.el-form
  margin 50px auto
  width 500px
</style>
