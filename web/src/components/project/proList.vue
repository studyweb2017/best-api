<template lang="pug">
  div.pro-list
    pro-box.d-ib
    pro-box.d-ib(v-for='(project, index) in projects',:project='project',:projects='projects', :projectIndex='index' :key='project.id')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import proBox from './proBox'
import http from '../../service/http.ts'
@Component({
  components: {
    proBox
  }
})
export default class proList extends Vue {
  projects: any[] = [{
    id: '0000',
    name: '示例项目',
    api: {
      total: 0,
      pass: 0,
      untest: 0
    }
  }]
  async beforeMount() {
    let resp:any = await http.get('/api/project')
    this.projects = resp.list && resp.list[0].api ? resp.list : this.projects
  }
}
</script>

<style lang="stylus" scoped>
.pro-list
  margin 50px
</style>
