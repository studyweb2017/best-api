<template lang="pug">
  el-form.ov-a.api-add(ref='api', :model='api', :rules='rules', label-position='right', label-width='100px')
    el-row
      el-col(:span='16')
        el-row(:gutter='20')
          el-col(:span='7')
            el-form-item.ta-l(label='所属模块', prop='module')
              el-select.w-200(v-model='api.module', filterable, allow-create, placeholder="选择或新建模块")
                el-option(v-for='(m, index) in modules', :key='index', :value='m', :label='m')
            el-form-item.ta-l(label='接口名称', prop='name')
              el-input.w-200(v-model='api.name')
          el-col(:span='7')
            el-form-item.ta-l(label='请求路径', prop='url')
              el-input.w-200(v-model='api.url', @change='preJson("requestUrl")')
            el-form-item.ta-l(label='请求方法', prop='method')
              el-select.w-200(v-model='api.method')
                el-option(v-for='(m, index) in methods', :value='m', :key='index')
        el-form-item(label='url参数')
          el-table(:data='api.request.urlParams')
            el-table-column(label='必传', prop='required', width='50', align='center')
              template(scope='scope')
                el-checkbox(v-model='scope.row.required')
            el-table-column(label='参数名', prop='name', width='150', align='center')
              template(scope='scope')
                el-input(v-model='scope.row.name', size='small', @change='preJson("requestUrl")')
            el-table-column(label='Mock', prop='mock', width='150', align='center')
              template(scope='scope')
                el-input(v-model='scope.row.mock', size='small', @change='preJson("requestUrl")')
            el-table-column(label='说明', prop='remark', min-width='100')
              template(scope='scope')
                el-input(v-model='scope.row.remark', size='small')
            el-table-column(label='', width='50')
                template(scope='scope')
                  el-button(size='mini', @click='delItem("urlParam", api.request.urlParams, scope.row, scope.$index)', icon='close', type='danger')
          div.append-table-row.ta-c
            el-button(type='primary', size='small', icon='plus', @click='addItem("urlParam", api.request.urlParams)')
        template(v-for='(params, index) in [api.request.paramList, api.response.paramList]')
          el-form-item.ta-l(:label='index===0?"请求参数":"响应参数"', :key='index')
            template
              el-table(:data='params')
                el-table-column(prop='name', label='参数名', header-align='left', width='250')
                  template(scope='scope')
                    template(v-for='(id, index) in scope.row.ancestor')
                      span.d-ib.icon-node-space-2.f-l(v-if='index>1')
                    span.d-ib.icon-node-space-1.f-l(v-if='scope.row.ancestor.length>1')
                    span.d-ib.icon-node.f-l(v-if='scope.row.ancestor.length>1')
                    el-input.d-ib.w-150.param-name(v-model='scope.row.name', size='small', :class='scope.row.className', @change='index===0?preJson("request"):preJson("response")')
                    el-button.p-a.cu-p.btn-add-child-param(title='点击添加成员属性', v-if='scope.row.type==="Object" || scope.row.type === "Array"', size='mini', icon='plus', type='primary', @click='addParam(params, scope.row, scope.$index)')
                el-table-column(prop='type', label='类型', header-align='center', width='105')
                  template(scope='scope')
                    el-select(v-model='scope.row.type', size='small', @change='index===0?preJson("request"):preJson("response")')
                      el-option(v-for='(t, index) in types', :value='t', :key='index', :label='t')
                el-table-column(prop='required', label='必传', width='50', align='center')
                  template(scope='scope')
                    el-checkbox(v-model='scope.row.required', size='normal')
                el-table-column(prop='mock', label='Mock', header-align='center', min-width='100')
                  template(scope='scope')
                    el-input(v-model='scope.row.mock', size='small', @change='index===0?preJson("request"):preJson("response")')
                el-table-column(prop='remark', label='说明', header-align='center', min-width='100')
                  template(scope='scope')
                    el-input(v-model='scope.row.remark', size='small')
                el-table-column(label='', width='50')
                  template(scope='scope')
                    el-button(size='mini', @click='delParam(params, scope.row, scope.$index)', icon='close', type='danger')
              div.append-table-row.ta-c
                el-button(type='primary', size='small', icon='plus', @click='addParam(params)')
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
              el-table-column(label='启用', prop='enabled', width='50')
                template(scope='scope')
                  el-checkbox(v-model='scope.row.enabled', size='small')
              el-table-column(label='异常结果（json格式）', min-width='200')
                template(scope='scope')
                  el-input(v-model='scope.row.response', size='small', width='50')
              el-table-column(label='异常概率（用于调试）')
                template(scope='scope')
                  el-input(v-model='scope.row.probability', size='small', min-width='200')
              el-table-column(label='异常描述')
                template(scope='scope')
                  el-input(v-model='scope.row.description', size='small')
              el-table-column(label='操作', width='50')
                template(scope='scope')
                  el-button(size='mini', @click='delItem("err", api.errConfig, scope.row, scope.$index)', icon='close', type='danger')
            div.append-table-row.ta-c
              el-button(type='primary', size='small', icon='plus', @click='addItem("err", api.errConfig)')
          template(v-for='(header, index) in [api.request.headerList, api.response.headerList]')
            el-form-item(:label='index===0?"请求header":"响应header"', :key='index')
              el-table(:data='header', border)
                el-table-column(label='key', width='200')
                  template(scope='scope')
                    el-input(v-model='scope.row.key', size='small')
                el-table-column(label='value')
                  template(scope='scope')
                    el-input(v-model='scope.row.value', size='small')
                el-table-column(label='操作', width='50')
                  template(scope='scope')
                    el-button(size='mini', @click='delItem("header", header, scope.row, scope.$index)', icon='close', type='danger')
              div.append-table-row.ta-c
                el-button(type='primary', size='small', icon='plus', @click='addItem("header", header)')
      el-col(:span='8')
        el-form-item.ta-l(label='请求url')
          pre.pre {{requestUrl}}
        el-form-item.ta-l(label='请求体')
          el-button(type='primary', size='small', @click='preJson("request")') 刷新预览
          pre.pre {{requestExample}}
        el-form-item.ta-l(label='响应体')
          el-button(type='primary', size='small', @click='preJson("response")') 刷新预览
          pre.pre {{responseExample}}
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
    urlParams: Param[],
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
  ancestor: string[],
  name: string,
  type: string,
  required: boolean,
  mock: string,
  remark?: string,
  className?: string
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
      urlParams: [],
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
    this.modules = resp.moduleList || []
    if (this.mode === 'edit' || this.mode === 'view') {
      this.apiId = this.$route.params.apiId
      let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId)
      this.api = resp
    } else if (this.mode === 'add') {
      this.apiId = ''
      this.api = {
        isTest: false,
        delay: 0,
        name: '',
        url: '',
        method: 'GET',
        module: this.$route.query.module,
        request: {
          urlParams: [],
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
    this.api.url && this.api.request.urlParams ? this.preJson('requestUrl') : 1 > 0
    this.api.request.paramList ? this.preJson('request') : 1 > 0
    this.api.response.paramList ? this.preJson('response') : 1 > 0
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
        if (resp.errCode === 0) {
          that.$message({ type: 'success', message: op + '成功' })
          let id:string = that.$route.params.apiId || resp.id
          that.$router.push({path: '/project/' + that.proId + '/api/view/' + id, query: {mode: 'view'}})
        } else {
          that.$message({ type: 'error', message: resp.errMsg || op + '失败' })
        }
      }
      return false
    })
  }
  cancel() {
    if (this.mode === 'edit') {
      this.$router.push({path: '/project/' + this.proId + '/api/view/' + this.$route.params.apiId, query: {mode: 'view'}})
    } else {
      this.$router.go(-1)
    }
  }
  async delParam(params:any, row:any, index:any) {
    if (row.type === 'Object' || row.type === 'Array') {
      try {
        await this.$confirm('对象或数组将会同时删除全部子元素, 继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        params.splice(index, 1)
        params.forEach((p:any, idx:any) => {
          if (p.ancestor[p.ancestor.length - 1] === row.id) {
            params.splice(idx, 1)
          }
        })
      } catch (err) {}
    } else {
      params.splice(index, 1)
    }
  }
  addParam(params:any, row?:any, index?:any) {
    let id: string = gId()
    let ancestor:string[] = ['root']
    let classNameArr:string[] = ['bg-1', 'bg-2', 'bg-3']
    let className:string = classNameArr[0]
    if (row) {
      ancestor = row.ancestor.concat([row.id])
      if (row.className === classNameArr[0]) {
        className = classNameArr[1]
      } else if (row.className === classNameArr[1]) {
        className = classNameArr[2]
      } else {
        className = classNameArr[0]
      }
    }
    params.splice(row ? index + 1 : params.length, 0, {
      id: id,
      ancestor: ancestor,
      name: '',
      type: 'String',
      required: true,
      mock: '',
      remark: '',
      className: className
    })
  }
  delItem(tag:string, list:any, row:any, index:any) {
    list.splice(index, 1)
    this.preJson('requestUrl')
    this.preJson('request')
    this.preJson('response')
  }
  addItem(tag:any, list:any) {
    let item:any = {}
    if (tag === 'urlParam') {
      item = {
        id: '',
        name: '',
        required: '',
        mock: '',
        remark: ''
      }
    } else if (tag === 'header') {
      item = {
        key: '',
        value: ''
      }
    } else if (tag === 'err') {
      item = {
        enabled: 'false',
        description: '',
        probability: '',
        response: '{}'
      }
    }
    list.push(item)
  }
  preJson(tag:any) {
    let obj:any = {}
    if (tag === 'requestUrl') {
      let url:string = this.api.url
      let query:string = ''
      this.api.request.urlParams.forEach((p:any) => {
        if (p.name) {
          let re:any = new RegExp(':' + p.name, 'g')
          if (url.indexOf(':' + p.name) !== -1) {
            url = url.replace(re, Mock.mock(p.mock))
          } else {
            query = query + '&' + p.name + '=' + Mock.mock(p.mock)
          }
        }
      })
      this.requestUrl = query ? url + '?' + query.slice(1, query.length - 1) : url
    } else if (tag === 'request') {
      obj = this.makeJson(this.api.request.paramList, 'root')
      this.requestExample = JSON.stringify(obj, null, 2)
    } else if (tag === 'response') {
      obj = this.makeJson(this.api.response.paramList, 'root')
      this.responseExample = JSON.stringify(obj, null, 2)
    }
  }
  makeJsonSchema(list:any[], rootId:string) {
    return Mock.toJSONSchema(this.makeMockJson(list, rootId))
  }
  makeJson(list:any[], rootId:string) {
    return Mock.mock(this.makeMockJson(list, rootId))
  }
  makeMockJson(list:any, pid:any, isArray?:boolean) {
    if (isArray) {
      let arr:any[] = []
      list.forEach((p:any) => {
        if (p.ancestor[p.ancestor.length - 1] === pid) {
          let t:any = p.type
          if (t === 'Number' || t === 'String' || t === 'Boolean') {
            arr.push(p.mock)
          } else if (t === 'Object') {
            arr.push(this.makeMockJson(list, p.id))
          } else if (t === 'Array') {
            arr.push(this.makeMockJson(list, p.id, true))
          }
        }
      })
      return arr
    } else {
      let obj:any = {}
      list.forEach((p:any) => {
        if (p.ancestor[p.ancestor.length - 1] === pid && p.name) {
          let t = p.type
          if (t === 'Number' || t === 'String' || t === 'Boolean') {
            let key:any = p.name + ((p.mock.split('|')[1] ? ('|' + p.mock.split('|')[1]) : ''))
            obj[key] = p.mock.split('|')[0]
          } else if (t === 'Object') {
            let key:any = p.name + (p.mock ? '|' + p.mock : '')
            obj[key] = this.makeMockJson(list, p.id)
          } else if (t === 'Array') {
            let key:any = p.name + (p.mock ? '|' + p.mock : '')
            obj[key] = this.makeMockJson(list, p.id, true)
          }
        }
      })
      return obj
    }
  }
}
</script>
<<style lang="stylus">
.bg-1 input
  background-color #f1cece
.bg-2 input
  background-color #f5f5cb
.bg-3 input
  background-color #cde4f5
.el-table
  td,
  th
    .cell
      padding 0 5px !important
</style>
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
.icon-node
  position relative
  width 15px
  height 53px
  line-height 1
  border-left 1px solid #ccc
.icon-node:after
  z-index 10
  content ''
  position absolute
  width 15px
  height 1px
  bottom 50%
  border-bottom 1px solid #ccc
.icon-node-space-1
  position relative
  width 15px
  height 53px
  line-height 1
.icon-node-space-2
  position relative
  width 30px
  height 53px
  line-height 1
.param-name
  line-height 53px
.pre
  line-height 1.5
</style>

