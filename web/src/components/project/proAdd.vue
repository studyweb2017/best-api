<template lang='pug'>
  div
    div.pro-add
      el-form(ref='pro', :rules='rules', :model='pro', label-position='right', label-width='80px')
        el-form-item(label='项目名称', prop='name')
          el-input(v-model='pro.name', placeholder="xiangmu1", required)
        el-form-item(label='项目描述', prop='description')
          el-input(v-model='pro.description', placeholder="this is a...")
        el-form-item(label='测试地址', prop='testUrl')
          el-input(v-model='pro.testUrl', placeholder="192.11.3.3")
        el-form-item(label='成员列表', prop='members')
          div.member-list.border-4
            el-row(v-for='(m, index) in pro.members', :key='m.id')
              el-col.ta-l(:span='18')
                span.ml-10 {{ m.name }}
              el-col(:span='4')
                el-select(v-model='m.role', size='small')
                  el-option(v-for='(r, index) in roles', :value='r.name', :key='r.index', :label='r.name')
              el-col(:span='2')
                el-button(@click='delMember(index)', type='text', size='small') 删除
        el-form-item(label='新增成员')
          el-row(:gutter='10')
            el-col(:span='5')
              el-form-item(prop='newMember')
                el-select(v-model='newMember', value-key='name', placeholder='姓名', size='small', filterable)
                  el-option(v-for='m in members', :value='m', :key='m.id', :label='m.name')
            el-col(:span='5')
              el-form-item(prop='newMemberRole')
                el-select(v-model='newMemberRole', placeholder='身份', size='small')
                  el-option(v-for='(ro, index) in roles', :value='ro.name', :key='ro.index', :label='ro.name')
            el-col(:span='2')
              el-button(@click='addMember()', type='text') 添加
          el-row
            el-table(:data='roles', border, fit, style='width: 100%', align='center')
              el-table-column(prop='name', label='身份', align='center')
              el-table-column(prop='readApi', label='查看项目api', align='center')
                template(scope='scope')
                  span.el-icon-close(v-if='!scope.row.readApi')
                  span.el-icon-check(v-if='scope.row.readApi')
              el-table-column(prop='editApi', label='编辑项目api', align='center')
                template(scope='scope')
                  span.el-icon-close(v-if='!scope.row.editApi')
                  span.el-icon-check(v-if='scope.row.editApi')
              el-table-column(prop='editProject', label='编辑项目', align='center')
                template(scope='scope')
                  span.el-icon-close(v-if='!scope.row.editProject')
                  span.el-icon-check(v-if='scope.row.editProject')
        el-form-item.ta-l(label='高级选项')
          el-form-item(prop='apiChangedInform')
              el-checkbox.d-b(v-model='pro.apiChangedInform') 接口修改通知
          el-form-item(prop='openTest')
              el-checkbox.d-b(v-model='pro.openTest') 开启测试功能
          el-form-item(prop='testFailedInform')
              el-checkbox.d-b(v-model='pro.testFailedInform') 测试失败通知
        //- el-button.mr-50(type='ghost', @click='reset()') 重置
        el-button.mr-50(@click='$router.go(-1)') 返回
        el-button(type='primary', @click='submit()') {{submitting?'提交中':'提交'}}
</template>
<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
import cache from '../../service/cache.ts'
import rules from '../../service/rules.ts'
interface Project extends Object {
  name: string,
  description?: string,
  testUrl?: string,
  apiChangedInform: boolean,
  testFailedInform: boolean,
  openTest: boolean,
  members: Member[]
}
interface Member extends Object {
  id: string,
  name: string,
  group?: Object,
  role?: string
}
interface Role extends Object {
  name: string,
  editProject: boolean,
  editApi: boolean,
  readApi: boolean
}
@Component
export default class proAdd extends Vue {
  $refs: any
  $route: any
  $router: any
  $confirm: any
  $message: any
  rules: Object = {
    name: rules.name,
    testUrl: rules.testUrl,
    members: [
      {type: 'array', required: true, message: '请至少选择一个项目成员'}
    ]
  }
  user: any = {}
  pro: Project = {
    name: '',
    description: '',
    testUrl: '',
    openTest: true,
    apiChangedInform: true,
    testFailedInform: true,
    members: []
  }
  roles: Role[] = []
  members: Member[] = []
  newMember: Member = {id: '', name: ''}
  newMemberRole: string = ''
  editMemberRole: string = ''
  async beforeMount() {
    if (this.$route.params.proId) {
      let resp1: any = await http.get('/api/project/' + this.$route.params.proId)
      this.pro = resp1
    } else {
      let user:any = JSON.parse(cache.get('user'))
      this.pro.members.push({
        id: user.id,
        name: user.name,
        role: 'master'
      })
    }
    let resp2:any = await http.get('/api/role')
    this.roles = resp2.roleList
    let resp3:any = await http.get('/api/member')
    this.members = resp3.memberList
  }
  addMember() {
    let newer: Member = {id: '', name: '', role: ''}
    if (this.newMember.name && this.newMemberRole) {
      newer.name = this.newMember.name
      newer.id = this.newMember.id
      newer.role = this.newMemberRole
      this.pro.members.push(newer)
      this.members = this.members.filter((m:any) => {
        return m.id !== this.newMember.id
      })
      this.newMember = this.members[0]
    }
  }
  delMember(index: number) {
    this.members.unshift(this.pro.members[index])
    this.pro.members.splice(index, 1)
  }
  reset() {
    this.$refs.pro.resetFields()
    this.newMember = {id: '', name: ''}
    this.newMemberRole = ''
  }
  submitting:boolean = false
  submit() {
    let that = this
    that.$refs.pro.validate(async (valid: boolean) => {
      if (valid) {
        that.submitting = true
        let op = that.$route.params.proId ? '修改' : '添加'
        let resp:any = that.$route.params.proId
          ? await http.put('/api/project/' + that.$route.params.proId, that.pro)
          : await http.post('/api/project', that.pro)
        if (resp.errCode === 0) {
          that.$router.push('/project/list')
          that.$message({ type: 'success', message: op + '成功！' })
        } else {
          that.$message({ type: 'error', message: resp.errMsg })
        }
        that.submitting = false
      }
      return false
    })
  }
}
</script>
<style lang='stylus' scoped>
.btn-go-back
  margin-right 750px
  margin-bottom 20px
.ml-15
  margin-left 15px
.pro-add
  margin 0 auto
  padding 50px 0
  width 960px
.el-form
  padding 40px 50px 10px
  border 1px solid #ddd
.el-row
  margin-bottom 10px
.member-list
  padding-top 10px
  min-height 36px
  .el-row
    background-color #e4f0fb
    &:nth-child(even)
      background-color #eef1f6
  // .el-row:nth-child(odd)
</style>
