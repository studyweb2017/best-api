<template lang="pug">
  div.hello
    h1 {{msg}}
</template>

<script lang="ts">
import http from '../service/http.ts'

http.get('/api/11').then(resp => console.log(resp))
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Best API'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h1, h2 
  font-weight normal

ul 
  list-style-type none
  padding 0

li 
  display inline-block
  margin 0 10px

a 
  color #42b983
</style>
