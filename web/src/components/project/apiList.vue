<template lang="pug">
  div.api-wrap.p-r.us-n(:style="treeStyle")
    div(v-show="parseInt(treeStyle.width)>=visibleWidth")
      el-input.api-search(size='small', v-show='showTree', icon='search', v-model='filterText', placeholder="查询接口")
      div.api-operation.ta-r
        i.el-icon-plus.cu-p.c-blue(title="添加模块", @click="addModule")
      div.api-tree
        el-tree.ta-l.ov-y-a.ov-x-h(v-show='showTree', ref='apiTree', @node-click='selectApi',
        class='filter-tree', :data="apiList", :props='defaultProps', :expand-on-click-node='true',
          :default-expanded-keys='["0"]', node-key='id', highlight-current,
          :filter-node-method='filterNode', :render-content='renderBtn')
    div#drag-line.drag-line(@mousedown='mousedown')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch, Prop } from 'vue-property-decorator'
import http from '../../service/http.ts'
import {formatApiToTree, gId} from '../../service/util.ts'

@Component
export default class apiList extends Vue {
  refreshing: boolean = false
  @Prop()
  proId: string
  @Prop()
  apiId: string
  Mock: any
  $refs: any
  $route: any
  $router: any
  $message: any
  $confirm: any
  $prompt: any
  proName: string
  apiList: any[] = []
  showTree: boolean = true
  visibleWidth: number = 250
  startX: number = 0
  startWidth: number
  treeStyle: any = {
    width: '250px'
  }
  mousedown(e:any) {
    this.startX = e.clientX
    this.startWidth = parseInt(this.treeStyle.width)
    document.addEventListener('mouseup', this.mouseup)
    document.addEventListener('mousemove', this.drag)
  }
  mouseup = (e:any) => {
    document.removeEventListener('mousemove', this.drag)
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
            e.preventDefault()
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
    if (icon === 'document') {
      this.$emit(item, 'add')
    } else if (item.label === 'module') {
      this.modifyModule(item.name, icon)
    } else {
      this.$emit(item, icon)
    }
  }
  async refreshApiList() {
    console.log('proid' + this.proId)
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
    this.$emit('clickNode', data, 'select')
  }
  async addModule(data:any) {
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
  async modifyModule(name: string, icon: string) {
    if (icon === 'edit') {
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
    } else if (icon === 'delete') {
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
    } else {
      console.error('操作类型出错：' + icon)
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
  width 250px
  .el-tree
    border-width 0
    padding-bottom 1px
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

