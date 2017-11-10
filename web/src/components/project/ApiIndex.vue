<template lang="pug">
  div.p-a.l-0.r-0.b-0.t-40.d-f.bg-white
    ApiList(@getHandler="getTreeHandler", :proId="proId", :clickedId="apiId", @add="addApi", @view="viewApi", @edit="editApi", @delete="deleteApi")
    ApiEdit.f-1.ov-y-a(@getHandler="getEditorHandler", v-show="mode==='edit'", :mode="mode" :proId="proId", :apiId="apiId", :moduleName="moduleName", @updated="apiModified",  @cancel="cancelEdit")
    div.d-f.fd-c.f-1.ov-y-a(v-show="mode==='view'")
      div.api-detail-wrap.p-r#detail-wrap.ta-l
        el-button(size='small', icon='edit', type='default', @click='editApi(apiId)') 编辑
        el-button(size='small', icon='document', type='default', :disabled="true") 复制
        el-button(size='small', icon='view', type='default', @click='viewHistory(apiId)', :disabled="true") 历史
        el-button(size='small', icon='menu', type='default', :disabled="true") 调试
      ApiView.f-1(:proId="proId", :apiId="apiId")
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ApiList from './ApiList.vue'
import ApiView from './ApiView.vue'
import ApiEdit from './ApiEdit.vue'
import http from '../../service/http'

@Component({
  components: {
    ApiList,
    ApiView,
    ApiEdit
  }
})
export default class ApiIndex extends Vue {
  $router: any
  $route: any
  $message: any
  $confirm: any
  mode: string = ''
  moduleName: string = ''
  proId: string = ''
  apiId: string = ''
  treeHandler: any
  editorHandler: any
  created() {
    this.proId = this.$route.params.proId
    this.apiId = this.$route.query.id
  }
  getTreeHandler(treeHandler: any) {
    this.treeHandler = treeHandler
    this.treeHandler.refresh(this.apiId)
  }
  getEditorHandler(handler: any) {
    this.editorHandler = handler
  }
  addApi(moduleName: any) {
    this.moduleName = moduleName
    this.apiId = ''
    this.mode = 'edit'
    // 先渲染apiId
    setTimeout(() => {
      this.editorHandler.reload()
    }, 0)
  }
  viewApi(id: string, name: string, type: string) {
    if (type !== 'url') {
      id = ''
    }
    this.apiId = id
    this.$router.push({
      name: 'api',
      query: {
        id
      }
    })
    this.mode = id ? 'view' : ''
  }
  editApi(id: string) {
    this.$router.push({
      name: 'api',
      query: {
        id
      }
    })
    this.apiId = id
    this.mode = 'edit'
    // 先渲染apiId
    setTimeout(() => {
      this.editorHandler.reload()
    }, 0)
  }
  cancelEdit() {
    this.mode = this.apiId ? 'view' : ''
  }
  async deleteApi(id: string) {
    try {
      await this.$confirm(`确认删除接口?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let resp: any = await http.delete(`/api/project/${this.proId}/api/${this.apiId}`)
      if (resp.errCode) {
        this.$message({type: 'error', message: resp.errMsg || '删除失败'})
      } else {
        this.$message({type: 'success', message: '删除成功'})
      }
    } catch (e) {
      console.error(e)
    }
  }
  apiModified(id: string) {
    this.$router.push({
      name: 'api',
      query: {
        id
      }
    })
    this.mode = 'view'
    this.treeHandler.refresh(id)
  }
}
</script>
<style scoped lang="stylus">
.api-detail-wrap
  box-sizing content-box
  padding 7px 0 10px 30px
.operation-btns
  z-index 100
  top 0
  left 0
  right 0
  padding-left 40px
  line-height 40px
  background-color #eee
</style>
