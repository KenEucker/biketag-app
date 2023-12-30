<script setup lang="ts">
import { ref } from 'vue'
import Searchbar from '~/components/Searchbar.vue'
import ProfileMenu from '~/components/ProfileMenu.vue'
import DarkToggle from '~/components/DarkToggle.vue'

const logout = () =>
  this?.$auth?.logout()
const login = () => {
  this?.$auth?.loginWith('auth0')
}
</script>

<template>
  <header class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
    <div class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
      <searchbar />
      <dark-toggle />
      <profile-menu />
    </div>
  </header>
</template>
