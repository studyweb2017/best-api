<template lang="pug">
  p {{'this is doc page'}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class doc extends Vue {
  name: 'doc'
}
</script>

<style lang="stylus" scoped>
</style>
