<template lang="pug">
  div.p-a.l-0.r-0.b-0.t-40.d-f
    ApiList(:proId="proId", @add="addApi", @view="viewApi", @edit="editApi", @delete="deleteApi")
    ApiEdit.f-1(v-if="mode==='edit'", :proId="proId", :apiId="apiId", :moduleName="moduleName", @updated="apiModified",  @cancel="cancelEdit")
    ApiView.f-1(v-if="mode==='view'", :proId="proId", :apiId="apiId")
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ApiList from './ApiList.vue'
import ApiView from './ApiView.vue'
import ApiEdit from './ApiEdit.vue'
import {Watch} from 'vue-property-decorator'

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
  proId: string
  apiId: string
  mode: string = ''
  moduleName: string
  beforeCreate() {
    this.proId = this.$route.params.proId
    this.apiId = this.$route.query.id
    this.moduleName = this.$route.query.name
  }
  @Watch('$route')
  routeChancged() {
    this.proId = this.$route.params.proId
    this.apiId = this.$route.query.id
    this.moduleName = this.$route.query.name
  }
  addApi(moduleName: any) {
    this.moduleName = moduleName
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
  deleteApi(id: string) {
    //
  }
  apiModified() {
    this.mode = 'view'
  }
}
</script>
<style scoped lang="stylus">
  
</style>
