<template>
  <h2 class="!mt-0">{{ props.msg }}</h2>
  <!-- <input v-model="player" type="text" name="player" /> -->
  <br />
  SOCIAL LOGIN BUTTON
</template>

<script setup lang="ts">
const props = defineProps({
  msg: {
    type: String,
    default: 'Log In To BikeTag'
  }
})
</script>
