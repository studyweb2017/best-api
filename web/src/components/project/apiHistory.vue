<template lang="pug">
  el-row.api-compare
    el-col.api-latest.ov-a.p-r(:span='12', v-for='(api, index) in [apiLeft, apiRight]', :key='index')
      el-form(ref='api', :data='api', label-position='right', label-width='100px')
        el-row
          el-col(:span='12')
            el-form-item.ta-l.mb-10(v-if='index===0', label='当前版本')
              span {{api.version + '（最新）'}}
            el-form-item.ta-l.mb-10(label='历史版本', v-if='index===1')
                el-select.mr-50(v-model='oldVersion', value-key='version', @change='getOldVersion()', size='small')
                  el-option(v-for='(v, index) in versionList', :value='v', :label='v.version', :key='index')
          el-col(:span='12')
            el-form-item.ta-l.mb-10(label='创建者', v-if='index===0')
              span {{api.creator}}
            el-form-item.ta-l.mb-10(label='修改者', v-if='index===1')
              span {{api.updator}}
        el-form-item.ta-l.mb-10(label='接口名称')
          span(v-bind:class="[apiLeft.module !== apiRight.module ? editClass : '']") {{api.module + '/' }}
          span(v-bind:class="[apiLeft.name !== apiRight.name ? editClass : '']") {{api.name}}
        el-form-item.ta-l.mb-10(label='请求路径')
          el-button.mr-10(v-bind:class="[apiLeft.method !== apiRight.method ? editClass : '']", type='default', size='small') {{api.method}}
          span(v-bind:class="[apiLeft.url !== apiRight.url ? editClass : '']") {{api.url}}
        el-form-item.ta-l.mb-10(label='接口描述')
          span(v-bind:class="[apiLeft.remark !== apiRight.remark ? editClass : '']") {{api.remark}}
        el-form-item.ta-l(label='请求参数')
          span(v-if='api.request.paramList&&api.request.paramList.length<1') 无
          el-table(:data='api.request.paramList', v-if='api.request.paramList&&api.request.paramList.length>0', :row-class-name='diffRowClassName')
            el-table-column(label='参数名', prop='name', width='180', align='left')
            el-table-column(label='必传', prop='required', width='80', align='left')
              template(scope='scope')
                span {{scope.row.required}}
            el-table-column(label='Mock', prop='mock', width='150', align='left')
            el-table-column(label='说明', prop='remark', min-width='100', align='left')
              template(scope='scope')
                span.nowrap {{scope.row.remark}}
        el-row
          template(v-for='(data, index) in [api.request.dataList, api.response.dataList]')
            el-form-item.ta-l(:label='index===0?"请求体":"响应体"', :key='index')
              span(v-if='data&&data.length<1') 无
              el-table(:data='data', :row-class-name='diffRowClassName', v-if='data&&data.length>0')
                el-table-column(prop='name', label='参数名', width='220')
                  template(scope='scope')
                    template(v-for='(id, index) in scope.row.ancestor')
                      span.d-ib.icon-node-space-2.f-l(v-if='index>1')
                    span.d-ib.icon-node-space-1.f-l(v-if='scope.row.ancestor.length>1')
                    span.d-ib.icon-node.f-l(v-if='scope.row.ancestor.length>1')
                    span.param-name.d-ib {{scope.row.name}}
                el-table-column(prop='type', label='类型', width='100')
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
        template(v-if='showAdvancedConfig')
          el-form-item.cl-b.ta-l(label='开启测试')
            span(v-bind:class="[apiLeft.isTest !== apiRight.isTest ? editClass : '']") {{api.isTest}}
          el-form-item.ta-l(label='延迟响应')
            span(v-bind:class="[apiLeft.delay !== apiRight.delay ? editClass : '']") {{api.delay + '毫秒'}}
          el-form-item.ta-l(label='异常处理')
            span(v-if='api.response.errList&&api.response.errList.length<1') 无
            el-table(:data='api.response.errList', border, v-if='api.response.errList&&api.response.errList.length>0', :row-class-name='diffRowClassName')
              el-table-column(label='是否启用', prop='enabled')
                template(scope='scope')
                  span {{scope.row.enabled}}
              el-table-column(label='异常结果（json格式）', prop='data')
              el-table-column(label='异常概率（用于调试）', prop='probability')
              el-table-column(label='异常描述', prop='remark')
          template(v-for='(header, index) in [api.request.headerList, api.response.headerList]')
            el-form-item.ta-l(:label='index===0?"请求header":"响应header"', :key='index')
              span(v-if='header&&header.length<1') 无
              el-table(:data='header', border, v-if='header&&header.length>0', :row-class-name='diffRowClassName')
                el-table-column(label='key', prop='key')
                el-table-column(label='value', prop='value')

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
  remark?: string,
  request: {
    paramList: any[],
    dataList: Param[],
    headerList: Header[]
  },
  response: {
    errList: any[],
    dataList: Param[],
    headerList: Header[]
  },
  [key: string]: any
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
interface Header extends Object {
  key: string,
  value: string
}
interface Version extends Object {
  version: string,
  updateTime: string,
  updateMember: string
}
@Component
export default class apiHistory extends Vue {
  $refs: any
  $route: any
  $router: any
  proId: string
  apiId: string
  apiLeft: Api = {
    isTest: true,
    name: '',
    url: '',
    method: '',
    remark: '',
    request: {
      paramList: [],
      dataList: [],
      headerList: []
    },
    response: {
      errList: [],
      dataList: [],
      headerList: []
    }
  }
  editClass: string = 'bg-yellow'
  editClassC: string = 'c-yellow'
  deleteClass: string = 'bg-red'
  addClass: string = 'bg-green'
  showAdvancedConfig: boolean = false
  apiRight: Api = {
    isTest: true,
    name: '',
    url: '',
    method: '',
    remark: '',
    request: {
      paramList: [],
      dataList: [],
      headerList: []
    },
    response: {
      errList: [],
      dataList: [],
      headerList: []
    }
  }
  versionList: Version[] = []
  oldVersion: Version = {
    version: '',
    updateTime: '',
    updateMember: ''
  }
  async beforeMount() {
    this.proId = this.$route.params.proId
    this.apiId = this.$route.params.apiId
    let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId)
    this.apiLeft = resp || this.apiLeft
    let resp2:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId + '/version')
    this.versionList = resp2.versionList || []
  }
  async getOldVersion() {
    let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId + '?version=' + this.oldVersion.version)
    this.apiRight = resp || this.apiRight
    Object.keys(this.apiRight).forEach((k:any) => {
      if (k === 'module' || k === 'name' || k === 'remark' || k === 'method' || k === 'url' || k === 'isTest' || k === 'delay') {
        this.apiRight[k + 'Class'] = this.apiRight[k] !== this.apiLeft[k] ? 'c-red' : ''
      } else if (k === 'request' || k === 'response') {
        Object.keys(this.apiRight[k]).forEach((kk:any) => {
          if (kk === 'paramList' || kk === 'errList' || kk === 'dataList' || kk === 'headerList') {
            this.apiRight[k][kk].forEach((itemR:any) => {
              let i1:any = _.findIndex(this.apiLeft[k][kk], (itemL:any) => {
                if (kk === 'headerList') {
                  return itemR.key === itemL.key
                } else if (kk === 'errList') {
                  return itemR.data === itemL.data
                } else if (kk === 'paramList') {
                  return itemR.name === itemL.name
                } else if (kk === 'dataList') {
                  return itemR.name === itemL.name && _.isEqual(itemR.ancestor, itemL.ancestor)
                }
              })
              console.log(i1)
              let i2:any = _.findIndex(this.apiLeft[k][kk], (itemL:any) => {
                if (kk === 'headerList') {
                  return itemR.key === itemL.key && itemR.value === itemL.value
                } else if (kk === 'errList') {
                  return itemR.enabled === itemL.enabled && itemR.data === itemL.data && itemR.probability === itemL.probability && itemR.remark === itemL.remark
                } else if (kk === 'paramList') {
                  return itemR.name === itemL.name && itemR.required === itemL.required && itemR.mock === itemL.mock && itemR.remark === itemL.remark
                } else if (kk === 'dataList') {
                  return itemR.name === itemL.name && _.isEqual(itemR.ancestor, itemL.ancestor) && itemR.type === itemL.type && itemR.required === itemL.required && itemR.mock === itemL.mock && itemR.remark === itemL.remark
                }
              })
              if (i1 === -1) {
                itemR.className = 'bg-red'
              } else if (i1 !== -1 && i2 === -1) {
                itemR.className = 'bg-yellow'
              } else if (i1 !== -1 && i2 !== -1) {
                itemR.className = ''
              }
            })
            this.apiLeft[k][kk].forEach((itemL:any) => {
              let i1:any = _.findIndex(this.apiRight[k][kk], (itemR:any) => {
                if (kk === 'headerList') {
                  return itemR.key === itemL.key
                } else if (kk === 'errList') {
                  return itemR.data === itemL.data
                } else if (kk === 'paramList') {
                  return itemR.name === itemL.name
                } else if (kk === 'dataList') {
                  return itemR.name === itemL.name && _.isEqual(itemR.ancestor, itemL.ancestor)
                }
              })
              let i2:any = _.findIndex(this.apiRight[k][kk], (itemR:any) => {
                if (kk === 'headerList') {
                  return itemR.key === itemL.key && itemR.value === itemL.value
                } else if (kk === 'errList') {
                  return itemR.enabled === itemL.enabled && itemR.data === itemL.data && itemR.probability === itemL.probability && itemR.remark === itemL.remark
                } else if (kk === 'paramList') {
                  return itemR.name === itemL.name && itemR.required === itemL.required && itemR.mock === itemL.mock && itemR.remark === itemL.remark
                } else if (kk === 'dataList') {
                  return itemR.name === itemL.name && _.isEqual(itemR.ancestor, itemL.ancestor) && itemR.type === itemL.type && itemR.required === itemL.required && itemR.mock === itemL.mock && itemR.remark === itemL.remark
                }
              })
              if (i1 === -1) {
                itemL.className = 'bg-green'
              } else if (i1 !== -1 && i2 === -1) {
                itemL.className = 'bg-yellow'
              } else if (i1 !== -1 && i2 !== -1) {
                itemL.className = ''
              }
            })
          }
        })
      }
    })
  }
  diffRowClassName(row:any, index:any) {
    return row.className
  }
}
</script>
<style lang='stylus'>
.el-table .bg-diff-row
  background-color #fbdbdb
.el-table .bg-red
  background-color red
.el-table .bg-yellow
  background-color yellow
.el-table .bg-green
  background-color green
.el-table
  td,
  th
    .cell
      padding 0 5px !important
</style>
<style lang="stylus" scoped>
.api-compare
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

