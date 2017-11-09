<template lang="pug">
  div.p-a.l-0.r-0.b-0.t-40.d-f.bg-white
    ApiList(:refresh="refreshApiList", :proId="proId", :clickedId="apiId", @add="addApi", @view="viewApi", @edit="editApi", @delete="deleteApi")
    ApiEdit.f-1.ov-y-a(v-if="mode==='edit'", :proId="proId", :apiId="mode==='edit'?apiId:''", :moduleName="moduleName", @updated="apiModified",  @cancel="cancelEdit")
    div.d-f.fd-c.f-1.ov-y-a(v-if="mode==='view'")
      div.api-detail-wrap.p-r#detail-wrap.ta-l
        el-button(size='small', icon='edit', type='default', @click='editApi(apiId)') 编辑
        el-button(size='small', icon='document', type='default') 复制
        el-button(size='small', icon='view', type='default', @click='viewHistory(apiId)') 历史
        el-button(size='small', icon='menu', type='default') 调试
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
  refreshApiList: any = Math.random()
  get proId() {
    return this.$route.params.proId
  }
  get apiId() {
    return this.$route.query.id
  }
  addApi(moduleName: any) {
    this.moduleName = moduleName
    this.$router.push({
      name: 'api',
      query: {
        moduleName
      }
    })
    this.mode = 'edit'
  }
  viewApi(id: string, name: string, type: string) {
    let query: any = {
      id: ''
    }
    if (type === 'url') {
      query = {
        id,
        name
      }
      this.mode = 'view'
    } else {
      this.mode = ''
    }
    this.$router.push({
      name: 'api',
      query
    })
  }
  editApi(id: string) {
    this.mode = 'edit'
    this.$router.push({
      name: 'api',
      query: {
        id
      }
    })
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
    this.mode = 'view'
    this.$router.push({
      name: 'api',
      query: {
        id,
        _: Math.random()
      }
    })
    this.refreshApiList = Math.random()
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
