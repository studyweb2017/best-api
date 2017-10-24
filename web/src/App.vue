<template lang="pug">
  div#app.p-a
    nav-bar
    router-view.main.p-a
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
  margin 0 auto
  top 0
  left 0
  right 0
  bottom 0
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
.main
  top 60px
  left 0
  right 0
  bottom 0
.nav-bar
  top 0
  left 0
  right 0
  height 60px
  background-color #20a0ff
ul
  margin 0
  padding 0
li
  margin 0
  list-style none
</style>
