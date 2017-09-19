<template lang='pug'>
  div.tab-bar
    span.tab(v-for='tab in tabs') {{'tidu' + $route.path.split('/').join('>')}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class tab extends Vue {
  name: 'tab'
  tabs: string[] = [
    ''
  ]
}
</script>
<style scoped lang='stylus'>
  .tab-bar
    width 800px
    height 50px
    margin 0 auto
    text-align left

</style>
