<script setup lang="ts">
import { useRouter } from 'vue-router'
import BikeTagLogo from '@/components/BikeTagLogo.vue'
import { auth } from '@/auth'
const router = useRouter()

function login() {
  router.push('/games')
}
function asGuest() {
  router.push('/guest/games')
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <bike-tag-logo class="mr-2" />
        <span class="text-2xl font-semibold text-gray-700">BikeTag</span>
      </div>
      <p class="mt-6 text-sm font-semibold text-center" v-if="auth.isAuthenticated">
        Welcome {{ auth.user.name }}
      </p>
      <button v-else @click="asGuest"
        class="w-full px-4 py-2 mt-6 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500">
        Continue as Guest
      </button>
      <button @click="login"
        class="w-full px-4 py-2 mt-6 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500">
        {{ auth.isAuthenticated ? 'Continue' : 'Sign in' }}
      </button>
    </div>
  </div>
</template>
