<template lang="pug">
  div.api-add-wrap.p-r
    el-form.ov-a.api-add#edit-form(ref='api', :model='api', :rules='rules', label-position='right', label-width='100px')
      el-form-item.ta-l(label='接口描述', prop='remark')
        el-input(v-model='api.remark')
      el-form-item.ta-l(label='所属模块', prop='module')
        el-select.w-200(v-model='api.module', filterable, allow-create, placeholder="选择或新建模块")
          el-option(v-for='(m, index) in modules', :key='index', :value='m', :label='m')
      el-form-item.ta-l(label='接口名称', prop='name')
        el-input.w-200(v-model='api.name')
      el-form-item.ta-l(label='请求路径', prop='url')
        el-input.w-200(v-model='api.url', @change='preJson("requestUrl")')
      el-form-item.ta-l(label='请求方法', prop='method')
        el-select.w-200(v-model='api.method')
          el-option(v-for='(m, index) in methods', :value='m', :key='index')
      el-form-item.ta-l(label='请求参数')
        el-button(@click='copy(api.request.paramList)', size='small') 复制
        el-button(@click='paste("request", "paramList")', size='small') 粘贴
        el-table(:data='api.request.paramList')
          el-table-column(label='参数名', prop='name', width='200')
            template(scope='scope')
              el-input(v-model='scope.row.name', size='small', @change='preJson("requestUrl")')
          el-table-column(label='必传', prop='required', width='50', align='center')
            template(scope='scope')
              el-checkbox(v-model='scope.row.required')
          el-table-column(label='Mock', prop='mock', min-width='100', align='center')
            template(scope='scope')
              el-input(v-model='scope.row.mock', size='small', @change='preJson("requestUrl")')
          el-table-column(label='说明', prop='remark', min-width='200', align='center')
            template(scope='scope')
              el-input(v-model='scope.row.remark', size='small')
          el-table-column(label='', width='50')
              template(scope='scope')
                el-button(size='mini', @click='delItem("param", api.request.paramList, scope.row, scope.$index)', icon='close', type='danger')
        div.append-table-row.ta-c
          el-button(type='primary', size='small', icon='plus', @click='addItem("param", api.request.paramList)')
      template(v-for='(data, index) in [api.request.dataList, api.response.dataList]')
        el-form-item.ta-l(:label='index===0?"请求体":"响应体"', :key='index', v-if='!(index===0&&api.method==="GET")')
          el-button(@click='copy(data)', size='small') 复制
          el-button(@click="index===0?paste('request', 'dataList'):paste('response', 'dataList')", size='small') 粘贴
          el-table(:data='data')
            el-table-column(prop='name', label='参数名', header-align='left', width='300')
              template(scope='scope')
                template(v-for='(id, index) in scope.row.ancestor')
                  span.d-ib.icon-node-space-2.f-l(v-if='index>1')
                span.d-ib.icon-node-space-1.f-l(v-if='scope.row.ancestor.length>1')
                span.d-ib.icon-node.f-l(v-if='scope.row.ancestor.length>1')
                el-input.d-ib.w-150.param-name(v-model='scope.row.name', size='small', :class='scope.row.className', @change='index===0?preJson("request"):preJson("response")')
                el-button.p-a.cu-p.btn-add-child-param(title='点击添加成员属性', v-if='scope.row.type==="Object" || scope.row.type === "Array"', size='mini', icon='plus', type='primary', @click='addData(data, scope.row, scope.$index)')
            el-table-column(prop='type', label='类型', header-align='center', width='105')
              template(scope='scope')
                el-select(v-model='scope.row.type', size='small', @change='index===0?preJson("request"):preJson("response");changeType(data, scope.row, scope.$index)')
                  el-option(v-for='(t, index) in types', :value='t', :key='index', :label='t')
            el-table-column(prop='required', label='必传', width='50', align='center')
              template(scope='scope')
                el-checkbox(v-model='scope.row.required', size='normal')
            el-table-column(prop='mock', label='Mock', header-align='center', width='250')
              template(scope='scope')
                el-input(v-model='scope.row.mock', size='small', @change='index===0?preJson("request"):preJson("response")')
            el-table-column(prop='remark', label='说明', header-align='center', min-width='100')
              template(scope='scope')
                el-input(v-model='scope.row.remark', size='small')
            el-table-column(label='', width='50')
              template(scope='scope')
                el-button(size='mini', @click='delData(data, scope.row, scope.$index)', icon='close', type='danger')
          div.append-table-row.ta-c
            el-button(type='primary', size='small', icon='plus', @click='addData(data)')
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
          el-table(:data='api.response.errList', border)
            el-table-column(label='启用', prop='enabled', width='50')
              template(scope='scope')
                el-checkbox(v-model='scope.row.enabled', size='small')
            el-table-column(label='异常结果（json格式）', min-width='200')
              template(scope='scope')
                el-input(v-model='scope.row.data', size='small', width='50')
            el-table-column(label='异常概率（用于调试）')
              template(scope='scope')
                el-input(v-model='scope.row.probability', size='small', min-width='200')
            el-table-column(label='异常描述')
              template(scope='scope')
                el-input(v-model='scope.row.remark', size='small')
            el-table-column(label='操作', width='50')
              template(scope='scope')
                el-button(size='mini', @click='delItem("err", api.response.errList, scope.row, scope.$index)', icon='close', type='danger')
          div.append-table-row.ta-c
            el-button(type='primary', size='small', icon='plus', @click='addItem("err", api.response.errList)')
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
    el-form.ov-a.pre-mock.p-a#pre-mock
        div#drag-line.drag-line(@mousedown='mousedown')
        el-form-item.ta-l(label='请求url')
          pre.pre {{requestUrl}}
        el-form-item.ta-l(label='请求体')
          el-button(type='primary', size='small', @click='preJson("request")') 刷新预览
          pre.pre {{requestExample}}
        el-form-item.ta-l(label='响应体')
          el-button(type='primary', size='small', @click='preJson("response")') 刷新预览
          pre.pre {{responseExample}}
    div.ta-c.submit-btns
      el-button.mr-50(@click='cancel()') 取消
      el-button(type='primary', @click='submit()') {{ api.id ? '保存' : '提交' }}

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
import cache from '../../service/cache.ts'
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
  remark?: string,
  isTest?: boolean,
  request: {
    paramList: Param[],
    dataList: Param[],
    headerList: any[]
  },
  response: {
    dataList: Param[],
    headerList: any[],
    errList: Err[]
  },
  delay?: number,
  [key:string]:any
}
interface Err extends Object {
  enabled?: string,
  data?: string,
  probability?: string,
  remark?: string
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
export default class apiEdit extends Vue {
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
    remark: '',
    request: {
      paramList: [],
      dataList: [],
      headerList: []
    },
    response: {
      dataList: [],
      headerList: [],
      errList: []
    }
  }
  copy(data:any) {
    data ? cache.set('copyData', JSON.stringify(data)) : 1 > 0
  }
  paste(key1:any, key2:any) {
    let data:any = JSON.parse(cache.get('copyData'))
    this.api[key1][key2] = data
  }
  startX:any = 0
  eleMock:any = document.getElementById('pre-mock')
  mousedown(e:any) {
    this.eleMock = document.getElementById('pre-mock')
    this.startX = e.pageX
    document.addEventListener('mouseup', this.mouseup)
    document.addEventListener('mousemove', this.drag)
  }
  mouseup = (e:any) => {
    document.removeEventListener('mousemove', this.drag)
  }
  drag(e:any) {
    let moveX:any = Number(this.startX - e.pageX)
    this.eleMock.style.width = 250 + moveX + 'px'
  }
  mode: string = ''
  rules: Object = {
    name: [{required: true}],
    module: [{required: true}],
    remark: [{required: true}],
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
    this.mode = this.$route.params.apiId ? 'edit' : 'add'
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
        remark: '',
        module: this.$route.query.module,
        request: {
          paramList: [],
          dataList: [],
          headerList: []
        },
        response: {
          dataList: [],
          headerList: [],
          errList: []
        }
      }
    }
    this.api.url && this.api.request.paramList ? this.preJson('requestUrl') : 1 > 0
    this.api.request.dataList ? this.preJson('request') : 1 > 0
    this.api.response.dataList ? this.preJson('response') : 1 > 0
  }
  requestUrl: string = ''
  requestExample:any = ''
  responseExample: any = ''
  async submit() {
    let that = this
    that.$refs.api.validate(async (valid:boolean) => {
      if (valid) {
        let op = that.mode === 'edit' ? '修改' : '添加'
        // await that.$confirm('确认' + op + 'api', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        let resp:any = that.mode === 'edit'
        ? await http.put('/api/project/' + that.proId + '/api/' + that.$route.params.apiId, that.api)
        : await http.post('/api/project/' + that.proId + '/api', that.api)
        if (resp.errCode === 0) {
          that.$message({ type: 'success', message: op + '成功' })
          let apiId:string = that.$route.params.apiId || resp.id
          that.$emit('update')
          that.$router.push({path: '/project/' + that.proId + '/api/' + apiId + '/detail'})
        } else {
          that.$message({ type: 'error', message: resp.errMsg || op + '失败' })
        }
      }
      return false
    })
  }
  cancel() {
    if (this.mode === 'edit') {
      this.$router.push({path: '/project/' + this.proId + '/api/' + this.$route.params.apiId + '/detail'})
    } else {
      this.$router.go(-1)
    }
  }
  changeType(data:any, row:any, index:any) {
    let len:any = 0
    data.forEach((p:any, idx:any) => {
      if (p.ancestor.indexOf(row.id) > -1) {
        len++
      }
    })
    data.splice(index + 1, len)
    switch (row.type) {
      case 'String' :
        row.mock = '@string'
        break
      case 'Boolean' :
        row.mock = '@boolean'
        break
      case 'Number' :
        row.mock = '@integer()'
        break
      case 'Array' :
        row.mock = '1-5'
        break
      default:
        row.mock = ''
        break
    }
  }
  async delData(data:any, row:any, index:any) {
    console.log(data[2])
    let len:any = 1
    if (row.type === 'Object' || row.type === 'Array') {
      await this.$confirm('对象或数组将会同时删除全部子元素, 继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      data.forEach((p:any, idx:any) => {
        if (p.ancestor.indexOf(row.id) > -1) {
          len++
        }
      })
      data.splice(index, len)
    } else {
      data.splice(index, len)
    }
  }
  addData(data:any, row?:any, index?:any) {
    let id: string = gId()
    let ancestor:string[] = ['root']
    let classNameArr:string[] = ['bg-1', 'bg-2', 'bg-3']
    let className:string = classNameArr[0]
    if (row) {
      console.log(ancestor)
      ancestor = row.ancestor.concat([row.id])
      console.log(ancestor)
      if (row.className === classNameArr[0]) {
        className = classNameArr[1]
      } else if (row.className === classNameArr[1]) {
        className = classNameArr[2]
      } else {
        className = classNameArr[0]
      }
    }
    data.splice(row ? index + 1 : data.length, 0, {
      id: id,
      ancestor: ancestor,
      name: '',
      type: 'String',
      required: true,
      mock: '@string',
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
    if (tag === 'param') {
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
        enabled: false,
        remark: '',
        probability: '',
        data: '{}'
      }
    }
    list.push(item)
  }
  preJson(tag:any) {
    let obj:any = {}
    if (tag === 'requestUrl') {
      let url:string = this.api.url
      let query:string = ''
      this.api.request.paramList.forEach((p:any) => {
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
      obj = this.makeJson(this.api.request.dataList, 'root')
      this.requestExample = JSON.stringify(obj, null, 2)
    } else if (tag === 'response') {
      obj = this.makeJson(this.api.response.dataList, 'root')
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
<style lang="stylus">
.bg-1 input
  background-color #f1cece
.bg-2 input
  background-color #f5f5cb
.bg-3 input
  background-color #cde4f5
.el-table
  td,
  th
    height 40
    .cell
      padding 0 5px !important
</style>
<style lang="stylus" scoped>
.drag-line
  position absolute
  width 3px
  top 0
  left 0
  bottom 0
  z-index 1000
  border-left 1px solid #ccc
  cursor e-resize
.append-table-row
  border 1px solid #dfe6ec
  border-top 0
.api-add-wrap
  width 100%
  height 100%
  padding-right 300px
.api-add
  padding 20px
  padding-bottom 80px
  width 100%
  height 100%
.btn-add-child-param
  top 50%
  transform translateY(-50%)
.icon-node
  position relative
  width 15px
  height 40px
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
  height 40px
  line-height 1
.icon-node-space-2
  position relative
  width 30px
  height 40px
  line-height 1
.param-name
  line-height 40px
.pre-mock
  z-index 99
  top 0
  right 0
  bottom 0
  padding-left 20px
  padding-bottom 80px
  width 250px
  // border-left 1px solid #ccc
  background-color #fff
.pre
  line-height 1.5
.submit-btns
  z-index 9999
  position absolute
  left 0
  right 0
  bottom 0
  padding 20px
  border-top 1px solid #ccc
  background-color #eee
</style>

