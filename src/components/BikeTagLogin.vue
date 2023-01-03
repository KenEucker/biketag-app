<template>
  <h2 class="!mt-0">{{ props.msg }}</h2>
  <input type="text" name="player" v-model="player" />
  <br />
  SOCIAL LOGIN BUTTON
</template>

<script setup lang="ts">
import {ref } from 'vue'
const player = ref()
const props = defineProps({
    msg: {
      type: String,
      default: 'Log In To BikeTag',
    },
  })
</script>
