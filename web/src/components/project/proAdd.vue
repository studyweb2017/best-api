<template lang='pug'>
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
            el-form-item(prop='newGroup')
              el-select(v-model='newGroup', value-key='name', placeholder="小组", size='small')
                el-option(v-for='g in groups', :value='g', :key='g.id', :label='g.name')
          el-col(:span='5')
            el-form-item(prop='newMember')
              el-select(v-model='newMember', value-key='name', placeholder='姓名', size='small')
                el-option(v-for='m in newGroup.members', :value='m', :key='m.id', :label='m.name')
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
      el-form-item
        el-button(type='ghost', @click='reset()') 重置
        el-button(type='primary', @click='submit()') 提交
</template>
<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
import rules from '../../service/rules.ts'
import Cache from '../../service/cache.ts'
// import {formatApiToTree} from '../../utils/util.ts'
interface Project extends Object {
  name: string,
  description?: string,
  testUrl?: string,
  apiChangedInform: boolean,
  testFailedInform: boolean,
  openTest: boolean,
  testApi?: Api[],
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
interface Group extends Object {
  id: string,
  name: string,
  description?: string,
  members: Member[]
}
interface Tree extends Object {
  id: string,
  name?: string,
  label?: string,
  children: Tree[]
}
interface Api extends Object {
  id: string,
  name?: string,
  url?: string,
  method?: string,
  module?: string,
  version?: string
}
@Component
export default class proAdd extends Vue {
  $refs: any
  $route: any
  $router: any
  $confirm: any
  $message: any
  user: any = {}
  rules: Object = {
    name: rules.name,
    testUrl: rules.testUrl,
    members: [
      {type: 'array', required: true, message: '请至少选择一个项目成员'}
    ]
  }
  pro: Project = {
    name: '',
    description: '',
    testUrl: '',
    openTest: true,
    apiChangedInform: true,
    testFailedInform: true,
    members: [{
      id: this.user.id,
      name: this.user.name,
      group: this.user.group,
      role: 'master'
    }]
  }
  roles: Role[] = []
  groups: Group[] = []
  newGroup: Group = {id: '', name: '', members: []}
  newMember: Member = {id: '', name: ''}
  newMemberRole: string = ''
  editMemberRole: string = ''
  // apiList: Api[] = []
  // apiTree: Tree[] = []
  async beforeMount() {
    let resp1: any = await http.get('/api/group')
    this.groups = resp1.groups
    if (this.$route.params.proId) {
      let resp2: any = await http.get('/api/project/' + this.$route.params.proId)
      this.pro = resp2
      // let resp4: any = await http.get('api/project/' + this.$route.params.proId + '/api')
      // this.apiList = resp4.apiList
      // this.apiTree = formatApiToTree(resp4.apiList)
    }
    let resp3:any = await http.get('/api/role')
    this.roles = resp3.roleList
    this.user = JSON.parse(Cache.get('user'))
  }
  addMember() {
    let newer: Member = {id: '', name: '', role: ''}
    if (this.newMember.name && this.newMemberRole) {
      newer.name = this.newMember.name
      newer.id = this.newMember.id
      newer.role = this.newMemberRole
      this.pro.members.push(newer)
    }
  }
  delMember(index: number) {
    this.pro.members.splice(index, 1)
  }
  treeProps: Object = {
    children: 'children',
    label: 'name'
  }
  reset() {
    this.$refs.pro.resetFields()
    this.newGroup = {id: '', name: '', members: []}
    this.newMember = {id: '', name: ''}
    this.newMemberRole = ''
  }
  submit() {
    let that = this
    that.$refs.pro.validate(async (valid: boolean) => {
      if (valid) {
        let op = that.$route.params.proId ? '修改' : '添加'
        try {
          await that.$confirm('确认' + op + '项目' + that.pro.name, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
          let resp:any = that.$route.params.proId
           ? await http.put('/api/project/' + that.$route.params.proId, that.pro)
           : await http.post('/api/project', that.pro)
          if (resp.status === 200) {
            if (resp.data.errCode === 0) {
              that.$router.push('/project/list')
              that.$message({ type: 'success', message: op + '成功！' })
            } else {
              that.$message({ type: 'error', message: resp.data.errMsg })
            }
          }
        } catch (e) {
          that.$message({ type: 'info', message: '已取消' + op })
        }
      }
      return false
    })
  }
}
</script>
<style lang='stylus' scoped>
.ml-15
  margin-left 15px
.pro-add
  width 100%
  height 100%
.el-form
  margin 50px auto 0
  width 800px
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
