<template lang="pug">
  el-form.ov-a.api-add(ref='api', :model='api', :rules='rules', label-position='right', label-width='100px')
    el-row(:gutter='20')
      el-col(:span='7')
        el-form-item.ta-l(label='所属模块', prop='module')
          el-select.w-200(v-model='api.module', filterable, allow-create, placeholder="选择或新建模块")
            el-option(v-for='(m, index) in modules', :key='index', :value='m', :label='m')
        el-form-item.ta-l(label='接口名称', prop='name')
          el-input.w-200(v-model='api.name')
      el-col(:span='7')
        el-form-item.ta-l(label='请求路径', prop='url')
          el-input.w-200(v-model='api.url')
        el-form-item.ta-l(label='请求方法', prop='method')
          el-select.w-200(v-model='api.method')
            el-option(v-for='(m, index) in methods', :value='m', :key='index')
    el-row
      template(v-for='(params, index) in [api.request.paramList, api.response.paramList]')
        el-form-item.ta-l(:label='index===0?"请求参数":"响应参数"', :key='index')
          template
            el-table(:data='params')
              el-table-column(label='', width='80')
                template(scope='scope')
                  el-button(size='mini', @click='swapParam(params, scope.$index, scope.$index === 0 ? params.length - 1 : scope.$index - 1)') ↑
                  el-button(size='mini', @click='swapParam(params, scope.$index, scope.$index === params.length - 1 ? 0 : scope.$index + 1)') ↓
              el-table-column(prop='name', label='参数名', header-align='center', width='200')
                template(scope='scope')
                  el-input.d-ib.w-150(v-model='scope.row.name', size='small')
                  el-button.p-a.cu-p.btn-add-child-param(title='点击添加成员属性', v-if='scope.row.type==="Object" || scope.row.type === "Array"', size='mini', icon='plus', type='primary', @click='addParam(params, scope.row, scope.$index)')
              el-table-column(prop='type', label='类型', header-align='center', width='130')
                template(scope='scope')
                  el-select(v-model='scope.row.type', size='small')
                    el-option(v-for='(t, index) in types', :value='t', :key='index', :label='t')
              el-table-column(prop='required', label='必传', width='70', align='center')
                template(scope='scope')
                  el-checkbox(v-model='scope.row.required', size='normal')
              el-table-column(prop='mock', label='Mock', header-align='center', min-width='100')
                template(scope='scope')
                  el-input(v-model='scope.row.mock', size='small')
              el-table-column(prop='rule', label='校验规则', header-align='center', min-width='100')
                template(scope='scope')
                  el-input(v-model='scope.row.rule', size='small')
              el-table-column(prop='remark', label='说明', header-align='center', min-width='100')
                template(scope='scope')
                  el-input(v-model='scope.row.remark', size='small')
              el-table-column(label='', width='50')
                template(scope='scope')
                  el-button(size='mini', @click='delParam(params, scope.row, scope.$index)', icon='close', type='danger')
            div.append-table-row.ta-c
              el-button(type='primary', size='small', icon='plus', @click='addParam(params)')
        el-form-item.ta-l(:label='index===0?"请求示例":"响应示例"')
          el-button(v-if='index===0', type='primary', size='small', @click='preMock("request")') 刷新预览
          el-button(v-if='index===1', type='primary', size='small', @click='preMock("response")') 刷新预览
          pre(v-if='index===0') {{api.method==='GET'?requestUrl:requestExample}}
          pre(v-if='index===1') {{responseExample}}
    el-form-item.ta-l(label='高级配置')
      div(@click='showAdvancedConfig=!showAdvancedConfig')
        el-button(:icon='showAdvancedConfig?"arrow-down":"arrow-right"', type='text', @click.stop='showAdvancedConfig=!showAdvancedConfig')
    template(v-if='showAdvancedConfig')
      el-form-item.cl-b.ta-l(label='开启测试')
        el-switch(v-model='api.isTest', on-text='on', off-text='off')
      el-form-item.ta-l(label='延迟响应')
        el-input.w-200(v-model='api.delay')
        span 毫秒
      el-form-item.ta-l(label='异常处理')
        el-table(:data='api.errConfig', border)
          el-table-column(label='是否启用', prop='enabled')
            template(scope='scope')
              el-checkbox(v-model='scope.row.enabled', size='small')
          el-table-column(label='异常结果（json格式）')
            template(scope='scope')
              el-input(v-model='scope.row.response', size='small')
          el-table-column(label='异常概率（用于调试）')
            template(scope='scope')
              el-input(v-model='scope.row.probability', size='small')
          el-table-column(label='异常描述')
            template(scope='scope')
              el-input(v-model='scope.row.description', size='small')
          el-table-column(label='操作', width='50')
            template(scope='scope')
              el-button(size='mini', @click='delErr(api.errConfig, scope.row, scope.$index)', icon='close', type='danger')
        div.append-table-row.ta-c
          el-button(type='primary', size='small', icon='plus', @click='addErr(api.errConfig)')
      template(v-for='(header, index) in [api.request.headerList, api.response.headerList]')
        el-form-item(:label='index===0?"请求header":"响应header"', :key='index')
          el-table(:data='header', border)
            el-table-column(label='key')
              template(scope='scope')
                el-input(v-model='scope.row.key', size='small')
            el-table-column(label='value')
              template(scope='scope')
                el-input(v-model='scope.row.value', size='small')
            el-table-column(label='操作', width='50')
              template(scope='scope')
                el-button(size='mini', @click='delHeader(header, scope.row, scope.$index)', icon='close', type='danger')
          div.append-table-row.ta-c
            el-button(type='primary', size='small', icon='plus', @click='addHeader(header)')
    el-form-item.ta-c
      el-button.mr-50(@click='cancel()') 取消
      el-button(type='primary', @click='submit()') {{ api.id ? '保存修改' : '提交' }}

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
import {gId} from '../../utils/util.ts'
import Mock from 'mockjs'
// import _ from 'lodash'
interface Api extends Object {
  version?: string,
  id?: string,
  name: string,
  url: string,
  method: string,
  module?: string,
  isTest?: boolean,
  request: {
    paramList: Param[],
    headerList: any[]
  },
  response: {
    paramList: Param[],
    headerList: any[]
  },
  delay?: number,
  errConfig?: Err[]
}
interface Err extends Object {
  enabled?: string,
  response?: string,
  probability?: string,
  description?: string
}
interface Param extends Object {
  id: string,
  pid: string,
  cid: string[],
  name: string,
  type: string,
  required: boolean,
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
  showAdvancedConfig: boolean = false
  methods: string[] = ['GET', 'POST', 'PUT', 'DELETE']
  types: string[] = ['String', 'Object', 'Array', 'Number', 'Boolean', 'File']
  modules: string[] = []
  // 从父组件共享属性，要做声明， 并且只读，赋值会报错，此时建议
  proId: string
  apiId: string
  api: Api = {
    isTest: false,
    name: '',
    url: '',
    method: '',
    module: '',
    request: {
      paramList: [],
      headerList: []
    },
    response: {
      paramList: [],
      headerList: []
    },
    errConfig: []
  }
  mode: string = ''
  rules: Object = {
    name: [{required: true}],
    module: [{required: true}],
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
    let resp:any = await http.get('/api/project/' + this.proId + '/api/module')
    this.modules = resp.moduleList
    if (this.mode === 'edit' || this.mode === 'view') {
      this.apiId = this.$route.params.apiId
      let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId)
      this.api = resp
    } else if (this.mode === 'add') {
      this.apiId = ''
      this.api = {
        isTest: false,
        name: '',
        url: '/',
        method: 'GET',
        module: this.$route.query.module,
        request: {
          paramList: [],
          headerList: []
        },
        response: {
          paramList: [],
          headerList: []
        },
        errConfig: []
      }
    }
  }
  requestUrl: string = ''
  requestExample:any = ''
  responseExample: any = ''
  async submit() {
    let that = this
    that.$refs.api.validate(async (valid:boolean) => {
      if (valid) {
        let op = that.$route.mode === 'edit' ? '修改' : '添加'
        await that.$confirm('确认' + op + 'api', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        let resp:any = that.mode === 'edit'
        ? await http.put('/api/project/' + that.proId + '/api/' + that.$route.params.apiId, that.api)
        : await http.post('/api/project/' + that.proId + '/api', that.api)
        if (resp.status === 200) {
          if (resp.data.errCode === 0) {
            that.$message({ type: 'success', message: resp.data.errMsg || '添加成功' })
            let id:string = that.$route.params.apiId || resp.data.id
            that.$router.push({path: '/project/' + that.proId + '/api/view/' + id, query: {mode: 'view'}})
            // that.$router.go(0)
          } else {
            that.$message({ type: 'error', message: resp.data.errMsg || '添加失败' })
          }
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
    let pid:string = 'root'
    if (row) {
      row.cid.push(id)
      pid = row.id
    }
    params.splice(row ? index + 1 : params.length, 0, {
      id: id,
      pid: pid,
      cid: [],
      name: '',
      type: 'String',
      required: true,
      mock: '',
      rule: '',
      remark: ''
    })
  }
  addErr(errConfig:any) {
    errConfig.push({
      enabled: 'false',
      description: '',
      probability: '',
      response: '{}'
    })
  }
  delErr(errConfig:any, row:any, index:any) {
    errConfig.splice(index, 1)
  }
  addHeader(header:any) {
    header.push({
      key: '',
      value: ''
    })
  }
  delHeader(header:any, row:any, index:any) {
    header.splice(index, 1)
  }
  swapParam(array:any, index1:any, index2:any) {
    array[index1] = array.splice(index2, 1, array[index1])[0]
    return array
  }
  preMock(tag:any) {
    let obj:any = {}
    if (tag === 'request') {
      if (this.api.method === 'GET') {
        let url:string = this.api.url
        this.api.request.paramList.forEach((p:any) => {
          let re:any = new RegExp(':' + p.name, 'g')
          url = url.replace(re, Mock.mock(p.mock))
        })
        this.requestUrl = url
      } else {
        obj = this.makeJson(this.api.request.paramList, 'root')
        this.requestExample = JSON.stringify(obj, null, 4)
      }
    } else if (tag === 'response') {
      obj = this.makeJson(this.api.response.paramList, 'root')
      this.responseExample = JSON.stringify(obj, null, 4)
    }
  }
  makeJson(list:any, pid:any) {
    let root:any = {}
    list.forEach((p:any) => {
      if (p.pid === pid) {
        let t = p.type
        if (t === 'Number' || t === 'String' || t === 'Boolean') {
          root[p.name] = Mock.mock(p.mock)
        } else if (t === 'Object') {
          root[p.name] = this.makeJson(list, p.id)
        } else if (t === 'Array') {
          let array:any[] = []
          list.forEach((pp:any) => {
            if (pp.pid === p.id) {
              let t:any = pp.type
              if (t === 'Number' || t === 'String' || t === 'Boolean') {
                array.push(Mock.mock(pp.mock))
              } else if (t === 'Object') {
                array.push(this.makeJson(list, pp.id))
              } else if (t === 'Array') {
                let arr:any = []
                let obj:any = this.makeJson(list, pp.id)
                for (let prop in obj) {
                  if (obj.hasOwnProperty(prop)) {
                    arr.push(obj[prop])
                  }
                }
                let z:any = {}
                z['array|' + pp.mock] = arr
                array.push(Mock.mock(z).array)
              }
            }
          })
          let obj:any = {}
          obj['array|' + p.mock] = array
          root[p.name] = Mock.mock(obj).array
        }
      }
    })
    return root
  }
}
</script>
<style lang="stylus" scoped>
.append-table-row
  border 1px solid #dfe6ec
  border-top 0
.api-add
  padding 20px
  width 100%
  height 100%
.btn-add-child-param
  top 50%
  transform translateY(-50%)
</style>

