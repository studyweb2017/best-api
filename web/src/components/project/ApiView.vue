<template lang="pug">
  .api-view-wrap.ov-a.p-r
    .api-latest
      el-form(ref='api', :data='api', label-position='right', label-width='100px')
        el-form-item.ta-l.mb-10(label='接口名称')
          span {{api.name}}
        el-form-item.ta-l.mb-10(label='请求路径')
          span.mr-10 {{api.url}}
          el-tag(:type="methodType") {{api.method}}
        el-form-item.ta-l.mb-10(label='接口描述')
          span {{api.remark}}
        el-form-item.ta-l(label='请求参数', v-if='api.request.paramList&&api.request.paramList.length>0')
          el-table(:data='api.request.paramList', border, )
            el-table-column(label='参数名', prop='name', width='180', align='left')
            el-table-column(label='说明', prop='remark', min-width='100', align='left')
              template(scope='scope')
                .nowrap(:title="scope.row.remark") {{scope.row.remark}}
            el-table-column(label='Mock', prop='mock', width='150', align='left')
            el-table-column(label='类型', prop='required', width='80', align='left')
              template(scope='scope')
                span {{scope.row.required ? '必传' : '可选'}}
        template(v-for='(data, index) in [api.request.dataList, api.response.dataList]')
          el-form-item.ta-l(:label='index===0?"请求体":"响应体"', :key='index', v-if='data&&data.length>0')
            el-table(:data='data', border)
              el-table-column(prop='name', label='参数名', width='180')
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
          el-form-item.ta-l.mb-10(label='示例', :key='index', v-if='data&&data.length>0')
            pre {{data.example}}
        el-form-item.cl-b.ta-l(label='可测试', v-if="api.isTest")
          span {{api.isTest}}
        el-form-item.ta-l(label='延迟响应', v-if="api.delay")
          span {{api.delay + '毫秒'}}
        el-form-item.ta-l(label='异常处理', v-if='api.response.errList&&api.response.errList.length>0')
          el-table(:data='api.response.errList', border)
            el-table-column(label='是否启用', prop='enabled', width='100')
              template(scope='scope')
                span {{scope.row.enabled}}
            el-table-column(label='异常概率（用于调试）', prop='probability', width='100')
            el-table-column(label='异常返回（json格式）', prop='data')
              template(scope='scope')
                pre {{scope.row.response}}
            el-table-column(label='异常描述', prop='remark')
        template(v-for='(header, index) in [api.request.headerList, api.response.headerList]')
          el-form-item.ta-l(:label='index===0?"请求header":"响应header"', :key='index', v-if='header&&header.length>0')
            el-table(:data='header', border)
              el-table-column(label='key', prop='key')
              el-table-column(label='value', prop='value')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
import cache from '../../service/cache.ts'
import {Prop} from 'vue-property-decorator'
import {schema2list, Param} from '../../service/schemaTransformer'

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
    headerList: any[]
  },
  response: {
    dataList: Param[],
    headerList: any[],
    errList: any[]
  },
  nameClassName?: string,
  urlClassName?: string,
  methodClassName?: string,
}

const tagType:any = {
  GET: 'primary',
  POST: 'success',
  PUT: 'warning',
  DELETE: 'danger'
}
@Component
export default class apiView extends Vue {
  @Prop()
  proId: string
  @Prop()
  apiId: string
  api: Api = {
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
      dataList: [],
      headerList: [],
      errList: []
    }
  }
  $message: any
  $confirm: any
  showAdvancedConfig: boolean = false
  async created() {
    if (this.proId && this.apiId) {
      let resp:any = await http.get('/api/project/' + this.proId + '/api/' + this.apiId)
      this.api = resp || this.api
      this.api.request.dataList = schema2list(resp.request.dataSchema)
      this.api.response.dataList = schema2list(resp.response.dataSchema)
    }
  }
  get methodType() {
    return this.api.method ? tagType[this.api.method] : ''
  }
  copy(data:any) {
    data ? cache.set('copyData', JSON.stringify(data)) : 1 > 0
  }
  async delApi(data:any, store:any) {
    if (data.label === 'url') {
      await this.$confirm('确认删除接口' + data.name + '?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      let resp:any = await http.delete('/api/project/' + this.proId + '/api/' + data.id)
      if (resp.errCode === 0) {
        this.$message({ type: 'info', message: '删除成功' })
        store.remove(data)
      } else {
        this.$message({ type: 'error', message: resp.errMsg || '删除失败' })
      }
    } else if (data.label === 'module') {
      if (data.children.length < 2) {
        store.remove(data)
      } else {
        await this.$confirm('确认删除模块' + data.name + '及该模块下全部接口？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        let resp:any = await http.delete('/api/project/' + this.proId + '/api/?module=' + data.name)
        if (resp.errCode === 0) {
          this.$message({ type: 'info', message: '删除成功' })
          store.remove(data)
        } else {
          this.$message({ type: 'error', message: resp.errMsg || '删除失败' })
        }
      }
    }
  }
}
</script>
<style lang='stylus'>
.api-view-wrap
  .el-table
    margin-top 11px
  .el-table__header-wrapper
    height 30px
    line-height 30px
  th, td
    height 30px
    line-height 30px
    .cell
      padding 0 5px !important
</style>
<style lang="stylus" scoped>
.api-view-wrap
  height 100%
  background-color #fff 
  .api-latest,
  .api-history
    height 100%
    padding 10px 20px 0 0
.api-history
  border-left 1px solid #ddd
.icon-node
  position relative
  width 15px
  height 30px
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
  height 30px
  line-height 1
.icon-node-space-2
  position relative
  width 30px
  height 30px
  line-height 1
.param-name
  line-height 30px
</style>

