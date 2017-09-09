<template lang="pug">
  div.member
    el-button(type='primary', icon='plus') 添加分组
    el-button(type='primary', icon='plus') 添加成员
    el-form.a(:inline='true', label-position='right', label-width='100px')
      el-form-item(label='账户名')
        el-input(size='small')
      el-form-item(label='是否管理员')
        el-checkbox()
      el-form-item(label='称呼')
        el-input(size='small')
      el-form-item(label='分组')
      el-form-item(label='初始密码')
        el-input(size='small')
      el-form-item
    el-table(:data='memberList', border, fit, style='width:100%')
      el-table-column(prop='name', label='姓名', align='center')
      el-table-column(prop='isAdmin', label='是否管理员', align='center')
        template(scope='scope') {{scope.row.isAdmin}}
      el-table-column(prop='account', label='账号', align='center')
      el-table-column(prop='group', label='小组', align='center')
      el-table-column(label='操作', align='center')
        template(scope='scope')
          el-button(@click.native.prevent='delMember(scope.$index)', type='text', size='small') 移除
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
@Component
export default class member extends Vue {
  memberList: any[] = []
  async beforeMount () {
    let resp: any = await http.get('/api/member')
    this.memberList = resp.memberList
  }
}
</script>

<style lang="stylus" scoped>
.member
  margin 50px
.el-table
  min-width 500px
</style>
