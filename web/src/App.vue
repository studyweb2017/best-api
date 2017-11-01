<template lang="pug">
  div#app
    router-view.main.pt-40
</template>

<script lang="ts">
  export default {
    name: 'app'
  }
</script>

<style lang="stylus">
@import "./common.styl"
*
  box-sizing border-box
html,
body
  background-color #f9fafc
  margin 0
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
ul
  margin 0
  padding 0
li
  margin 0
  list-style none
.wrap 
  padding 30px
</style>
