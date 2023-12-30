<script setup>
// import { watch, ref } from 'vue'
const colorMode = useColorMode()
const toggleValue = ref(colorMode.preference === 'dark')
watch(toggleValue, (value) => {
  colorMode.preference = value ? 'dark' : 'light'
})
</script>
<template>
<u-toggle
  size="xl"
  on-icon="ic:twotone-dark-mode"
  off-icon="ic:round-light-mode"
  v-model="toggleValue"
/>
</template>