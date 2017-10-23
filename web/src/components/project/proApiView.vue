<template lang="pug">
  el-row.api-view
    el-col.api-latest.ov-a.p-r(:span='showHistoryVersion?12:24')
      el-row.border-b
        el-button(icon='view', type='default', @click='editApi()') 查看
        el-button(icon='edit', type='default', @click='editApi()') 编辑
        el-button(icon='document', type='default') 复制
        el-button(icon='document', type='default') 导入
        el-button(icon='view', type='default', @click='showHistoryVersion=true') 历史版本
        el-button(icon='view', type='default') 模拟请求
      router-view
      el-form(v-if="mode==='view'", ref='api', :data='api', label-position='right', label-width='100px')
        //- el-form-item.ta-l(label='当前版本')
          span {{api.version + '（最新）'}}
          el-button(v-if='versionList.length>0', type='text', @click='showHistoryVersion=true') 查看历史版本
        el-form-item.ta-l.mb-10(label='接口名称')
          span {{api.module + '/'}}
          span {{api.name}}
        el-form-item.ta-l.mb-10(label='请求路径')
          el-button.mr-10(type='primary', size='small') PUT
          span https://www.base.com
          span {{api.url}}
        el-row
          template(v-for='(params, index) in [api.request.paramList, api.response.paramList]')
            el-form-item.ta-l(:label='index===0?"请求参数":"响应参数"', :key='index')
              template
                el-table(:data='params')
                  el-table-column(prop='name', label='参数名', width='120')
                    template(scope='scope')
                      template(v-for='(id, index) in scope.row.ancestor')
                        span.d-ib.icon-node-space-2.f-l(v-if='index>1')
                      span.d-ib.icon-node-space-1.f-l(v-if='scope.row.ancestor.length>1')
                      span.d-ib.icon-node.f-l(v-if='scope.row.ancestor.length>1')
                      span.param-name.d-ib {{scope.row.name}}
                  el-table-column(prop='type', label='类型', width='80')
                  el-table-column(prop='required', label='必传', width='80')
                    template(scope='scope')
                      span {{scope.row.required}}
                  el-table-column(prop='mock', label='Mock', width='150')
                  el-table-column(prop='remark', label='说明', min-width='100')
                    template(scope='scope')
                      span.ov-a.nowrap {{scope.row.remark}}
        el-form-item.ta-l(label='高级配置')
          div(@click='showAdvancedConfig=!showAdvancedConfig')
            el-button(:icon='showAdvancedConfig?"arrow-down":"arrow-right"', type='text', @click.stop='showAdvancedConfig=!showAdvancedConfig')
          //- hr.mt-20
        template(v-if='showAdvancedConfig')
          el-form-item.cl-b.ta-l(label='开启测试')
            span {{api.isTest}}
          el-form-item.ta-l(label='延迟响应')
            span {{api.delay + '毫秒'}}
          el-form-item.ta-l(label='异常处理')
            el-table(:data='api.errConfig', border)
              el-table-column(label='是否启用', prop='enabled')
                template(scope='scope')
                  span {{scope.row.enabled}}
              el-table-column(label='异常结果（json格式）', prop='result')
                template(scope='scope')
                  pre {{scope.row.response}}
              el-table-column(label='异常概率（用于调试）', prop='propabality')
              el-table-column(label='异常描述', prop='remark')
          template(v-for='(header, index) in [api.request.headerList, api.response.headerList]')
            el-form-item(:label='index===0?"请求header":"响应header"', :key='index')
              el-table(:data='header', border)
                el-table-column(label='key', prop='key')
                el-table-column(label='value', prop='value')
    el-col.api-history.ov-a.p-r(:span='12', v-if='showHistoryVersion')
      el-button.p-a.t-0.l-0.z-100(icon='d-arrow-right', type='default', size='small', @click='showHistoryVersion=false')
      el-form.p-r(ref='compareApi', :data='compareApi', label-position='right', label-width='100px')
        el-row
          el-col(:span='10')
            el-form-item.ta-l(label='历史版本')
              el-select.mr-50(v-model='oldVersion', value-key='version', @change='getOldVersion()')
                el-option(v-for='(v, index) in versionList', :value='v', :label='v.version', :key='index')
            el-form-item.ta-l(label='模块名称', :class='api.module===compareApi.module?"":"c-red"')
              span {{compareApi.module}}
            el-form-item.ta-l(label='接口名称', :class='api.name===compareApi.name?"":"c-red"')
              span {{compareApi.name}}
          el-col(:span='14')
              el-form-item.ta-l(label='修改者')
                span {{compareApi.updator}}
              el-form-item.ta-l(label='请求路径', :class='api.url===compareApi.url?"":"c-red"')
                span {{compareApi.url}}
              el-form-item.ta-l(label='请求方法', :class='api.method===compareApi.method?"":"c-red"')
                span {{compareApi.method}}
        template(v-for='(params, index) in [compareApi.request.paramList, compareApi.response.paramList]')
          el-form-item.ta-l(:label='index===0?"请求参数":"响应参数"', :key='index')
            template
              el-table(:data='params', :row-class-name='diffRowClassName', border)
                el-table-column(prop='name', label='参数名', width='100')
                el-table-column(prop='type', label='类型', width='125')
                el-table-column(prop='required', label='必传', width='80')
                  template(scope='scope')
                    span {{scope.row.required}}
                el-table-column(prop='mock', label='Mock', min-width='100')
                el-table-column(prop='remark', label='说明', min-width='100', show-overflow-tootip='true')
                  template(scope='scope')
                    span.ov-a.nowrap {{scope.row.remark}}
        el-form-item.ta-l(label='高级配置')
          div(@click='showAdvancedConfig=!showAdvancedConfig')
            el-button(:icon='showAdvancedConfig?"arrow-down":"arrow-right"', type='text', @click.stop='showAdvancedConfig=!showAdvancedConfig')
        template(v-if='showAdvancedConfig')
          el-form-item.cl-b.ta-l(label='开启测试')
            span {{compareApi.isTest}}
          el-form-item.ta-l(label='延迟响应')
            span {{compareApi.delay + '毫秒'}}
          el-form-item.ta-l(label='异常处理')
            el-table(:data='compareApi.errConfig', border)
              el-table-column(label='是否启用', prop='enabled')
                template(scope='scope')
                  span {{scope.row.enabled}}
              el-table-column(label='异常结果（json格式）')
                template(scope='scope')
                  pre {{scope.row.response}}
              el-table-column(label='异常概率（用于调试）', prop='probability')
              el-table-column(label='异常描述', prop='description')
          template(v-for='(header, index) in [compareApi.request.headerList, compareApi.response.headerList]')
            el-form-item(:label='index===0?"请求header":"响应header"', :key='index')
              el-table(:data='header', border)
                el-table-column(label='key', prop='key', width='50', align='left')
                el-table-column(label='value', prop='value', align='left')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
import _ from 'lodash'
interface Api extends Object {
  id?: string,
  name?: string,
  url?: string,
  method?: string,
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
  nameClassName?: string,
  urlClassName?: string,
  methodClassName?: string,
}
interface Param extends Object {
  id: string,
  pid: string,
  cid: string[],
  name: string,
  type: string,
  required: boolean,
  mock: string,
  rule?: string,
  remark?: string,
  className?: string
}
interface Version extends Object {
  version: string,
  updateTime: string,
  updateMember: string
}
@Component
export default class proApiView extends Vue {
  $refs: any
  $route: any
  $router: any
  proId: string
  apiId: string
  api: Api = {
    isTest: true,
    name: '',
    url: '',
    method: '',
    request: {
      paramList: [],
      headerList: []
    },
    response: {
      paramList: [],
      headerList: []
    }
  }
  showAdvancedConfig: boolean = false
  compareApi: Api = {
    isTest: true,
    name: '',
    url: '',
    method: '',
    request: {
      paramList: [],
      headerList: []
    },
    response: {
      paramList: [],
      headerList: []
    }
  }
  showHistoryVersion: boolean = false
  versionList: Version[] = []
  oldVersion: Version = {
    version: '',
    updateTime: '',
    updateMember: ''
  }
  async beforeMount() {
    this.proId = this.$route.params.proId
    let mode:string = this.$route.query.mode
    if (mode === 'view') {
      this.apiId = this.$route.params.apiId
      let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId)
      this.api = resp || this.api
      let resp2:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId + '/version')
      this.versionList = resp2.versionList || []
    }
  }
  mode: string = 'view'
  editApi() {
    this.mode = 'edit'
    this.$router.push({path: '/project/' + this.proId + '/api/edit/' + this.apiId, query: {mode: 'edit'}})
  }
  async getOldVersion() {
    let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId + '?version=' + this.oldVersion.version)
    this.compareApi = resp || this.compareApi
    if (this.compareApi.request.paramList && this.compareApi.response.paramList && this.api.request.paramList && this.api.response.paramList) {
      this.compareApi.request.paramList.forEach((p:any) => {
        let i = _.findIndex(this.api.request.paramList, (item) => {
          return _.isEqual(p, item)
        })
        p.className = i === -1 ? 'c-red' : ''
      })
      this.compareApi.response.paramList.forEach((p:any) => {
        let i = _.findIndex(this.api.response.paramList, (item) => {
          return _.isEqual(p, item)
        })
        p.className = i === -1 ? 'c-red' : ''
      })
    }
    this.comparable = true
  }
  comparable: boolean = false
  diffRowClassName(row:any, index:any) {
    let i = _.findIndex(this.api.response.paramList, (item) => {
      // let obj:any = {}
      // obj.id = row.id
      // obj.pid = row.pid
      // obj.cid = row.cid
      // obj.type = row.type
      // obj.name = row.name
      // obj.required = row.required
      // obj.mock = row.mock
      // obj.rule = row.rule
      // obj.remark = row.remark
      return _.isEqual(row, item)
    })
    return i === -1 ? 'bg-diff-row' : ''
  }
}
</script>
<style lang='stylus'>
.el-table .bg-diff-row
  background-color #fbdbdb
.el-table
  td,
  th
    .cell
      padding 0 5px !important
</style>
<style lang="stylus" scoped>
.api-view
  height 100%
  .api-latest,
  .api-history
    height 100%
.el-form
  height 100%
  padding 30px 20px 10px 0
.api-history
  border-left 1px solid #ddd
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
</style>

