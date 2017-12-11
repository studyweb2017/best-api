<template lang="pug">
  div.p-a.l-0.r-0.b-0.t-40.d-f.bg-white
    ApiList(@getHandler="getTreeHandler", :proId="proId", :clickedId="apiId", @add="addApi", @view="viewApi", @edit="editApi", @delete="deleteApi")
    ApiEdit.f-1.ov-y-a(@getHandler="getEditorHandler", v-show="mode==='edit'", :mode="mode" :proId="proId", :apiId="apiId", :moduleName="moduleName", @updated="apiModified",  @cancel="cancelEdit")
    div.d-f.fd-c.f-1.ov-y-a(v-show="mode==='view'")
      div.api-detail-wrap.p-r#detail-wrap.ta-l
        el-button(size='small', icon='edit', type='default', @click='editApi(apiId)') 编辑
        el-button(size='small', icon='document', type='default', :disabled="true") 复制
        el-button(size='small', icon='menu', type='default', :disabled="true") 调试
        el-button(v-if="versionList.length>0", v-show="!comparing", size='small', icon='view', type='default', @click="compare") 对比
        el-select.f-r.mr-10(v-if="comparing", v-model="version", size="small")
          el-option(v-for="version in versionList", :key="version", :label="version", :value="version")
      div.d-f.f-1.p-r
        ApiView.f-1(:proId="proId", :apiId="apiId", :compareVersion="version")
        ApiView.f-1(v-if="comparing", :proId="proId", :apiId="apiId", :currentVersion="version")
        i.p-a.cu-p.c-red.close-history.el-icon-close(v-if="comparing", @click="comparing=false", title="关闭")
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ApiList from './ApiList.vue'
import ApiView from './ApiView.vue'
import ApiEdit from './ApiEdit.vue'
import Api from './Api'
import _ from 'lodash'

let apiService:any = {}
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
  comparing: boolean = false
  version: string = ''
  versionList: string[] = []
  async created() {
    this.proId = this.$route.params.proId
    this.apiId = this.$route.query.id
    apiService = new Api(this.proId)
  }
  compare() {
    this.comparing = true
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
    setTimeout(() => this.editorHandler.reload(moduleName), 0)
  }
  async viewApi(id: string, name: string, type: string) {
    this.comparing = false
    if (type === 'url') {
      try {
        this.version = ''
        this.versionList = []
        let resp: any = await apiService.getVersion(id)
        resp.versionList.forEach((item: any) => {
          this.versionList.push(item.version)
        })
        this.versionList = _.uniq(this.versionList)
        if (this.versionList.length) this.version = this.versionList[0]
      } catch (e) {
        console.error(e)
      }
    } else {
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
    setTimeout(() => this.editorHandler.reload(), 0)
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
      let resp: any = apiService.delete(id)
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
.close-history
  right 30px
  transition transform .2s
  &:hover
    transform rotate(90deg)
</style>
