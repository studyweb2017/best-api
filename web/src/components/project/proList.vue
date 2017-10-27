<template lang="pug">
 div
    div.pro-list.ta-l
      el-button.mb-10.ml-20(type='primary', size='small', icon='plus', @click='go("add")') 新建项目
      br
      //- div.pro-item.d-ib.p-r.cu-p.ta-c(@click='go("add")')
      //-   el-card(:body-style='{padding:"0px"}')
      //-     div.pro-add.p-r
      div.pro-item.d-ib.p-r.cu-p.ta-c(v-for='(pro, index) in projects', :key='pro.id', @click.stop='go("api", pro.id)')
        el-card(:body-style='{ padding: "0px" }')
          span.f-r.btn-edit(title='复制项目', @click.stop='go("copy", pro.id)')
            i.fa.fa-copy
          el-button.f-r.btn-edit(:title='loading?"正在生成api文档":"导出api文档"', @click.stop='go("export", pro.id)', :icon='loading?"loading":"upload2"', type='default')
          el-button.f-r.btn-edit(title='编辑项目', @click.stop='go("edit", pro.id)', icon='edit', type='default')
          el-button.f-r.btn-del(title='删除项目', type='defalut', @click.stop.prevent='delPro(pro.id, index)', icon='delete2')
          div.p-a.test-data(v-show='pro.api.isTest')
            span {{'通测:' + pro.api.pass}}
            br
            span {{'未测:' + pro.api.untest}}
          img.pro-img.d-b.cl-b(:src='pro.imgUrl', class='image')
          h3.pro-name
            span {{pro.name + '(' + pro.api.total + ')'}}
          span.pro-id.d-b.cu-t(title='复制项目id', @click.stop.prevent='') {{pro.id}}
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
  projects: any[] = []
  loading: boolean = false
  async getProList() {
    let resp:any = await http.get('/api/project')
    this.projects = resp.list ? resp.list : []
  }
  beforeMount() {
    this.getProList()
  }
  async go (to:any, proId?:any) {
    if (to === 'api') {
      this.$router.push('/project/' + proId + '/api')
    } else if (to === 'edit') {
      this.$router.push('/project/' + proId + '/edit')
    } else if (to === 'add') {
      this.$router.push('/project/add')
    } else if (to === 'copy') {
      let resp:any = await http.get('/api/project/' + proId)
      delete resp.id
      resp.name = resp.name + '副本'
      let resp2:any = await http.post('/api/project', resp)
      resp2.errCode === 0 ? this.getProList() : this.$message({type: 'error', message: resp2.errMsg || '复制失败'})
    } else if (to === 'export') {
      this.loading = true
      let resp:any = await http.get('/api/project/' + proId + '/doc')
      if (resp.url) {
        this.loading = false
        // window.location.href = resp.url
        window.open(resp.url)
      } else {
        this.loading = false
        this.$message({type: 'failed', message: resp.errMsg || '文档生成失败'})
      }
    }
  }
  async delPro(proId:any, proIndex:any) {
    await this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    let resp:any = await http.delete('/api/project/' + proId)
    if (resp.errCode === 0) {
      this.projects.splice(proIndex, 1)
      this.$message({type: 'success', message: '删除成功！'})
    } else {
      this.$message({type: 'error', message: resp.errMsg || '删除失败'})
    }
  }
}
</script>

<style lang="stylus" scoped>
.pro-list
  margin 0 auto
  padding 50px
.pro-item
  margin 0 20px 40px
  height 170px
  width 230px
  .el-card
    background-color #f7f7f7
    height @height
    width @width
.pro-img
  margin 20px auto
  width 50px
  height 50px
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
  height 150px
.pro-add:before
  content ''
  position absolute
  top 50px
  left 50px
  z-index 2
  width 100px
  height 20px
  background-color #ddd
.pro-add:after
  content ''
  position absolute
  top 10px
  left 90px
  z-index 2
  width 20px
  height 100px
  background-color #ddd
.test-data
  left 10px
  top 5px
  font-size 14px
.btn-del
  color red
.btn-edit
  color #20a0ff
.btn-edit,
.btn-del
  margin 0
  padding 5px
  opacity 0
  border none
.pro-item:hover
  .btn-del,
  .btn-edit
    background-color #f7f7f7
    opacity 1
  .pro-id
    display block
</style>
