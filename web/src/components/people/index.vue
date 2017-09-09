<template lang="pug">
  div.people
    el-tabs(v-model='activeTab')
      el-tab-pane(label='成员管理', name='member')
        member
      el-tab-pane(label='分组管理', name='group')
      el-tab-pane(label='团队管理', name='team')

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import member from './member'
@Component({
  components: {
    member
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
