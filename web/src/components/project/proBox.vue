<template lang="pug">
  div.project.va-t
    div.pro-box.p-r(v-if='!project')
      router-link(to='/project/add')
        div.pro-add.p-r
    div.pro-box.p-r(v-else)
      div.pro-data.p-a
        p 总共：{{project.api.total}}
        p {{'通测：' + project.api.pass}}
        p {{'未测：' + project.api.untest}}
      div.operation.p-a
        el-button.edit(type='text', @click='delPro') 删除
        router-link.edit.d-b(:to="{name:'proEdit',params: {id:project.id}}") 编辑
      router-link.pro-name.d-b(:to="{name:'proApi', params: {id:project.id}}") {{project.name}}
      //- p.pro-name {{project.name}}
      p.pro-id {{'id:' + project.id}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../../service/http.ts'
@Component({
  props: {
    project: {
      type: Object
    },
    projectIndex: {
      type: Number
    },
    projects: {
      type: Array
    }
  }
})
export default class proBox extends Vue {
  $confirm: any
  $message: any
  $router: any
  project: any
  projectIndex: number
  projects: any
  async delPro() {
    try {
      await this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let resp:any = await http.delete('/api/project/' + this.project.id)
      if (resp.status === 200) {
        resp.data.errCode === 0 ? this.projects.splice(this.projectIndex, 1) : 1 > 0
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
.pro-box
  margin 0 20px 40px
  width 200px
  height 200px
  border 1px solid #333
.pro-add
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

.pro-name
  margin 100px 0 10px
  top 80px
  font-size 20px
  font-weight 100
  text-align center
.pro-id
  margin 10px 0
.pro-data
  p
    margin 10px 5px
    font-size 12px
.operation
  top 0
  right 0
  text-align right
.edit,
.delete
  margin-top 10px
  margin-right 5px
  padding 0
  font-size 12px
  text-decoration none
</style>
