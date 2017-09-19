<template lang="pug">
  div.api-view
    el-row(:gutter='10')
      el-col(:span='12')
        el-form(ref='api', :data='api', label-position='right', label-width='100px')
          el-row
            el-col(:span='10')
              el-form-item.ta-l(label='开启测试')
                span {{api.isTest}}
              el-form-item.ta-l(label='接口名称')
                span(:class='api.nameClassName') {{api.name}}
              el-form-item.ta-l(label='请求路径')
                span(:class='api.urlClassName') {{api.url}}
              el-form-item.ta-l(label='请求方法')
                span(:class='api.methodClassName') {{api.method}}
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
                  el-table(:data='params', border, :row-class-name='diffRowClassName')
                    el-table-column(prop='name', label='参数名', header-align='center', width='100')
                    el-table-column(prop='type', label='类型', header-align='center', width='125')
                    el-table-column(prop='required', label='必传', header-align='center', width='80')
                    el-table-column(prop='mock', label='模拟值', header-align='center', min-width='100')
                    el-table-column(prop='rule', label='校验规则', header-align='center', min-width='100')
                    el-table-column(prop='remark', label='说明', header-align='center', min-width='100')
      el-col(:span='12')
        el-form(ref='compareApi', :data='compareApi', label-position='right', label-width='100px')
          el-form-item.ta-l(label='历史版本')
            el-select.mr-50(v-model='oldVersion', value-key='version', @change='getOldVersion()')
              el-option(v-for='(v, index) in versionList', :value='v', :label='v.version', :key='index')
            el-button.ml-15(@click='compareVersion()', type='primary', :disabled='!comparable') 版本对比
          el-form-item.ta-l(label='开启测试', :class='api.isTest===compareApi.isTest?"":"c-red"')
            span {{compareApi.isTest}}
          el-form-item.ta-l(label='接口名称')
            span {{compareApi.name}}
          el-form-item.ta-l(label='请求路径')
            span {{compareApi.url}}
          el-form-item.ta-l(label='请求方法')
            span {{compareApi.method}}
          template(v-for='(params, index) in [compareApi.requestParams, compareApi.responseParams]')
            el-form-item.ta-l(:label='index===0?"请求参数":"响应参数"', :key='index')
              template
                el-table(:data='params', border)
                  el-table-column(prop='name',:class="nameClass", label='参数名', header-align='center', width='100')
                  el-table-column(prop='type', label='类型', header-align='center', width='125')
                  el-table-column(prop='required', label='必传', header-align='center', width='80')
                  el-table-column(prop='mock', label='模拟值', header-align='center', min-width='100')
                  el-table-column(prop='rule', label='校验规则', header-align='center', min-width='100')
                  el-table-column(prop='remark', label='说明', header-align='center', min-width='100')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
// import {Watch} from 'vue-property-decorator'
import http from '../../service/http.ts'
// import _ from 'lodash'
interface Api extends Object {
  id?: string,
  name?: string,
  url?: string,
  method?: string,
  module?: string,
  isTest?: boolean,
  requestParams?: Param[],
  responseParams?: Param[],
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
  required: string,
  mock: string,
  rule: string,
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
    requestParams: [],
    responseParams: []
  }
  compareApi: Api = {
    isTest: true,
    name: '',
    url: '',
    method: '',
    requestParams: [],
    responseParams: []
  }
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
      this.api = resp
      let resp2:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId + '/version')
      this.versionList = resp2.versionList
    }
  }
  async getOldVersion() {
    let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.$route.params.apiId + '?version=' + this.oldVersion.version)
    this.compareApi = resp
    this.comparable = true
  }
  comparable: boolean = false
  compareVersion() {
    this.compareApi.nameClassName = this.api.name === this.compareApi.name ? '' : 'c-red'
    this.compareApi.urlClassName = this.api.url === this.compareApi.url ? '' : 'c-red'
    this.compareApi.methodClassName = this.api.method === this.compareApi.method ? '' : 'c-red'
  }
  diffRowClassName(row:any, index:any) {
    // this.api.requestParams.forEach((p) => {
    //   if (p === row) {
    //     return ''
    //   } else {
    //     return 'c-red'
    //   }
    // })
  }
}
</script>
<style lang="stylus" scoped>
.el-form
  padding 10px
  border 1px solid #ddd
</style>

