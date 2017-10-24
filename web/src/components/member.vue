<template lang="pug">
<<<<<<< HEAD
  div
    div.member
      el-button.mb-10(type='primary', icon='plus', @click="addMember()") 添加成员
      el-dialog(:title='operation', :visible.sync="showOperationForm")
        el-form.dialog-form(ref='member', :model='member', :rules='rules', label-position='right', label-width='100px')
          el-form-item.ta-l(label='账户', prop='account')
            el-input(:disabled="operation!=='添加成员'", size='small', v-model='member.account', placeholder="字母数字下划线，字母开头，4-16位")
          el-form-item.ta-l(v-if="operation==='添加成员'||operation==='编辑成员'", label='姓名', prop='name')
            el-input(size='small', v-model='member.name', placeholder="王大锤")
          el-form-item.ta-l(v-if="operation==='添加成员'||operation==='编辑成员'",label='管理员')
            el-checkbox(v-model='member.isAdmin', prop='isAdmin')
          el-form-item.ta-l(v-if="operation==='添加成员'", label='密码', prop='password')
            el-input(size='small', v-model='member.password', prop='password', type='password')
          el-form-item.ta-l(v-if="operation==='重置密码'", label='新密码', prop='newPassword')
            el-input(size='small', v-model='member.newPassword', prop='password', type='password')
          el-form-item.ta-l(v-if="operation==='重置密码'", label='确认新密码', prop='passwordSure')
            el-input(size='small', v-model='member.newPasswordSure', type='password')
          el-form-item.ta-l(v-if="operation==='重置密码'", label='管理员密码', prop='password')
            el-input(size='small', v-model='member.adminPassword', type='password')
          el-button.mr-50(@click='cancel()') 取消
          el-button(type='primary', @click='submit()', :disabled='submiting') {{ submitting ? '提交中' : '提交' }}

      el-table.member-list(:data='memberList', border, fit)
        el-table-column(prop='account', label='账号', align='center')
        el-table-column(prop='name', label='姓名', align='center')
        el-table-column(prop='isAdmin', label='是否管理员', align='center')
          template(scope='scope') {{scope.row.isAdmin}}
        el-table-column(label='操作', align='center')
          template(scope='scope')
            el-button(@click.native.prevent='delMember(scope.$index)', type='text', size='small') 删除
            el-button(@click.native.prevent='editMember(scope.$index)', type='text', size='small') 编辑
            el-button(@click.native.prevent='resetPassword(scope.$index)', type='text', size='small') 重置密码
=======
  div.member
    el-button.mb-10(type='primary', icon='plus', @click='dialogFormVisible=true') 添加成员
    el-dialog(:title='member.id?"编辑成员":"添加成员"', :visible.sync="dialogFormVisible")
      el-form.dialog-form(ref='member', :model='member', :rules='rules', label-position='right', label-width='100px')
        el-form-item.ta-l(label='账户', prop='account')
          el-input(size='small', v-model='member.account', placeholder="字母数字下划线，字母开头，4-16位")
        el-form-item.ta-l(label='姓名', prop='name')
          el-input(size='small', v-model='member.name', placeholder="王大锤")
        el-form-item.ta-l(label='管理员')
          el-checkbox(v-model='member.isAdmin', prop='isAdmin')
        el-form-item.ta-l(label='初始密码', prop='password')
          el-input(size='small', v-model='member.password', prop='password')
        el-button.mr-50(@click='cancel()') 取消
        el-button(type='primary', @click='submit()') {{ member.id ? '保存' : '添加' }}
    el-table.member-list-table(:data='memberList', border, fit)
      el-table-column(prop='account', label='账号', align='center')
      el-table-column(prop='name', label='姓名', align='center')
      el-table-column(prop='isAdmin', label='是否管理员', align='center')
        template(scope='scope') {{scope.row.isAdmin}}
      el-table-column(label='操作', align='center')
        template(scope='scope')
          el-button(@click.native.prevent='delMember(scope.$index, scope.row.id)', type='text', size='small') 删除
          el-button(@click.native.prevent='editMember(scope.$index)', type='text', size='small') 编辑
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../service/http.ts'
<<<<<<< HEAD
// import cache from '../service/cache.ts'
=======
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
@Component
export default class member extends Vue {
  $refs: any
  $message: any
  $confirm: any
<<<<<<< HEAD
  $prompt: any
  operation: string = ''
  showOperationForm: boolean = false
=======
  dialogFormVisible: boolean = false
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
  member: any = {
    account: '',
    isAdmin: false,
    password: ''
  }
<<<<<<< HEAD
  _member: any = {}
  rules: any = {
    account: [{required: true}, {message: '字母开头，包含字母、数字、下划线，4-16位', pattern: /^[a-zA-Z][a-zA-Z]{3,15}$/}],
    name: [{required: true}],
    password: [{required: true}, {min: 6, message: '不少于6位字符'}],
    newPassword: [{required: true}, {min: 6, message: '不少于6位字符'}],
    passwordSure: [{pattern: new RegExp('^' + this.member.newPassword + '$'), message: '密码不一致'}]
    // passwordSure(rule:any, value:any, callback:any, source:any, options:any) {
    //   let errors:any[] = []
    //   if (value !== source.newPassword) {
    //     errors.push(
    //       new Error('两次密码不一致')
    //     )
    //   }
    //   callback(errors)
    // }
=======
  rules: any = {
    account: [{required: true}, {message: '字母开头，包含字母、数字、下划线，4-16位', pattern: /^[a-zA-Z]\w{3,15}$/}],
    name: [{required: true}],
    password: [{required: true}, {min: 6, message: '不少于6位字符'}]
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
  }
  groups: any[] = []
  memberList: any[] = []
  async beforeMount () {
    let resp: any = await http.get('/api/member')
<<<<<<< HEAD
    this.memberList = resp.memberList || []
    let resp2: any = await http.get('/api/group')
    this.groups = resp2.groupList || []
  }
  async delMember(index: number) {
=======
    this.memberList = resp.memberList
    let resp2: any = await http.get('/api/group')
    this.groups = resp2.groupList
  }
  async delMember(index: number, id: string) {
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
    try {
      await this.$confirm('确认删除此成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
<<<<<<< HEAD
      let resp:any = await http.delete('/api/member/' + this.memberList[index].id)
      if (resp.errCode === 0) {
        this.$message({type: 'success', message: '删除成功'})
        this.memberList.splice(index, 1)
      } else {
        this.$message({type: 'error', message: resp.errMsg || '删除失败'})
=======
      let resp:any = await http.delete('/api/member/' + id)
      if (resp.data.errCode === 0) {
        this.$message({type: 'success', message: '删除成功'})
        this.memberList.splice(index, 1)
      } else {
        this.$message({type: 'error', message: '删除失败'})
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
      }
    } catch (err) {}
  }
  editMember(index: number) {
    this.member = this.memberList[index]
<<<<<<< HEAD
    this._member = {
      name: this.member.name,
      isAdmin: this.member.isAdmin
    }
    this.operation = '编辑成员'
    this.showOperationForm = true
=======
    this.dialogFormVisible = true
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
  }
  addMember() {
    this.member = {
      account: '',
<<<<<<< HEAD
      name: '',
      isAdmin: false,
      password: ''
    }
    this.operation = '添加成员'
    this.showOperationForm = true
  }
  resetPassword(index:number) {
    this.member = this.memberList[index]
    this._member = {
      password: this.member.password
    }
    this.member.newPassword = ''
    this.member.newPasswordSure = ''
    this.member.adminPassword = ''
    this.operation = '重置密码'
    this.showOperationForm = true
  }
  cancel() {
    if (this.operation === '添加成员') {
      this.member = {}
    } else if (this.operation === '编辑成员') {
      this.member.name = this._member.name
      this.member.isAdmin = this._member.isAdmin
    } else if (this.operation === '重置密码') {
      this.member.password = this._member.password
    }
    this.showOperationForm = false
    this.operation = ''
  }
  submitting:boolean = false
=======
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
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
  submit() {
    let that = this
    this.$refs.member.validate(async (valid:boolean) => {
      if (valid) {
<<<<<<< HEAD
        that.submitting = true
        let resp: any
        if (that.operation === '添加成员') {
          resp = await http.post('/api/member', {
            account: that.member.account,
            name: that.member.name,
            isAdmin: that.member.isAdmin,
            password: that.member.password
          })
        } else if (that.operation === '编辑成员') {
          resp = await http.put('/api/member/' + that.member.id, {
            name: that.member.name,
            isAdmin: that.member.isAdmin
          })
        } else if (that.operation === '重置密码') {
          resp = await http.put('/api/member/' + that.member.id, {
            newPassword: that.member.newPassword,
            adminPassword: that.member.adminPassword
          })
        }
        if (resp.errCode === 0) {
          if (that.operation === '添加成员' && resp.id) {
            that.member.id = resp.id
            that.memberList.push(that.member)
          }
          that.$message({type: 'success', message: that.operation + '成功'})
          that.showOperationForm = false
=======
        let resp:any = that.member.id
        ? await http.put('/api/member/' + that.member.id, that.member)
        : await http.post('/api/member', that.member)
        if (resp.data.errCode === 0) {
          if (!that.member.id) { that.memberList.push(that.member) }
          that.$message({type: 'success', message: resp.data.errMsg || '添加成功'})
          that.dialogFormVisible = false
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
          that.member = {
            account: '',
            isAdmin: false,
            password: ''
          }
        } else {
<<<<<<< HEAD
          that.$message({type: 'error', message: resp.errMsg || (that.operation + '失败')})
        }
        that.submitting = false
=======
          that.$message({type: 'error', message: resp.data.errMsg || '添加失败'})
        }
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
      }
      return false
    })
  }
}
</script>

<style lang="stylus" scoped>
.member
<<<<<<< HEAD
  margin 0 auto
  padding-top 50px
  width 960px
=======
  padding 50px
.member-list-table
  margin 0 auto
  width 1000px
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
.dialog-form
  padding 0 20px 20px
</style>
