<template lang="pug">
  el-form(ref='api', :model='api', :rules='rules', label-position='right', label-width='100px')
    el-row
      el-col(:span='10')
        el-form-item.ta-l(label='开启测试')
          el-switch(v-model='api.isTest', on-text='on', off-text='off')
        el-form-item.ta-l(label='接口名称', prop='name')
          el-input.w-200(v-model='api.name')
        el-form-item.ta-l(label='请求路径', prop='url')
          el-input.w-200(v-model='api.url')
        el-form-item.ta-l(label='请求方法', prop='method')
          el-select.w-200(v-model='api.method')
            el-option(v-for='(m, index) in methods', :value='m', :key='index')
      el-col(:span='14')
        el-form-item.ta-l(label='当前版本')
          span {{api.currentVersion + '（最新）'}}
        el-form-item.ta-l(label='修改时间')
          span {{api.updateTime}}
        el-form-item.ta-l(label='修改人')
          span {{api.updateMan}}
    el-row
      template(v-for='(params, index) in [api.requestParams, api.responseParams]')
        el-form-item.ta-l(:label='index===0?"请求参数":"响应参数"', :key='index')
          template
            el-table(:data='params', border)
              el-table-column(label='上下移', width='80')
                template(scope='scope')
                  el-button(size='mini', @click='swapParam(params, scope.$index, scope.$index === 0 ? params.length - 1 : scope.$index - 1)') ↑
                  el-button(size='mini', @click='swapParam(params, scope.$index, scope.$index === params.length - 1 ? 0 : scope.$index + 1)') ↓
              el-table-column(prop='name', label='参数名', header-align='center', width='200')
                template(scope='scope')
                  el-input.d-ib.w-150(v-model='scope.row.name', size='small')
                  el-button.p-a.cu-p.btn-add-child-param(title='点击添加成员属性', v-if='scope.row.type==="object" || scope.row.type==="array"', size='mini', icon='plus', type='primary', @click='addParam(params, scope.row, scope.$index)')
              el-table-column(prop='type', label='类型', header-align='center', width='125')
                template(scope='scope')
                  el-select(v-model='scope.row.type', size='small')
                    el-option(v-for='(t, index) in types', :value='t', :key='index', :label='t')
              el-table-column(prop='required', label='是否必传', header-align='center', width='125')
                template(scope='scope')
                  el-select(v-model='scope.row.required', size='small')
                    el-option(v-for='(b, index) in ["true", "false"]', :value='b', :key='index', :label='b')
              el-table-column(prop='mock', label='模拟值', header-align='center', min-width='100')
                template(scope='scope')
                  el-input(v-model='scope.row.mock', size='small')
              el-table-column(prop='rule', label='校验规则', header-align='center', min-width='100')
                template(scope='scope')
                  el-input(v-model='scope.row.rule', size='small')
              el-table-column(prop='remark', label='说明', header-align='center', min-width='100')
                template(scope='scope')
                  el-input(v-model='scope.row.remark', size='small')
              el-table-column(label='操作', width='50')
                template(scope='scope')
                  el-button(size='mini', @click='delParam(params, scope.row, scope.$index)', icon='close', type='danger', :disabled='disabled')
            div.append-table-row.ta-c
              el-button(type='primary', size='small', icon='plus', @click='addParam(params)', :disabled='disabled')
        el-form-item.ta-l(:label='index===0?"请求示例":"响应示例"')
          el-button(v-if='index===0', type='primary', size='small', @click='previewExample(params, requestExample)') 刷新预览
          el-button(v-if='index===1', type='primary', size='small', @click='previewExample(params, responseExample)') 刷新预览
          pre(v-if='index===0') {{JSON.stringify(requestExample, null, 4)}}
          pre(v-if='index===1') {{JSON.stringify(responseExample, null, 4)}}
    el-form-item.ta-c
      el-button.mr-50(@click='cancel()') 取消
      el-button(type='primary', @click='submit()') {{ apiId ? '保存修改' : '提交' }}

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
// import { Watch } from 'vue-property-decorator'
import http from '../../service/http.ts'
import {gId} from '../../utils/util.ts'
import Mock from 'mockjs'
import rules from '../../service/rules.ts'
// import _ from 'lodash'
interface Tree extends Object {
  id: string,
  name?: string,
  label?: string,
  childrenId: string[],
  children: Tree[]
}
interface Api extends Object {
  id?: string,
  name?: string,
  url?: string,
  method?: string,
  module?: string,
  isTest?: boolean,
  requestParams?: Param[],
  responseParams?: Param[]
}
interface Param extends Object {
  id: string,
  pid: string,
  cid: string[],
  name: string,
  type: string,
  required: string,
  mock: string,
  rule: string,
  remark?: string
}
@Component({
})
export default class proApiDetail extends Vue {
  // 变量类型声明
  Mock: any
  $refs: any
  $route: any
  $router: any
  $message: any
  $confirm: any
  // 下拉列表选项
  methods: string[] = ['get', 'post', 'put', 'delete']
  types: string[] = ['string', 'object', 'number', 'boolean', 'double', 'array-number', 'array-string', 'array-boolean', 'array-object']
  // 从父组件共享属性，要做声明， 并且只读，赋值会报错，此时建议
  proId: string
  apiId: string
  api: Api = {
    isTest: true,
    name: '',
    url: '',
    method: '',
    requestParams: [],
    responseParams: []
  }
  // @Watch('apiId')
  // allDisabled: boolean = false
  get disabled() {
    return this.$route.query.mode === 'view'
  }
  mode: string = ''
  rules: Object = {
    name: rules.name,
    url: [
      {type: 'string', required: true, message: '请输入请求路径'},
      {message: '请求路径不合法,"/"开头', pattern: /^\//}],
    method: [{type: 'string', required: true, message: '请选择一个请求方法'}],
    requestParams: [
      {type: 'array', required: false, message: '请至少选择一个项目成员'}
    ],
    responseParams: [
      {type: 'array'}
    ]
  }
  async beforeMount() {
    this.proId = this.$route.params.proId
    this.mode = this.$route.query.mode
    if (this.mode === 'edit' || this.mode === 'view') {
      this.apiId = this.$route.params.apiId
      let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId)
      this.api = resp
    } else if (this.mode === 'add') {
      this.apiId = ''
      this.api = {
        isTest: true,
        name: '',
        url: '',
        method: 'get',
        requestParams: [],
        responseParams: []
      }
    }
  }
  requestExample:any = {}
  responseExample: any = {}
  async submit() {
    let that = this
    that.$refs.api.validate(async (valid:boolean) => {
      if (valid) {
        let op = that.$route.mode === 'edit' ? '修改' : '添加'
        try {
          await that.$confirm('确认' + op + 'api', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
          let resp:any = that.mode === 'edit'
          ? await http.put('/api/project/' + that.proId + '/api/' + that.$route.params.apiId)
          : await http.post('/api/project/' + that.proId + '/api')
          if (resp.status === 200) {
            if (resp.data.errCode === 0) {
              that.$message({ type: 'success', message: resp.data.errMsg })
              that.$router.push('/project/' + that.proId + '/api')
            } else {
              that.$message({ type: 'error', message: resp.data.errMsg })
            }
          }
        } catch (err) {
          that.$message({ type: 'info', message: '已取消' + op })
        }
      }
      return false
    })
  }
  delParam(params:any, row:any, index:any) {
    // 待删除的当前行参数id，和 该参数包含的递归子元素cid集合
    if (row.cid.length < 1) {
      params.splice(index, 1)
      if (row.pid) {
        params.forEach((p:any) => {
          if (p.id === row.pid) {
            p.cid.splice(p.cid.indexOf(row.id), 1)
          }
        })
      }
    } else {
      this.$message({ type: 'info', message: '若删除列表或对象，请先删除其包含的成员参数' })
    }
  }
  addParam(params:any, row?:any, index?:any) {
    let id: string = gId()
    let level:number = 1
    let pid:string = ''
    if (row) {
      row.cid.push(id)
      level = row.level + 1
      pid = row.id
    }
    params.splice(row ? index + 1 : params.length, 0, {
      level: level,
      id: id,
      pid: pid,
      cid: [],
      name: '',
      type: '',
      required: '',
      mock: '',
      rule: '',
      remark: ''
    })
  }
  swapParam(array:any, index1:any, index2:any) {
    array[index1] = array.splice(index2, 1, array[index1])[0]
    return array
  }
  previewExample(params:any, example:any) {
    let root:any = {}
    let newList:any[] = params.filter((p:any) => {
      return p.pid.length > 0
    })
    this.makeJson(newList, root)
    example = root
  }
  makeJson(list:any, root:any) {
    let obj:any = {}
    list.forEach((p:any) => {
      let t = p.type
      if (t === 'number' || t === 'string' || t === 'double' || t === 'boolean') {
        obj[p.name] = Mock.mock(p.mock)
      } else if (t === 'object') {
        let newRoot:any = {}
        let newList = list.filter((item:any) => {
          return p.cid.indexOf(item.id) > -1
        })
        this.makeJson(newList, newRoot)
        obj[p.name] = newRoot
      } else if (t === 'array-number' || t === 'array-string' || t === 'array-double' || t === 'array-boolean') {
        let array:any[] = []
        let newList = list.filter((item:any) => {
          return p.cid.indexOf(item.id) > -1
        })
        newList.forEach((pp:any) => {
          array.push(Mock.mock(pp.mock))
        })
        let min:any = p.mock.split('-')[0] - 0
        let max:any = p.mock.split('-')[1] - 0
        let random:any = Math.random() * (max - min) + min
        let newArray:any[] = []
        while (random) {
          newArray.concat(array)
          random--
        }
        obj[p.name] = newArray
      } else if (t === 'array-object') {
        let array:any[] = []
        let obj:any = {}
        let newList = list.filter((item:any) => {
          return p.cid.indexOf(item.id) > -1
        })
        this.makeJson(newList, obj)
        array.push(obj)
        let min:any = p.mock.split('-')[0] - 0
        let max:any = p.mock.split('-')[1] - 0
        let random:any = Math.random() * (max - min) + min
        let newArray:any = []
        while (random) {
          newArray.concat(array)
          random--
        }
        obj[p.name] = newArray
      }
    })
    root = obj
  }
}
</script>
<style lang="stylus" scoped>
.append-table-row
  border 1px solid #dfe6ec
  border-top 0
.api-wrap
  padding 50px
  width 100%
  height 100%
.api-tree
  width 200px
  height auto
  .el-tree
    padding-bottom 20px
.api-detail
  padding-left 220px
  width 100%
  .el-form
    padding 20px
    width 100%
    height 100%
    border 1px solid #ddd
.btn-add-child-param
  top 50%
  transform translateY(-50%)
</style>

