<template lang="pug">
  div.api-wrap
    div.api-tree.p-a()
      span.p-a.btn-hide-tree.el-icon-d-arrow-right.show.d-ib.cu-p(v-if='!showTree', @click='showTree=true')
      span.p-a.btn-hide-tree.el-icon-d-arrow-left.d-ib.hide.cu-p(v-if='showTree', @click='showTree=false')
      el-input.api-search.mb-10.p-a(v-show='showTree', icon='search', v-model='filterText', placeholder="输入接口名称进行过滤")
      el-tree.ta-l.ov-y-a.ov-x-h(v-show='showTree', ref='apiTree', @node-click='selectApi', class='filter-tree', :data="apiList", :props='defaultProps', :expand-on-click-node='true', :default-expanded-keys='["0"]', node-key='id', highlight-current, :filter-node-method='filterNode', :render-content='renderBtn')
    div.api-detail(:class='showTree?"ml-300":"ml-10"')
      router-view(:key='$route.fullPath')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import http from '../../service/http.ts'
import {formatApiToTree, gId} from '../../utils/util.ts'
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
  $prompt: any
  proId: any
  proName: string
  apiList: any[] = []
  showTree: boolean = true
  renderBtn(h:any, { node, data, store }:any) {
    return h('span', {
      'class': {
        'mouseover': true,
        'd-ib': true
      },
      style: {
        width: '100%'
      }
    }, [
      h('span', {
        style: {
          'font-size': (() => {
            let label: string = data.label
            if (label === 'root') {
              return '18px'
            } else if (label === 'module' || label === 'newModule') {
              return '18px'
            } else if (label === 'url' || label === 'newUrl') {
              return '16px'
            }
          })()
        }
      }, data.name),
      h('el-button', {
        style: {display: data.label === 'newModule' || data.label === 'newUrl' ? 'inline-block' : 'none'},
        attrs: {type: 'text', icon: 'plus'},
        nativeOn: {
          click: (e:any) => {
            e.stopPropagation()
            if (data.label === 'newModule') {
              this.addModule(data, store)
            } else if (data.label === 'newUrl') {
              this.addApi(data)
            }
          }
        }
      }, data.label === 'newModule' ? '模块' : '接口'),
      h('el-button', {
        'class': {
          'd-n': data.label !== 'root'
        },
        style: {
          float: 'right',
          'padding-right': '30px'
        },
        attrs: {
          type: 'text',
          title: '刷新api列表',
          icon: this.refreshing ? 'loading' : ''
        },
        nativeOn: {
          click: (e:any) => {
            e.stopPropagation()
            this.refreshApiList()
          }
        }
      }, '刷新'),
      h('span', {
        'class': {
          'tree-node-btns': true,
          'd-n': true
        },
        style: {
          float: 'right',
          'padding-right': '30px'
        }
      }, [
        h('el-button', {
          'class': {'cu-d': true, 'd-n': data.label === 'newModule' || data.label === 'newUrl' || data.label === 'root'},
          attrs: {type: 'text', icon: 'delete2', size: 'mini'},
          nativeOn: {
            click: (e:any) => {
              e.stopPropagation()
              this.delApi(data, store)
            }
          }
        }),
        h('el-button', {
          'class': {'cu-d': true, 'd-n': data.label === 'newModule' || data.label === 'newUrl' || data.label === 'root'},
          attrs: {type: 'text', icon: 'edit', size: 'mini'},
          nativeOn: {
            click: (e:any) => {
              e.stopPropagation()
              if (data.label === 'module') {
                this.editModule(data)
              } else if (data.label === 'url') {
                this.editApi(data.id)
              }
            }
          }
        })
      ])
    ])
  }
  refreshing: boolean = false
  async refreshApiList() {
    this.refreshing = true
    this.proId = this.$route.params.proId
    let resp: any = await http.get('/api/project/' + this.$route.params.proId + '/api')
    let resp2: any = await http.get('/api/project/' + this.$route.params.proId)
    this.proName = resp2.name
    let list: any = formatApiToTree(resp.apiList)
    list.unshift({
      label: 'newModule',
      name: '',
      id: gId()
    })
    this.apiList = []
    this.apiList.push({
      label: 'root',
      id: '0',
      name: '项目名：' + this.proName,
      children: list
    })
    this.refreshing = false
  }
  beforeMount() {
    this.refreshApiList()
  }
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
    return data.name.indexOf(value) !== -1
  }
  async selectApi(data:any, node:any, tree:any, a:any) {
    if (data.label === 'newUrl') {
      this.addApi(data)
    } else if (data.label === 'url') {
      this.viewApi(data.id)
    } else {
      this.$router.push('/project/' + this.proId + '/api')
    }
  }
  addModule(data:any, store:any) {
    this.$prompt('请输入模块名', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(({ value }:any) => {
      store.insertAfter({
        id: gId(),
        label: 'module',
        name: value || '默认模块',
        children: [{
          id: gId(),
          label: 'newUrl',
          name: '',
          module: value || '默认模块'
        }]
      }, data)
    })
  }
  editModule(data:any) {

  }
  viewApi(id:string) {
    this.$router.push({path: '/project/' + this.proId + '/api/view/' + id, query: {mode: 'view'}})
  }
  addApi(data:any) {
    this.$router.push({path: '/project/' + this.proId + '/api/add', query: {mode: 'add', module: data.module}})
  }
  editApi(id:string) {
    this.$router.push({path: '/project/' + this.proId + '/api/edit/' + id, query: {mode: 'edit'}})
  }
  async delApi(data:any, store:any) {
    if (data.label === 'url') {
      await this.$confirm('确认删除接口' + data.name + '?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      let resp:any = await http.delete('/api/project/' + this.proId + '/api/' + data.id)
      if (resp.status === 200) {
        if (resp.data.errCode !== 0) {
          this.$message({ type: 'info', message: '删除成功' })
          store.remove(data)
          this.$router.push('/project/' + this.proId + '/api')
        } else {
          this.$message({ type: 'error', message: resp.data.errMsg || '删除失败' })
        }
      }
    } else if (data.label === 'module') {
      if (data.children.length === 0) {
        store.remove(data)
      } else {
        await this.$confirm('确认删除模块' + data.name + '及该模块下全部接口？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        let resp:any = await http.delete('/api/project/' + this.proId + '/api/?module=' + data.name)
        if (resp.status === 200) {
          if (resp.data.errCode !== 0) {
            this.$message({ type: 'info', message: '删除成功' })
            store.remove(data)
          } else {
            this.$message({ type: 'error', message: resp.data.errMsg || '删除失败' })
          }
        }
      }
    }
  }
}
</script>
<style lang="stylus">
.mouseover:hover
  .tree-node-btns
    display inline-block
</style>
<style lang="stylus" scoped>
.ml-300
  margin-left 300px
.ml-10
  margin-left 10px
.append-table-row
  border 1px solid #dfe6ec
  border-top 0
// .api-wrap
  // padding 20px
.api-tree
  width 300px
  height 100%
  .api-search
    left 0
    top 0
    z-index 10
    border-radius 0
  .el-tree
    height 100%
    // min-height 500px
    padding-top 50px
  .btn-hide-tree
    top 50%
    z-index 100
    border 1px solid #ddd
    border-left 0
    border-top-right-radius 5px
    border-bottom-right-radius 5px
    line-height 50px
  .btn-hide-tree.hide
    right -15px
  .btn-hide-tree.show
    left 0
.api-detail
  height 100%
.btn-add-child-param
  top 50%
  transform translateY(-50%)
</style>

