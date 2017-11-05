<template lang="pug">
  div.pt
    LoginForm(@success="go")
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import LoginForm from '../LoginForm'

@Component({
  components: {
    LoginForm
  }
})
export default class Login extends Vue {
  go() {
    this.$router.push('/project/list')
  }
}
</script>

<style lang="stylus" scoped>
.pt
  padding-top 20%
  background-image url(../../assets/bg.jpg)
  height 100%
</style>
