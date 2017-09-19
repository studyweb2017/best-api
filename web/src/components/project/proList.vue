<template lang="pug">
    //- pro-box.d-ib
    //- pro-box.d-ib(v-for='(project, index) in projects',:project='project',:projects='projects', :projectIndex='index' :key='project.id')
    div.pro-list.ta-l
      div.pro-item.d-ib.p-r.cu-p.ta-c(@click='go("add")')
        el-card(:body-style='{padding:"0px"}')
          div.pro-add.p-r
      div.pro-item.d-ib.p-r.cu-p.ta-c(v-for='(pro, index) in projects', :key='pro.id', @click.stop='go("api", pro.id)')
        el-card(:body-style='{ padding: "0px" }')
          el-button.f-r.btn-edit(@click.stop='go("edit", pro.id)', icon='edit', type='default')
          el-button.f-r.btn-del(type='defalut', size='normal', @click.stop.prevent='delPro(pro.id, index)', icon='close')
          p.cl-b
            span.mr-10 总共：{{pro.api.total}}
            span.mr-10 通过: {{pro.api.pass}}
            span {{'未测：' + pro.api.untest}}
          img.pro-img.d-b.cl-b(:src='pro.imgUrl', class='image')
          h3.pro-name
            span {{pro.name}}
          span.pro-id.d-b.cu-t(@click.stop.prevent='') {{pro.id}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
@Component
export default class proList extends Vue {
  $confirm: any
  $message: any
  $router: any
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
  go (to:any, proId?:any) {
    if (to === 'api') {
      this.$router.push('/project/' + proId + '/api')
    } else if (to === 'edit') {
      this.$router.push('/project/' + proId + '/edit')
    } else if (to === 'add') {
      this.$router.push('/project/add')
    }
  }
  async delPro(proId:any, proIndex:any) {
    try {
      await this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let resp:any = await http.delete('/api/project/' + proId)
      if (resp.status === 200) {
        resp.data.errCode === 0 ? this.projects.splice(proIndex, 1) : 1 > 0
        this.$message({
          type: 'success',
          message: resp.data.errMsg || '删除成功！'
        })
      }
    } catch (err) {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.pro-list
  margin 50px
.pro-item
  margin 0 20px 40px
  height 250px
  width 250px
  .el-card
    height @height
    width @width
.pro-img
  margin 20px auto
  width 80px
  height 80px
.pro-name
  margin 10px
  height 30px
  font-weight 500
.pro-id
  display none
  line-height 30px
.pro-add
  margin 25px 0 0 25px
  width 200px
  height 200px
.pro-add:before
  content ''
  position absolute
  top 90px
  left 50px
  z-index 2
  width 100px
  height 20px
  background-color #ddd
.pro-add:after
  content ''
  position absolute
  top 50px
  left 90px
  z-index 2
  width 20px
  height 100px
  background-color #ddd
.btn-del
  color red
.btn-edit
  color #20a0ff
.btn-edit,
.btn-del
  padding 10px
  opacity 0
  border none
.pro-item:hover
  .el-card
    background-color #f9f9f9
  .btn-del,
  .btn-edit
    background-color #f9f9f9
    opacity 1
  .pro-id
    display block
</style>
