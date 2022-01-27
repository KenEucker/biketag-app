<template>
  <h2 class="!mt-0">{{ msg }}</h2>
  <input type="text" name="player" v-model="player" />
  <br />
  SOCIAL LOGIN BUTTON
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BikeTagLogin',
  props: {
    msg: {
      type: String,
      default: 'Log In To BikeTag',
    },
  },
})
</script>
