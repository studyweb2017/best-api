<template lang="pug">
  div.hello
    h1 aaa
    h1 {{msg}}
    h2 {{name}}
</template>

<script lang="ts">
import Vue from 'vue'
import http from '../service/http.ts'
import Component from 'vue-class-component'

@Component({
  props: {
    name: String
  }
})
export default class Hello extends Vue {
  msg: string = 'Welcome to Best API'
  name: string
  async mounted () {
    this.msg = (await http.get('/api/11')).toString()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h1, h2 
  font-weight normal
  color: blue

ul 
  list-style-type none
  padding 0

li 
  display inline-block
  margin 0 10px
</style>
