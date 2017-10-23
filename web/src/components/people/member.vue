<template lang="pug">
  div.member.p-r
    el-button.mb-10.f-l(type='primary', icon='plus', @click='dialogFormVisible=true') 添加成员
    el-dialog.dialog-form(:title='member.id?"编辑成员":"添加成员"', :visible.sync="dialogFormVisible")
      el-form.member-add-form(ref='member', :model='member', :rules='rules', label-position='right', label-width='100px')
        el-form-item.ta-l(label='账户', prop='account')
          el-input(size='small', v-model='member.account', placeholder="字母数字下划线，字母开头，4-16位")
        el-form-item.ta-l(label='姓名', prop='name')
          el-input(size='small', v-model='member.name', placeholder="王大锤")
        el-form-item.ta-l(label='管理员')
          el-checkbox(v-model='member.isAdmin', prop='isAdmin')
        el-form-item.ta-l(label='初始密码', prop='password')
          el-input(size='small', v-model='member.password', prop='password')
        el-form-item.ta-l
          el-button.mr-50(@click='cancel()') 取消
          el-button(type='primary', @click='submit()') {{ member.id ? '保存' : '添加' }}
        el-form-item
    el-table.member-list-table(:data='memberList', border, fit, style='width:100%')
      el-table-column(prop='account', label='账号', align='center')
      el-table-column(prop='name', label='姓名', align='center')
      el-table-column(prop='isAdmin', label='是否管理员', align='center')
        template(scope='scope') {{scope.row.isAdmin}}
      el-table-column(label='操作', align='center')
        template(scope='scope')
          el-button(@click.native.prevent='delMember(scope.$index, scope.row.id)', type='text', size='small') 删除
          el-button(@click.native.prevent='editMember(scope.$index)', type='text', size='small') 编辑
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
// import rules from '../../service/rules'
@Component
export default class member extends Vue {
  $refs: any
  $message: any
  $confirm: any
  dialogFormVisible: boolean = false
  member: any = {
    account: '',
    isAdmin: false,
    password: ''
  }
  rules: any = {
    account: [{required: true}, {message: '字母开头，包含字母、数字、下划线，4-16位', pattern: /^[a-zA-Z]\w{3,15}$/}],
    name: [{required: true}],
    password: [{required: true}, {min: 6, message: '不少于6位字符'}]
  }
  groups: any[] = []
  memberList: any[] = []
  async beforeMount () {
    let resp: any = await http.get('/api/member')
    this.memberList = resp.memberList
    let resp2: any = await http.get('/api/group')
    this.groups = resp2.groupList
  }
  async delMember(index: number, id: string) {
    try {
      await this.$confirm('确认删除此成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let resp:any = await http.delete('/api/member/' + id)
      if (resp.data.errCode === 0) {
        this.$message({type: 'success', message: '删除成功'})
        this.memberList.splice(index, 1)
      } else {
        this.$message({type: 'error', message: '删除失败'})
      }
    } catch (err) {}
  }
  editMember(index: number) {
    this.member = this.memberList[index]
    this.dialogFormVisible = true
  }
  addMember() {
    this.member = {
      account: '',
      isAdmin: false,
      password: ''
    }
    this.dialogFormVisible = true
  }
  cancel() {
    this.member = {
      group: {}
    }
    this.dialogFormVisible = false
  }
  submit() {
    let that = this
    this.$refs.member.validate(async (valid:boolean) => {
      if (valid) {
        let resp:any = that.member.id
        ? await http.put('/api/member/' + that.member.id, that.member)
        : await http.post('/api/member', that.member)
        if (resp.data.errCode === 0) {
          if (!that.member.id) { that.memberList.push(that.member) }
          that.$message({type: 'success', message: resp.data.errMsg || '添加成功'})
          that.dialogFormVisible = false
          that.member = {
            account: '',
            isAdmin: false,
            password: ''
          }
        } else {
          that.$message({type: 'error', message: resp.data.errMsg || '添加失败'})
        }
      }
      return false
    })
  }
}
</script>

<style lang="stylus" scoped>
.member
  margin 50px
  width 100%
  height 100%
.member-add-form
  margin 20px auto
  padding 20px 50px
  width 800px
  background-color #fff
  border 1px solid $borderColorTable
.member-list-table
  min-width 500px
</style>
