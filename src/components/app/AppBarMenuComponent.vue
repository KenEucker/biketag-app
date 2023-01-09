<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <!-- Toggle Dark mode -->
  <v-btn icon="mdi-theme-light-dark" @click="toggleDark()" />
</template>
