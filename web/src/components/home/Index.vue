<template lang="pug">
  div.hello
    h1 Welcome to Best API
    router-link(:to="{name: 'login'}") 去登录
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import cache from '../../service/cache'

@Component
export default class Index extends Vue {
  $router: any
  created() {
    if (cache.get('user')) {
      this.$router.push({
        name: 'projectIndex'
      })
    }
  }
}
</script>
