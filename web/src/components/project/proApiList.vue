<template lang="pug">
  div.api-wrap.p-r
    div.api-tree.p-a.cl-b
      el-input.mb-10(icon='search', v-model='filterText', placeholder="输入接口名称进行过滤")
      el-tree.ta-l.cl-b(ref='apiTree', v-if='showTree', highlight-current, :show-checkbox='showCheckbox', @node-click='selectApi', class='filter-tree', :data="apiList", :props='defaultProps', default-expand-all, :expand-on-click-node='false', :filter-node-method='filterNode', :render-content='renderBtn')
    div.api-detail
      div.api-operation.ta-l.mb-10
        el-button(type='primary', icon='delete2', @click='delApi()', :disabled='!deletable') 删除
        el-button(type='primary', icon='view', @click='viewApi()', :disabled='!viewable') 查看
        el-button(type='primary', icon='plus', @click='addApi()', :disabled='false') 新建
        el-button(type='primary', icon='edit', @click='editApi()', :disabled='!editable') 编辑
      router-view(:key='$route.path')
      //- pro-api-detail(:proId='proId', :apiId.sync='apiId', :updatable.sync='updatable', :deletable.sync='deletable')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import http from '../../service/http.ts'
import {formatApiToTree} from '../../utils/util.ts'
import proApiDetail from './proApiDetail'
@Component({
  components: {
    proApiDetail
  }
})
export default class proApiList extends Vue {
  // 变量类型声明
  Mock: any
  $refs: any
  $route: any
  $router: any
  $message: any
  $confirm: any
  // 当前项目id, 当前项目api列表初始化
  proId: any
  apiId: any = ''
  apiList: any[] = []
  colors: string[] = ['red', 'green', 'yellow']
  destroy: boolean = false
  showTree: boolean = true
  showCheckbox: boolean = false
  isShowApiDelBtn: boolean = true
  // testConfig() {
  //   this.showCheckbox = true
  //   this.showTree = false
  //   this.showTree = true
  // }
  // saveTestConfig() {
  //   this.showTree = false
  //   this.showCheckbox = false
  //   this.showTree = true
  // }
  showDelBtn() {
    this.isShowApiDelBtn = true
  }
  hideDelBtn() {
    this.isShowApiDelBtn = false
  }
  renderBtn(h:any, { node, data, store }:any) {
    return h('span', {
      'class': {
        // 'tree-line': true,
        // 'd-ib': true
      },
      on: {
        // mouseover: this.showDelBtn()
        // mouseout: this.hideDelBtn()
      }
    }, [
      h('el-button', {
        style: {display: data.isTest !== undefined ? 'inline-block' : 'none'},
        attrs: {type: data.isTest ? 'success' : 'warning', icon: 'info', size: 'mini'}
      }),
      h('span', data.name),
      h('span', {
        style: {
          float: 'right',
          marginRight: '10px'
        }
      }, [
        // h('el-button', {
          // style: {
          //   display: this.isShowApiDelBtn && data.label === 'method' ? 'inline-block' : 'none',
          //   border: 'none',
          //   backgroundColor: 'transparent'
          // },
          // attrs: {
          //   icon: 'delete2',
          //   size: 'mini',
          //   nativeOn: {
          //     'click.stop.prevent': this.delApi(data.label, data.id)
          //   }
          // }
        // })
      ])
    ])
  }

  async beforeMount() {
    this.proId = this.$route.params.proId
    let resp: any = await http.get('/api/project/' + this.$route.params.proId + '/api')
    this.apiList = formatApiToTree(resp.apiList)
  }
  // api列表的树型展示，节点过滤
  defaultProps: Object = {
    children: 'children',
    label: 'name'
  }
  filterText: string = ''
  @Watch('filterText')
  onFilterTextChanged(val: string, oldVal: string) {
    this.$refs.apiTree.filter(val)
  }
  filterNode(value:any, data:any) {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }
  formatApiList(apiList:any) {
    let modules:any = []
    let urls:any = []
    let methods:any = []
    apiList.forEach((api:any) => {
      let moduleIndex:any = modules.findIndex((m:any) => { return api.module === m.label })
      if (moduleIndex === -1) {
        modules.push({ label: api.module, children: [{ label: api.url, children: [{ label: api.method, id: api.id, version: api.version }] }] })
      } else {
        urls = modules[moduleIndex].children
        let urlIndex:any = urls.findIndex((url:any) => { return api.url === url.label })
        if (urlIndex === -1) {
          urls.push({ label: api.url, children: [{ label: api.method, id: api.id, version: api.version }] })
        } else {
          methods = urls[urlIndex].children
          methods.push({ label: api.method, id: api.id, version: api.version })
        }
      }
    })
    return modules
  }
  viewable: boolean = false
  deletable: boolean = false
  editable: boolean = false
  async selectApi(data:any, node:any, tree:any) {
    if (data.id) {
      this.apiId = data.id
      this.viewable = true
      this.deletable = true
      this.editable = true
      this.viewApi()
    } else {
      this.deletable = false
      this.apiId = ''
    }
  }
  viewApi() {
    this.$router.push({path: '/project/' + this.proId + '/api/view/' + this.apiId, query: {mode: 'view'}})
  }
  addApi() {
    this.$router.push({path: '/project/' + this.proId + '/api/add', query: {mode: 'add'}})
  }
  editApi() {
    this.$router.push({path: '/project/' + this.proId + '/api/edit/' + this.apiId, query: {mode: 'edit'}})
  }
  async delApi(label:string, id:string) {
    if (this.apiId) {
      try {
        await this.$confirm('确认删除接口?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        let resp:any = await http.delete('/api/project/' + this.proId + '/api/' + this.apiId)
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
}
</script>
<style lang="stylus" scoped>
.append-table-row
  border 1px solid #dfe6ec
  border-top 0
.api-wrap
  padding 20px
  width 100%
  height 100%
.api-tree
  width 200px
  height auto
  .el-tree
    padding-bottom 20px
    p.tree-line:hover
      background-color red !important
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

