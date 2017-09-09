<template lang="pug">
  p {{'this is test page'}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class test extends Vue {
  name: 'test'
}
</script>

<style lang="stylus" scoped>
</style>
