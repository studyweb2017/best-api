<template lang="pug">
  div#app.p-r
    header.p-a
      nav-bar
    main.p-a
      router-view
</template>

<script lang="ts">
  import navBar from './components/navBar'
  import tab from './components/tab'
  export default {
    name: 'app',
    components: {
      navBar,
      tab
    }
  }
</script>

<style lang="stylus">
*
  box-sizing border-box
html,
body
  margin 0
#app
  margin 0 auto
  width 100%
  height 100%
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
main
  top 60px
  left 0
  right 0
  bottom 0
header
  top 0
  left 0
  right 0
  height 60px
ul
  margin 0
  padding 0
li
  margin 0
  list-style none
.p-r
  position relative
.p-a
  position absolute
.d-b
  display block
.d-ib
  display inline-block
.f-l
  float left
.f-r
  float right
.cl-b
  clear both
.ta-c
  text-align center
.ta-l
  text-align left
.ta-r
  text-align right
.va-t
  vertical-align top
.va-m
  vertical-align middle
.c-f
  color #fff
.mb-10
  margin-bottom 10px
.w-200
  width 200px
</style>
