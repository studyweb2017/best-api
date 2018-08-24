<template lang="pug">
  div.pt.ta-c
    h1 Welcome to Best API
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Index extends Vue {
  $router: any
  created() {
    this.$router.push({
      name: 'projectIndex'
    })
  }
}
</script>

<style lang="stylus" scoped>
.pt
  background-size cover
  background-image url(../../assets/bg.jpg)
  color #fff
  height 100%
  padding-top 25%
</style>
