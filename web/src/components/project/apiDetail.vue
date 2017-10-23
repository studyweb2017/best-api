<template lang="pug">
  div.api-detail
    el-row.border-b
      el-button(icon='view', type='default', @click='editApi()') 查看
      el-button(icon='edit', type='default', @click='editApi()') 编辑
      el-button(icon='document', type='default') 复制
      el-button(icon='document', type='default') 导入
      el-button(icon='view', type='default', @click='showHistoryVersion=true') 历史版本
      el-button(icon='view', type='default') 模拟请求
    router-view
</template>
<script lang="ts">
import Vue from 'vue'
export default class apiDetail extends Vue {
  $route: any
  $router: any
  proId: string
  apiId: string
  async beforeMount() {
    this.proId = this.$route.params.proId
    this.apiId = this.$route.params.apiId
  }
  viewApi() {
    this.$router.push({path: '/project/' + this.proId + '/api/' + this.apiId + '/view', query: {mode: 'view'}})
  }
  editApi() {
    this.$router.push({path: '/project/' + this.proId + '/api/' + this.apiId + '/edit', query: {mode: 'edit'}})
  }
}
</script>
