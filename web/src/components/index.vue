<template lang="pug">
  p {{'this is index page'}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class index extends Vue {
  name: 'index'
}
</script>

<style lang="stylus" scoped>
</style>
