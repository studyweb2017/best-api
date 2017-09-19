<template lang="pug">
  div.member.p-r
    el-button.mb-10.f-l(type='primary', icon='plus', @click='dialogFormVisible=true') 添加成员
    el-dialog.dialog-form(:title='member.id?"编辑成员":"添加成员"', :visible.sync="dialogFormVisible")
      el-form.member-add-form(:model='member', label-position='right', label-width='100px')
        //- h3 {{ member.id ? '编辑成员' : '添加成员' }}
        el-form-item.ta-l(label='账户')
          el-input.w-200(size='small', v-model='member.account', placeholder="邮箱或者英文")
        el-form-item.ta-l(label='姓名')
          el-input.w-200(size='small', v-model='member.name', placeholder="王大锤")
        el-form-item.ta-l(label='分组', prop='group')
          el-select.w-200(size='small', v-model='member.group', value-key='name')
            el-option(v-for='(g, index) in groups', :value='g', :key='g.id', :label='g.name')
        el-form-item.ta-l(label='管理员')
          el-checkbox(v-model='member.isAdmin')
        el-form-item.ta-l(label='初始密码')
          el-input.w-200(size='small', v-model='member.password')
        el-form-item.ta-l
          el-button.mr-50(@click='cancel()') 取消
          el-button(v-type='primary', @click='submit()') {{ member.id ? '编辑' : '添加' }}
        el-form-item
    el-table.member-list-table(:data='memberList', border, fit, style='width:100%')
      el-table-column(prop='account', label='账号', align='center')
      el-table-column(prop='name', label='姓名', align='center')
      el-table-column(prop='group.name', label='小组', align='center')
      el-table-column(prop='isAdmin', label='是否管理员', align='center')
        template(scope='scope') {{scope.row.isAdmin}}
      el-table-column(label='操作', align='center')
        template(scope='scope')
          el-button(@click.native.prevent='delMember(scope.$index)', type='text', size='small') 移除
          el-button(@click.native.prevent='editMember(scope.$index)', type='text', size='small') 编辑
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
// import rules from '../../service/rules'
@Component
export default class member extends Vue {
  dialogFormVisible: boolean = false
  member: any = {
    account: '',
    group: {
      id: '',
      name: ''
    },
    isAdmin: false,
    password: ''
  }
  groups: any[] = []
  memberList: any[] = []
  async beforeMount () {
    let resp: any = await http.get('/api/member')
    this.memberList = resp.memberList
    let resp2: any = await http.get('/api/group')
    this.groups = resp2.groups
  }
  delMember(index: number) {
    this.memberList.splice(index, 1)
  }
  editMember(index: number) {
    this.member = this.memberList[index]
    this.dialogFormVisible = true
  }
  addMember() {
    this.member
  }
  cancel() {
    this.member = {
      group: {}
    }
    this.dialogFormVisible = false
  }
  submit() {
    this.dialogFormVisible = false
  }
}
</script>

<style lang="stylus" scoped>
// @import "../../color.styl"
.member
  margin 50px
  width 100%
  height 100%
.member-add-form
  margin 20px auto
  padding 20px 50px
  background-color #fff
  border 1px solid $borderColorTable
.member-list-table
  min-width 500px
</style>
