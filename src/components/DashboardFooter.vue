<script lang="ts" setup>
import { ref } from 'vue'
import { IonFooter } from '@ionic/vue'

const currentYear = ref<number>(new Date().getFullYear())
</script>

<template>
  <ion-footer
    class="items-center justify-between w-full px-8 py-3 border-t-2 lg:flex"
  >
    <p class="mb-2 lg:mb-0">© Copyright {{ currentYear }}</p>

    <div class="flex">
      <a href="/terms" class="mr-6 hover:text-gray-900">Terms of Service</a>
      <a href="/privacy" class="mr-6 hover:text-gray-900">Privacy Policy</a>
      <a href="/conduct" class="mr-6 hover:text-gray-900">Code Of Conduct</a>
      <a href="/about" class="hover:text-gray-900">About Us</a>
    </div>
  </ion-footer>
</template>
