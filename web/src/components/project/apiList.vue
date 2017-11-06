<template lang="pug">
  div.api-wrap.p-r.us-n(:style="treeStyle")
    div(v-show="parseInt(treeStyle.width)>=visibleWidth")
      el-input.api-search(size='small', v-show='showTree', @keydown.esc.native="esc", icon='search', v-model='filterText', placeholder="查询接口[alt+f]")
      div.api-operation.ta-r
        i.el-icon-plus.cu-p.c-blue(title="添加模块[alt+m]", @click="addModule")
      div.api-tree
        el-tree.ta-l.ov-y-a.ov-x-h(v-show='showTree', ref='apiTree', @node-click='selectApi',
        class='filter-tree', :data="apiList", :props='defaultProps', :expand-on-click-node='false',
          :default-expanded-keys='expandedKeys', node-key='id', :highlight-current="true",
          :filter-node-method='filterNode', :render-content='renderBtn', empty-text="请先添加模块")
    div.drag-line(@mousedown='mousedown')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch, Prop } from 'vue-property-decorator'
import http from '../../service/http.ts'
import {formatApiToTree, gId} from '../../service/util.ts'
import hotkeys from 'hotkeys-js'
import EventDelegate from '../../service/EventDelegate'

@Component
export default class apiList extends Vue {
  refreshing: boolean = false
  @Prop()
  proId: string
  @Prop()
  apiId: string
  @Prop()
  clickedId: string
  Mock: any
  $refs: any
  $message: any
  $confirm: any
  $prompt: any
  proName: string
  apiList: any[] = []
  showTree: boolean = true
  visibleWidth: number = 200
  startX: number = 0
  startWidth: number
  treeStyle: any = {
    width: '200px'
  }
  mousedown(e:any) {
    this.startX = e.clientX
    this.startWidth = parseInt(this.treeStyle.width)
    EventDelegate.bind('mousemove', this.drag, 'ApiList')
    EventDelegate.bind('mouseup', () => {
      EventDelegate.unbind('mousemove', 'ApiList')
    }, 'ApiList')
  }
  drag(e:any) {
    let moveX:any = e.clientX - this.startX
    let width = '0px'
    if (moveX > 0) {
      // 右移动
      width = Math.max(this.visibleWidth, (this.startWidth + moveX)) + 'px'
    } else {
      // 左移动
      if (this.startWidth + moveX >= this.visibleWidth / 2) {
        width = Math.max(this.visibleWidth, (this.startWidth + moveX)) + 'px'
      }
    }
    this.treeStyle = {
      width
    }
  }
  renderBtn(h:any, { node, data, store }:any) {
    let __this = this
    let createBtn = (icon: string, title: string) => {
      return h('el-button', {
        attrs: {
          type: 'text',
          title,
          icon
        },
        nativeOn: {
          click(e:any) {
            data.operation = icon
            __this.clickNodeBtn(data, icon)
          }
        }
      })
    }
    return h('div', {
      class: ['f-1', 'cu-d', 'p-r', 'tree-node', 'o-h', 'to-e'],
      attrs: {
        title: data.name
      }
    }, [
      h('span', data.name),
      h('div', {
        class: {
          'node-btns': true
        }
      }, data.label === 'module' ? [
        createBtn('document', '新增API'),
        createBtn('delete', '删除模块'),
        createBtn('edit', '编辑模块')
      ] : [
        createBtn('delete', '删除API'),
        createBtn('edit', '编辑API')
      ])
    ])
  }
  clickNodeBtn(item: any, icon: string) {
    switch (icon) {
      case 'document':
        this.$emit('add', item.name)
        break
      case 'edit':
        if (item.label === 'module') {
          this.editModule(item.name)
        } else {
          this.$emit('edit', item.id)
        }
        break
      case 'delete':
        if (item.label === 'module') {
          this.deleteModule(item.name)
        } else {
          this.$emit('delete', item.id)
        }
        break
    }
  }
  async refreshApiList() {
    this.refreshing = true
    let resp: any = await http.get('/api/project/' + this.proId + '/api')
    let resp2: any = await http.get('/api/project/' + this.proId)
    if (resp2.name && resp.apiList) {
      this.proName = resp2.name
      let list: any = formatApiToTree(resp.apiList)
      this.apiList = list || []
    } else {
      this.$message({type: 'error', message: resp2.errMsg || '刷新失败'})
    }
    this.refreshing = false
  }
  mounted() {
    this.refreshApiList()
    hotkeys('alt+m', (e:any) => {
      e.preventDefault()
      this.addModule()
    })
    hotkeys('alt+f', (e:any) => {
      e.preventDefault()
      let input:any = document.querySelector('.api-search input')
      input ? input.focus() : void 0
    })
  }
  esc(e:any) {
    this.filterText = ''
    e.target.blur()
  }
  destroyed() {
    hotkeys.unbind('alt+m')
    hotkeys.unbind('alt+f')
  }
  defaultProps: Object = {
    children: 'children',
    label: 'name'
  }
  get expandedKeys() {
    let keys: string[] = []
    this.apiList.forEach((api:any) => {
      api.children = api.children || []
      api.children.forEach((ifc:any) => {
        if (ifc.id === this.clickedId) {
          keys = [api.id, this.clickedId]
          setTimeout(() => {
            let dom: any = document.querySelector('.api-tree [title="' + ifc.name + '"]')
            dom ? dom.click() : void 0
          }, 0)
        }
      })
    })
    return keys
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
  selectApi(data:any, node:any, tree:any) {
    if (!data.operation) {
      this.$emit('view', data.id, data.name, data.label)
    }
    // debounce
    setTimeout(() => delete data.operation, 0)
  }
  async addModule() {
    let {value} = await this.$prompt('请输入模块名', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'})
    if (value) {
      this.apiList.unshift({
        id: gId(),
        label: 'module',
        name: value,
        children: []
      })
    }
  }
  async editModule(name: string) {
    let {value} = await this.$prompt('请输入模块名', '修改模块:' + name, {confirmButtonText: '确定', cancelButtonText: '取消'})
    try {
      if (value) {
        await http.put('/api/module', {
          name,
          newName: value
        })
        this.apiList.forEach((item:any) => {
          if (item.name === name) {
            item.name = value
          }
        })
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  async deleteModule(name: string) {
    try {
      await this.$confirm(`确认删除模块${name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await http.delete('/api/module', {
        name
      })
      let idx = 0
      this.apiList.forEach((item: any, index: number) => {
        if (item.name === name) idx = index
      })
      this.apiList.splice(idx, 1)
    } catch (e) {
      this.$message.error(e)
    }
  }
}
</script>
<style lang="stylus">
.api-tree
  .el-tree-node__content
    display flex
    height 30px
    line-height 30px
    overflow-y hidden
    .el-tree-node__expand-icon
      margin-top 10px
    .tree-node:hover
      .node-btns
        visibility visible
    .tree-node
      .node-btns
        position absolute
        right 10px
        top -3px
        visibility hidden
        .el-icon-delete
          color #FF4949
</style>
<style lang="stylus" scoped>
.api-wrap
  background-color #fff
  border 1px solid #eee
  border-right-width 0
  height 100%
  min-width 10px
.api-operation
  padding 5px
.drag-line
  position absolute
  width 5px
  top 0
  right 0
  bottom 0
  z-index 1000
  border-right 1px solid #ccc
  cursor col-resize
.ml-10
  margin-left 10px
.append-table-row
  border 1px solid #dfe6ec
  border-top 0
.api-search
  padding 5px
.api-tree
  width 100%
  .el-tree
    border-width 0
    padding-bottom 1px
.btn-add-child-param
  top 50%
  transform translateY(-50%)
</style>

