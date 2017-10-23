<template lang="pug">
  div.news
    div.news-list
      h3.news-title 全部通知
      el-row(v-for='(n, index) in newsList', :key='index')
        el-col(:span='6')
          span {{n.when}}
        el-col(:span='2')
          span {{n.who}}
        el-col(:span='2')
          span {{n.do + '了'}}
        el-col.ta-l(:span='10')
          span {{n.what}}
        el-col(:span='2')
          el-button(v-if='n.read', type='text', disabled) 已读
          el-button(v-if='!n.read', @click='mark(n, index)', type='text') 标为已读
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import http from '../service/http.ts'
interface News extends Object {
  id?: string,
  who?: string,
  when?: string,
  do?: string,
  what?: string,
  read?: boolean
}
@Component
export default class news extends Vue {
  newsList: News[] = []
  async beforeMount() {
    let resp:any = await http.get('/api/news')
    this.newsList = resp.list
  }
  async mark(news: any, index:any) {
    news.read = true
    this.newsList[index].read = true
    await http.put('/api/news/' + news.id, news)
  }
}
</script>

<style lang="stylus" scoped>
.news-list
  margin 0 auto
  width 960px
.news-title
  margin 0
  line-height 100px
  border-bottom 1px solid #ddd
.el-row
  line-height 50px
  border-bottom 1px solid #ddd
</style>
