<template lang='pug'>
  div.pro-add
    el-form(ref='pro', :rules='rules', :model='pro', label-position='right', label-width='80px')
      el-form-item(label='项目名称', prop='name')
        el-input(v-model='pro.name', placeholder="xiangmu1", required)
      el-form-item(label='项目描述', prop='description')
        el-input(v-model='pro.description', placeholder="this is a...")
      el-form-item(label='测试地址', prop='testUrl')
        el-input(v-model='pro.testUrl', placeholder="192.11.3.3")
      el-form-item(label='项目成员')
        el-row
          el-col(:span='5')
            el-form-item(prop='group')
              el-select(v-model='group', value-key='name', placeholder="小组")
                el-option(v-for='g in groups', :value='g', :key='g.id', :label='g.name')
          el-col(:span='5')
            el-form-item(prop='member')
              el-select(v-model='member', value-key='name', placeholder='姓名')
                el-option(v-for='m in group.members', :value='m', :key='m.id', :label='m.name')
          el-col(:span='5')
            el-form-item(prop='memberRole')
              el-select(v-model='memberRole', placeholder="权限")
                el-option(v-for='role in roles', :value='role', :key='role', :label='role')
          el-col(:span='1')
            el-button(@click='addMember(member, memberRole)') 添加
        el-row
          el-table(:data='pro.members', border, fit, style='width: 100%', align='center')
            el-table-column(prop='group', label='小组', align='center')
            el-table-column(prop='name', label='姓名', align='center')
            el-table-column(prop='role', label='权限', align='center')
            el-table-column(label='操作', align='center')
              template(scope='scope')
                el-button(@click.native.prevent='delMember(scope.$index)', type='text', size='small') 移除
      el-form-item.ta-l(label='接口配置')
        el-checkbox.d-b.ml-15(v-model='pro.apiChangedInform') 接口修改通知
        el-checkbox.d-b(v-model='pro.openTest') 开启测试功能
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
interface project extends Object {
  name: string,
  description: string,
  testUrl: string,
  openTest: boolean,
  apiChangedInform: boolean,
  testFailedInform: boolean,
  members: any[]
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
    testUrl: rules.testUrl
  }
  pro: project = {
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
  // pro: any = {}
  memberRole: string = ''
  roles: string[] = [
    'master',
    'developer',
    'guest'
  ]
  groups: any[] = []
  group: Object = {}
  member: any = {}
  async beforeMount() {
    let resp1: any = await http.get('/api/group')
    this.groups = resp1.groups
    if (this.$route.params.id) {
      let resp2: any = await http.get('/api/project/' + this.$route.params.id)
      this.pro = resp2
    }
    this.user = JSON.parse(Cache.get('user'))
  }
  addMember() {
    if (this.member && this.memberRole) {
      this.member.role = this.memberRole
      this.pro.members.push(this.member)
    }
  }
  delMember(index: number) {
    this.pro.members.splice(index, 1)
  }
  reset() {
    this.$refs.pro.resetFields()
  }
  submit() {
    let that = this
    that.$refs.pro.validate(async (valid: boolean) => {
      if (valid) {
        let op = that.$route.params.id ? '修改' : '添加'
        try {
          await that.$confirm('确认' + op + '项目' + that.pro.name, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
          let resp:any = that.$route.params.id
           ? await http.put('/api/project/' + that.$route.params.id, that.pro)
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
  margin 50px auto
  width 800px
  padding 50px
  border 1px solid #ddd
.el-row
  margin-bottom 10px
</style>
