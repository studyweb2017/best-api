<template lang="pug">
  div.message
    div.message-list
      h3.message-title 全部通知
      el-row(v-for='(m, index) in messageInfo.list', :key='index')
        el-col(:span='6')
          span {{m.when}}
        el-col(:span='2')
          span {{m.who}}
        el-col(:span='2')
          span {{m.do + '了'}}
        el-col.ta-l(:span='10')
          span {{m.what}}
        el-col(:span='2')
          el-button(v-if='m.read', type='text', disabled) 已读
          el-button(v-if='!m.read', @click='mark(m, index)', type='text') 标为已读
      el-pagination.mt-10(layout="sizes, prev, pager, next, total", :page-size='messageInfo.size', :total='messageInfo.total', @current-change='changePage', @size-change='changeSize', :current-page.sync='messageInfo.page')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../service/http.ts'
interface Message extends Object {
  id: string,
  who: string,
  when: string,
  do: string,
  what: string,
  read: boolean
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
      this.messageInfo.list[index].read = true
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
.message-list
  margin 0 auto
  width 960px
.message-title
  margin 0
  line-height 100px
  border-bottom 1px solid #ddd
.el-row
  line-height 50px
  border-bottom 1px solid #ddd
</style>
