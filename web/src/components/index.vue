<template lang="pug">
<<<<<<< HEAD
  div
    Hello(name="zdl")
=======
  p {{'this is index page'}}
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
<<<<<<< HEAD
import Hello from './Hello.vue'

@Component({
  components: {
    Hello
  }
})
export default class Index extends Vue {
}
</script>
=======

@Component
export default class index extends Vue {
  name: 'index'
}
</script>

<style lang="stylus" scoped>
</style>
>>>>>>> 9e54e799de70785989a55f16c855fd983e7c2deb
