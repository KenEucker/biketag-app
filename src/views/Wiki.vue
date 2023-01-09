<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BikeTagLogo from '@/components/biketag/BikeTagLogo.vue'
import Markdown from 'vue3-markdown-it'
import axios from 'axios'
const router = useRouter()

const urlSlug = router.currentRoute.value.path.substring(1)
const title = router.currentRoute.value.name
const wikiMarkdown = ref('')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
axios.get(`./wiki/${urlSlug}.md`).then((response: any) => {
  wikiMarkdown.value = response.data
})
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
      <markdown :source="wikiMarkdown"></markdown>
    </div>
  </div>
</template>
