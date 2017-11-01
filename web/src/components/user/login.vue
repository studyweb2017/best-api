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
  margin-top 20%
</style>
