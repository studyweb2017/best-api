<template lang="pug">
  div.api-wrap
    div.api-tree.p-a#apitree
      el-input.api-search.mb-10.p-a(size='small', v-show='showTree', icon='search', v-model='filterText', placeholder="输入接口名称进行过滤")
      el-tree.ta-l.ov-y-a.ov-x-h(v-show='showTree', ref='apiTree', @node-click='selectApi', class='filter-tree', :data="apiList", :props='defaultProps', :expand-on-click-node='true', :default-expanded-keys='["0"]', node-key='id', highlight-current, :filter-node-method='filterNode', :render-content='renderBtn')
      div#drag-line.drag-line(@mousedown='mousedown')
    div.api-detail-wrap.p-r#detail-wrap(:class='showTree?"ml-250":"ml-10"')
      el-row.border-b.operation-btns.p-a.ta-l
        el-button(size='small', icon='view', type='default', @click='viewApi(apiId)') 查看
        el-button(size='small', icon='edit', type='default', @click='editApi(apiId)') 编辑
        el-button(size='small', icon='document', type='default') 复制
        el-button(size='small', icon='document', type='default') 导入
        el-button(size='small', icon='view', type='default', @click='viewHistory(apiId)') 版本对比
        el-button(size='small', icon='view', type='default') 模拟请求
      router-view(:key='$route.fullPath', v-on:update='refreshApiList')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import http from '../../service/http.ts'
import {formatApiToTree, gId} from '../../service/util.ts'
@Component
export default class apiList extends Vue {
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
  apiId: string = ''
  startX:any = 0
  // moveX:any = 0
  dragLine:any = document.getElementById('drag-line')
  eleTree:any = document.getElementById('apitree')
  eleDetail:any = document.getElementById('detail-wrap')
  toggleTree(boolean:boolean) {
    if (boolean) {
      this.showTree = true
      this.eleTree.style.width = '250' + 'px'
      this.eleDetail.style.marginLeft = '250' + 'px'
    } else {
      this.showTree = false
      this.eleTree.style.width = '0'
      this.eleDetail.style.marginLeft = '0'
    }
  }
  mousedown(e:any) {
    this.eleTree = document.getElementById('apitree')
    this.eleDetail = document.getElementById('detail-wrap')
    this.startX = e.clientX
    document.addEventListener('mouseup', this.mouseup)
    document.addEventListener('mousemove', this.drag)
  }
  mouseup = (e:any) => {
    document.removeEventListener('mousemove', this.drag)
  }
  drag(e:any) {
    let moveX:any = e.clientX - this.startX
    // this.dragElement.style.width = this.dragElement.style.width.slice(0, -2) - 0 + this.moveX + 'px'
    this.eleTree.style.width = 250 + (moveX < -100 ? -100 : moveX) + 'px'
    this.eleDetail.style.marginLeft = 250 + (moveX < -100 ? -100 : moveX) + 'px'
  }
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
              return '16px'
            } else if (label === 'module' || label === 'newModule') {
              return '16px'
            } else if (label === 'url' || label === 'newUrl') {
              return '14px'
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
                this.apiId = data.id
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
    if (resp2.name && resp.apiList) {
      this.proName = resp2.name
      let list: any = formatApiToTree(resp.apiList)
      list.push({
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
    } else {
      this.$message({type: 'error', message: resp2.errMsg || '刷新失败'})
    }
    this.refreshing = false
  }
  beforeMount() {
    this.refreshApiList()
    this.apiId = this.$route.params.apiId
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
      this.apiId = data.id
    } else {
      this.$router.push('/project/' + this.proId + '/api')
    }
  }
  addModule(data:any, store:any) {
    this.$prompt('请输入模块名', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(({ value }:any) => {
      store.insertBefore({
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
    let apiId = id || this.apiId
    if (apiId) {
      this.$router.push({path: '/project/' + this.proId + '/api/' + apiId + '/detail'})
    } else {
      return
    }
  }
  viewHistory(id:string) {
    let apiId = id || this.apiId
    if (apiId) {
      this.$router.push({path: '/project/' + this.proId + '/api/' + apiId + '/history'})
    } else {
      return
    }
  }
  addApi(data:any) {
    this.$router.push({path: '/project/' + this.proId + '/api/add', query: {mode: 'add', module: data.module}})
  }
  editApi(id:string) {
    let apiId = id || this.apiId
    if (apiId) {
      this.$router.push({path: '/project/' + this.proId + '/api/' + apiId + '/edit'})
    } else {
      return
    }
  }
  async delApi(data:any, store:any) {
    if (data.label === 'url') {
      await this.$confirm('确认删除接口' + data.name + '?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      let resp:any = await http.delete('/api/project/' + this.proId + '/api/' + data.id)
      if (resp.errCode === 0) {
        this.$message({ type: 'info', message: '删除成功' })
        store.remove(data)
        this.$router.push('/project/' + this.proId + '/api')
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
<style lang="stylus">
.mouseover:hover
  .tree-node-btns
    display inline-block
</style>
<style lang="stylus" scoped>
.drag-line
  position absolute
  width 3px
  top 0
  right 0
  bottom 0
  z-index 1000
  border-right 1px solid #ccc
  cursor e-resize
.ml-250
  margin-left 250px
.ml-10
  margin-left 10px
.append-table-row
  border 1px solid #dfe6ec
  border-top 0
.api-tree
  width 250px
  height 100%
  .api-search
    left 0
    top 0
    z-index 10
    padding 5px
    border-radius 0
  .el-tree
    background-color #eee
    height 100%
    padding-top 50px
.api-detail-wrap
  height 100%
  padding-top 40px
  background-color #fff
.operation-btns
  z-index 100
  top 0
  left 0
  right 0
  padding-left 40px
  line-height 40px
  background-color #eee
.btn-add-child-param
  top 50%
  transform translateY(-50%)
</style>

