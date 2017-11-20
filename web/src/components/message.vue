<template lang="pug">
div.wrap.bg-white
  div.message(v-for='(m, index) in messageInfo.list', :key='m.id')
    div
      span {{m.operator}} {{m.operation}} {{m.module}} {{m.objectName}}
      span.f-r(v-if='m.isRead', type='text', disabled) 已读
      el-button.f-r(v-else, @click='mark(m, index)', type='text') 标为已读
    div {{m.datetime}}
  el-pagination.ta-c.mt-20(layout="sizes, prev, pager, next, total", :page-size='messageInfo.size', 
  :total='messageInfo.total', @current-change='changePage', @size-change='changeSize', 
  :current-page.sync='messageInfo.page')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../service/http.ts'
interface Message extends Object {
  id: string,
  isRead: boolean
}
interface MessageInfo extends Object {
  page: number,
  size: number,
  total: number,
  list: Message[]
}
@Component
export default class message extends Vue {
  $message:any
  url:string = '/api/message'
  messageInfo: MessageInfo = {
    page: 1,
    size: 10,
    total: 0,
    list: []
  }
  async getMessageList(url:string, page:number, size:number) {
    let resp:any = await http.get(url + '?page=' + page + '&size=' + size)
    this.messageInfo = resp
  }
  beforeMount() {
    this.getMessageList(this.url, 1, this.messageInfo.size)
  }
  async mark(message: any, index:any) {
    let resp:any = await http.put('/api/message/' + message.id, { read: true })
    if (resp.errCode === 0) {
      this.messageInfo.list[index].isRead = true
    } else {
      this.$message({type: 'error', message: resp.errMsg || '操作失败'})
    }
  }
  changePage(page:number) {
    this.getMessageList(this.url, page, this.messageInfo.size)
  }
  changeSize(size:number) {
    this.getMessageList(this.url, 1, size)
  }
}
</script>

<style lang="stylus" scoped>
.message
  border-bottom 1px solid #ddd
  padding 10px 20px
  &:nth-child(odd)
    background-color #fafafa
.message-title
  margin 0
  line-height 80px
  border-bottom 1px solid #ddd
.el-row
  line-height 30px
  border-bottom 1px solid #ddd
</style>
