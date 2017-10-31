<template lang="pug">
  div#app
    nav-bar
    router-view.main.pt-40
</template>

<script lang="ts">
  import navBar from './components/navBar'
  export default {
    name: 'app',
    components: {
      navBar
    }
  }
</script>

<style lang="stylus">
@import "./common.styl"
*
  box-sizing border-box
html,
body
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
</style>
