<template lang="pug">
  .api-add-wrap.p-r.ov-a
    el-form.ov-a.api-add#edit-form(ref='api', :model='api', :rules='rules', label-position='right', label-width='100px')
      el-form-item.ta-l.mb-20(label='所属模块', prop='module')
        el-select.w-200(v-model='api.module', size='small', filterable, allow-create, placeholder="选择或新建模块")
          el-option(v-for='(m, index) in modules', :key='index', :value='m', :label='m')
      el-form-item.ta-l.mb-20(label='接口名称', prop='name')
        el-input.w-200(v-model.trim='api.name', size='small', autofocus='')
      el-form-item.ta-l.mb-20(label='请求路径', prop='url')
        el-input.w-200(v-model.trim='api.url', size='small', @keydown.shift.native='noParam')
        span.ml-20.c-silver(v-show="showUrlMsg") 请将参数填入“请求参数”表格中
      el-form-item.ta-l.mb-20(label='请求方法', prop='method')
        el-select.w-200(v-model='api.method', size='small')
          el-option(v-for='(m, index) in methods', :value='m', :key='index')
      el-form-item.ta-l.mb-20(label='接口描述', prop='remark')
        el-input(v-model.trim='api.remark', size='small')
      el-form-item.ta-l.mb-20(label='请求参数')
        el-table(:data='api.request.paramList', border)
          el-table-column(label='参数名', prop='name', width='200')
            template(scope='scope')
              el-input(v-model.trim='scope.row.name', size='small')
          el-table-column(label='说明', prop='remark', min-width='200', align='center')
            template(scope='scope')
              el-input(v-model.trim='scope.row.remark', size='small')
          el-table-column(label='模拟数据', prop='mock', min-width='100', align='center')
            template(scope='scope')
              el-input(v-model.trim='scope.row.mock', size='small')
          el-table-column(label='', width='50')
              template(scope='scope')
                el-button.c-red(size='mini', @click='delItem("param", api.request.paramList, scope.row, scope.$index)', icon='close', type='text')
        div.append-table-row.ta-c.cu-p(@click='addItem("param", api.request.paramList)')
          el-button(type='text', icon='plus')
      el-form-item.ta-l(label='请求体', v-if='api.method!=="GET"')
        ParamEditor(:schema="api.request.dataSchema", ref="requestEditor")
      el-form-item.ta-l(label='响应体')
        ParamEditor(:schema="api.response.dataSchema", ref="responseEditor") 
      el-form-item.ta-l(label='高级配置')
        span(@click='showAdvancedConfig=!showAdvancedConfig')
          el-button(:icon='showAdvancedConfig?"arrow-down":"arrow-right"', type='text', @click.stop='showAdvancedConfig=!showAdvancedConfig')
      template(v-if='showAdvancedConfig')
        el-form-item.cl-b.ta-l.mb-10(label='可测试')
          el-switch(v-model='api.isTest', on-text='on', off-text='off')
        el-form-item.ta-l(label='延迟响应')
          el-input.w-200(v-model.trim='api.delay', size='small')
          span 毫秒
        el-form-item.ta-l(label='异常处理')
          el-table(:data='api.response.errList', border)
            el-table-column(label='返回值', min-width='200')
              template(scope='scope')
                el-input(v-model.trim='scope.row.data', size='small', width='50')
            el-table-column(label='说明')
              template(scope='scope')
                el-input(v-model.trim='scope.row.remark', size='small')
            el-table-column(label='概率（用于调试）')
              template(scope='scope')
                el-input(v-model.trim='scope.row.probability', size='small', min-width='200')
            el-table-column(label='启用', prop='enabled', width='50')
              template(scope='scope')
                el-checkbox(v-model='scope.row.enabled', size='small')
            el-table-column(label='', width='50')
              template(scope='scope')
                el-button.c-red(size='mini', @click='delItem("err", api.response.errList, scope.row, scope.$index)', icon='close', type='text')
          div.append-table-row.ta-c.cu-p(@click='addItem("err", api.response.errList)')
            el-button(type='text', icon='plus')
        template(v-for='(header, index) in [api.request.headerList, api.response.headerList]')
          el-form-item(:label='index===0?"请求header":"响应header"', :key='index')
            el-table(:data='header', border)
              el-table-column(label='key', width='200')
                template(scope='scope')
                  el-input(v-model.trim='scope.row.key', size='small')
              el-table-column(label='value')
                template(scope='scope')
                  el-input(v-model.trim='scope.row.value', size='small')
              el-table-column(label='操作', width='50')
                template(scope='scope')
                  el-button.c-red(size='mini', @click='delItem("header", header, scope.row, scope.$index)', icon='close', type='text')
            div.append-table-row.ta-c.cu-p(@click='addItem("header", header)')
              el-button(type='text', icon='plus')
    div.ta-c.submit-btns
      el-button.mr-50(@click='cancel()') 取 消
      el-button(type='primary', @click='submit()') 保 存 
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
import {gId} from '../../service/util.ts'
import EventDelegate from '../../service/EventDelegate'
import {Prop, Watch} from 'vue-property-decorator'
import ParamEditor from './ParamEditor.vue'

// interface Err extends Object {
//   enabled?: string,
//   data?: string,
//   probability?: string,
//   remark?: string
// }
// interface Param extends Object {
//   id: string,
//   ancestor: string[],
//   name: string,
//   type: string,
//   required: boolean,
//   isRoot?: boolean,
//   property?: string,
//   mock?: string,
//   remark?: string,
//   className?: string
// }
// interface request {
//     paramList: Param[]
//     dataList: Param[]
//     dataSchema?: any
//     headerList: any[]
// }

// interface Api {
//   version: string,
//   id: string,
//   name: string,
//   url: string,
//   method: string,
//   module: string,
//   remark: string,
//   isTest: boolean,
//   delay: number,
//   request: {
//   },
//   response: {
//     dataList: Param[]
//     headerList: any[]
//     dataSchema?: any
//     errList: Err[]
//   }
// }

@Component({
  components: {
    ParamEditor
  }
})
export default class apiEdit extends Vue {
  @Prop()
  moduleName: string
  @Prop()
  apiId: string
  @Prop()
  proId: string
  Mock: any
  $refs: any
  $route: any
  $router: any
  $message: any
  $confirm: any
  activeTab: [string, string] = ['table', 'table']
  // 下拉列表选项
  showAdvancedConfig: boolean = false
  methods: string[] = ['GET', 'POST', 'PUT', 'DELETE']
  modules: string[] = []
  showUrlMsg: boolean = false
  api: any = {
    isTest: true,
    name: '',
    url: '',
    method: '',
    remark: '',
    request: {
      paramList: [],
      headerList: [],
      dataSchema: {}
    },
    response: {
      headerList: [],
      errList: [],
      dataSchema: {}
    }
  }
  requestUrl: string = ''
  requestExample:any = ''
  responseExample: any = ''
  startX:any = 0
  eleMock:any = document.getElementById('pre-mock')
  noParam(e: any) {
    const forbidSignal = [55, 191]
    if (forbidSignal.indexOf(e.keyCode) > -1) {
      this.showUrlMsg = true
      e.preventDefault()
      setTimeout(() => {
        this.showUrlMsg = false
      }, 3000)
    }
  }
  mousedown(e:any) {
    this.eleMock = document.getElementById('pre-mock')
    this.startX = e.pageX
    EventDelegate.bind('mousemove', this.drag, 'ApiEdit')
    EventDelegate.bind('mouseup', () => {
      EventDelegate.unbind('mousemove', 'ApiEdit')
    }, 'ApiEdit')
  }
  drag(e:any) {
    let moveX:any = Number(this.startX - e.pageX)
    this.eleMock.style.width = 250 + moveX + 'px'
  }
  rules: Object = {
    name: [{required: true}],
    module: [{required: true}],
    remark: [{required: true}],
    url: [
      {type: 'string', required: true, message: '请输入请求路径'},
      {message: '请求路径不合法,"/"开头', pattern: /^\//}],
    method: [{type: 'string', required: true, message: '请选择一个请求方法'}],
    requestParams: [{type: 'array', required: false, message: '请至少选择一个项目成员'}],
    responseParams: [{type: 'array'}]
  }
  $children: any
  async refreshApi() {
    if (this.mode === 'edit') {
      let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.apiId)
      this.api = resp
    } else if (this.mode === 'add') {
      this.api = {
        module: this.moduleName,
        name: '',
        method: '',
        url: '',
        request: {
          paramList: [],
          headerList: []
        },
        response: {
          headerList: [],
          errList: []
        }
      }
    } else {
      console.error('模式错误:' + this.mode)
    }
  }
  async created() {
    let resp:any = await http.get('/api/project/' + this.proId + '/api/module')
    this.modules = resp.moduleList || []
    this.refreshApi()
  }
  @Watch('mode')
  async modeChanged() {
    this.refreshApi()
  }
  get mode() {
    return this.apiId ? 'edit' : 'add'
  }
  async submit() {
    let _this = this
    this.$refs.requestEditor ? _this.api.request.dataSchema = this.$refs.requestEditor.getSchema() : void 0
    _this.api.response.dataSchema = this.$refs.responseEditor.getSchema()
    await new Promise((resolve: any, reject: any) => {
      _this.$refs.api.validate((valid:boolean) => {
        valid ? resolve() : reject()
      })
    })
    let existApi: any = await http.get('/api/project/' + _this.proId + '/api/exist?url=' + _this.api.url + '&method=' + _this.api.method)
    if (existApi.id) {
      _this.$message({ type: 'error', message: 'API已经存在' })
    } else {
      let op = _this.mode === 'edit' ? '修改' : '添加'
      const cfg: any = {
        add: {
          url: '/api/project/' + _this.proId + '/api'
        },
        edit: {
          url: '/api/project/' + _this.proId + '/api/' + _this.apiId
        }
      }
      let {url} = cfg[_this.mode]
      let resp: any = _this.mode === 'edit' ? await http.put(url, _this.api) : await http.post(url, _this.api)
      if (resp.errCode) {
        _this.$message({ type: 'error', message: resp.errMsg || op + '失败' })
      } else {
        _this.$emit('updated', resp.id || _this.apiId)
        _this.$message({ type: 'success', message: op + '成功' })
      }
    }
  }
  cancel() {
    this.$emit('cancel')
  }
  async delData(data:any, row:any, index:any) {
    let len:any = 1
    if (row.type.toLowerCase() === 'object' || row.type.toLowerCase() === 'array') {
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
    let ancestor: string[] = row.ancestor.concat([row.id])
    data.splice(row ? index + 1 : data.length, 0, {
      id: gId(),
      ancestor,
      name: '',
      type: 'string',
      required: row.type !== 'array',
      remark: '',
      noName: row.type === 'array', // 数组元素无属性名
      className: 'bg-' + ancestor.length
    })
  }
  delItem(tag:string, list:any, row:any, index:any) {
    list.splice(index, 1)
  }
  addItem(tag:any, list:any) {
    let item:any = {}
    if (tag === 'param') {
      item = { id: '', name: '', required: '', mock: '', remark: '' }
    } else if (tag === 'header') {
      item = { key: '', value: '' }
    } else if (tag === 'err') {
      item = { enabled: false, remark: '', probability: '', data: '{}' }
    }
    list.push(item)
  }
}
</script>

<style lang="stylus" scoped>
.drag-line
  position absolute
  width 3px
  z-index 1000
  border-left 1px solid #ccc
  cursor e-resize
.append-table-row
  border 1px solid #dfe6ec
  border-top 0
  &:hover, &:active, &:focus
    background-color #F9FAFC
.api-add-wrap
  background-color #fff
  height 100%
.api-add
  padding 20px
  padding-bottom 80px
  width 100%
.btn-add-child-param
  top 50%
  transform translateY(-50%)
.pre-mock
  z-index 99
  padding-left 20px
  padding-bottom 80px
  width 250px
  background-color #fff
.submit-btns
  z-index 9999
  padding 2px
  border-top 1px solid #ccc
  background-color #F9FAFC
</style>

<style lang="stylus">
.api-add-wrap
  .el-table__empty-block
    display none
</style>
