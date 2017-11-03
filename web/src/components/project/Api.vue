<template lang="pug">
  div.p-a.l-0.r-0.b-0.t-40
    ApiList(:proId="proId")
    // div.api-detail-wrap.p-r#detail-wrap(:class='showTree?"ml-250":"ml-10"')
    //   el-row.border-b.operation-btns.p-a.ta-l
    //     el-button(size='small', icon='view', type='default', @click='viewApi(apiId)') 查看
    //     el-button(size='small', icon='edit', type='default', @click='editApi(apiId)') 编辑
    //     el-button(size='small', icon='document', type='default') 复制
    //     el-button(size='small', icon='document', type='default') 导入
    //     el-button(size='small', icon='view', type='default', @click='viewHistory(apiId)') 版本对比
    //     el-button(size='small', icon='view', type='default') 模拟请求
    //   router-view(:key='$route.fullPath', v-on:update='refreshApiList')
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ApiList from './ApiList.vue'
import http from '../../service/http'

@Component({
  components: {
    ApiList
  }
})
export default class Api extends Vue {
  $route: any
  $message: any
  $confirm: any
  proId: string
  created() {
    this.proId = this.$route.params.proId
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
<style scoped lang="stylus">
  
</style>
