<template lang="pug">
div
  router-link(to="#", title="title").class hello
  i.fa.fa-camera-retro
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class doc extends Vue {
}
</script>

<style lang="stylus" scoped>
</style>
