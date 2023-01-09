<script setup lang="ts">
import { useRouter } from 'vue-router'
import BikeTagLogo from '@/components/biketag/BikeTagLogo.vue'
import configuration from '@/assets/wiki/configuration.md'
import contributing from '@/assets/wiki/contributing.md'
import developers from '@/assets/wiki/developers.md'
import privacy from '@/assets/wiki/privacy.md'
import conduct from '@/assets/wiki/conduct.md'
import terms from '@/assets/wiki/terms.md'

const router = useRouter()

const path = router.currentRoute.value.path
const title = router.currentRoute.value.name
</script>

<template>
  <div class="flex justify-center h-screen px-6 bg-gray-200">
    <div class="w-full p-6 bg-white rounded-md shadow-md">
      <div class="flex justify-center">
        <bike-tag-logo class="mr-2" />
        <span class="text-2xl font-semibold text-gray-700"
          >BikeTag {{ title }}</span
        >
      </div>
      <configuration v-if="path === '/configuration'" />
      <contributing v-else-if="path === '/contributing'" />
      <developers v-else-if="path === '/developers'" />
      <privacy v-else-if="path === '/privacy'" />
      <conduct v-else-if="path === '/conduct'" />
      <terms v-else-if="path === '/terms'" />
    </div>
  </div>
</template>
