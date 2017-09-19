<template lang="pug">
  div.projects.p-r
    router-view
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
@Component
export default class project extends Vue {
}
</script>

<style lang="stylus">
.projects
  width 100%
  height 100%
</style>
