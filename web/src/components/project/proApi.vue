<template lang="pug">
  div.api-wrap.p-r
    div.api-tree.p-a.cl-b
      el-input.mb-10(icon='search', v-model='filterText', placeholder="输入接口名称进行过滤")
      el-tree.ta-l.cl-b(ref='apiTree', @node-click='showApiDetail' class='filter-tree', :data="apiList", :props='defaultProps', default-expand-all, :expand-on-click-node='false', :filter-node-method='filterNode')
    div.api-detail
      div.api-operation.ta-l.mb-10
        el-button(type='primary', icon='plus', @click='addApi()') 添加
        el-button(type='primary', icon='edit') 编辑
        el-button(type='primary', icon='document', @click='save()') 保存
        el-button(type='primary', icon='delete2', @click='delApi()') 删除
      el-form(ref='api', :data='api', label-position='right', label-width='80px')
        el-col(:span='5')
        el-form-item.h-36.ta-l(label='接口名称')
          el-input.w-200(v-model='api.name')
        el-form-item.ta-l(label='url')
          el-input.w-200(v-model='api.url')
        el-form-item.ta-l(label='请求方法')
          el-select.w-200(v-model='api.method')
            el-option(v-for='(m, index) in methods', :value='m', :key='index')
        el-form-item.ta-l(v-for='(params, index) in [api.requestParams, api.responseParams]', :label='index===0?"请求参数":"响应参数"', :key='index')
          template
            el-table(:data='params', fit, border)
              el-table-column(prop='name', label='参数名', header-align='center')
                template(scope='scope')
                  el-input(v-model='scope.row.name', size='small')
              el-table-column(prop='required', label='是否必传', header-align='center')
                template(scope='scope')
                  el-select(v-model='scope.row.required', size='small')
                    el-option(v-for='(b, index) in ["true", "false"]', :value='b', :key='index', :label='b')
              el-table-column(prop='type', label='类型', header-align='center')
                template(scope='scope')
                  el-select(v-model='scope.row.type', size='small')
                    el-option(v-for='(t, index) in ["string", "array","object", "number", "boolean","double", "stream"]', :value='t', :key='index', :label='t')
              el-table-column(prop='mock', label='模拟值', header-align='center')
                template(scope='scope')
                  el-input(v-model='scope.row.mock', size='small')
              el-table-column(prop='rule', label='校验规则', header-align='center')
                template(scope='scope')
                  el-input(v-model='scope.row.rule', size='small')
              el-table-column(prop='remark', label='说明', header-align='center')
                template(scope='scope')
                  el-input(v-model='scope.row.remark', size='small')
              el-table-column(label='操作')
                template(scope='scope')
                  el-button(size='mini', @click.native.prevent='delRow(scope.$index, params)', icon='close', type='danger')
            div.append-table-row.ta-c
              el-button(type='primary', size='small', icon='plus', @click='addParam(params)')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import http from '../../service/http.ts'
@Component
export default class proApi extends Vue {
  $refs: any
  $route: any
  $message: any
  $confirm: any
  filterText: string = ''
  apiList: any[] = []
  api: any = {
    name: '',
    url: '',
    method: '',
    requestParams: [],
    requestExample: {},
    responseParams: [],
    responseExample: {}
  }
  methods: string[] = ['get', 'post', 'put', 'delete']
  async beforeMount() {
    let resp: any = await http.get('/api/project/' + this.$route.params.id + '/api')
    this.apiList = resp.apiList
  }
  defaultProps: Object = {
    children: 'children',
    label: 'url'
  }
  @Watch('filterText')
  onFilterTextChanged(val: string, oldVal: string) {
    this.$refs.apiTree.filter(val)
  }
  filterNode(value:any, data:any) {
    if (!value) return true
    return data.url.indexOf(value) !== -1
  }
  async showApiDetail(data:any, node:any, tree:any) {
    let resp = await http.get('/api/project/' + this.$route.params.id + '/api/' + data.id + '/version/' + data.version)
    this.api = resp
  }
  addApi() {
    this.api = {}
  }
  async save() {
    let resp:any = this.api.id
    ? await http.put('/api/project/' + this.$route.params.id + '/api/' + this.api.id + '/version')
    : await http.post('/api/project/' + this.$route.params.id + '/api')
    if (resp.status === 200) {
      if (resp.data.errCode === 0) {
        this.$message({ type: 'info', message: resp.data.errMsg })
        this.api.id = resp.data.id
      } else {
        this.$message({ type: 'error', message: resp.data.errMsg })
      }
    }
  }
  async delApi() {
    if (this.api.id) {
      try {
        await this.$confirm('确认删除接口?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        let resp:any = await http.delete('/api/project/' + this.$route.params.id + '/api/' + this.api.id)
        if (resp.status === 200) {
          if (resp.data.errCode === 0) {
            this.$message({ type: 'info', message: '删除成功' })
          } else {
            this.$message({ type: 'error', message: resp.data.errMsg || '删除失败' })
          }
        }
      } catch (err) {
        this.$message({ type: 'info', message: '已取消删除' })
      }
    }
  }
  delRow(index:any, rows:any) {
    rows.splice(index, 1)
  }
  addParam(params:any) {
    if (params) {
      params.push({
        name: '',
        type: '',
        required: '',
        mock: '',
        rule: '',
        remark: ''
      })
    }
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
</style>

