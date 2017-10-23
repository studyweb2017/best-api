<template lang="pug">
  div.peopl
    el-tabs(v-model='activeTab')
      el-tab-pane(label='成员管理', name='member')
        member
      el-tab-pane(label='分组管理', name='group')
        group
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import member from './member'
import group from './group'
@Component({
  components: {
    member,
    group
  }
})
export default class people extends Vue {
  activeTab: any = 'member'
}
</script>

<style lang="stylus" scoped>
.people
  margin 20px
.el-table
  min-width 500px
</style>
