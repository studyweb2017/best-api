<template lang="pug">
  div
    Hello(name="zdl")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Hello from './Hello.vue'

@Component({
  components: {
    Hello
  }
})
export default class Index extends Vue {
}
</script>
