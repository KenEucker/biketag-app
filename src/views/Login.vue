<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import BikeTagLogo from '@/components/BikeTagLogo.vue'
const router = useRouter()
const auth = inject('auth')
function login() {
  router.push('/games')
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <bike-tag-logo class="mr-2" />
        <span class="text-2xl font-semibold text-gray-700">BikeTag</span>
      </div>
      <p
        class="mt-6 font-semibold text-sm text-center"
        v-if="auth.isAuthenticated"
      >
        Welcome {{ auth.user.name }}
      </p>
      <button
        @click="login"
        class="mt-6 w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
      >
        {{ auth.isAuthenticated ? 'Continue' : 'Sign in' }}
      </button>
    </div>
  </div>
</template>
