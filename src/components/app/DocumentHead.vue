<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useTheme } from 'vuetify/lib/framework.mjs'
import { useDark } from '@vueuse/core'
import { useRouter } from 'vue-router'
// Assets
import logo from '@/assets/logo.svg'

/** Vuetify Theme */
const theme = useTheme()
const isDark = useDark()

/** Theme Color (Sync browser theme color to vuetify theme color) */
const themeColor: ComputedRef<string> = computed(
  () => theme.computedThemes.value[isDark ? 'dark' : 'light'].colors.primary
)

const router = useRouter()
const routeMeta = {
  '@schema': 'https://json.schemastore.org/jsonld.json',
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  name: 'BikeTag App',
  content: 'BikeTag,bicycles,game,app,phone,camera,cycling',
  description: 'The application for administrating BikeTag Games',
  url: 'https://github.com/keneucker/biketag-app',
  ...router.currentRoute.value.meta
}
const siteJson = {
  '@schema': routeMeta['@schema'],
  '@context': routeMeta['@context'],
  '@type': routeMeta['@type'],
  name: routeMeta.name ?? router.currentRoute.value.name,
  url: routeMeta.url,
  description: routeMeta.description
}
/** page object data */
const jsonLd = JSON.stringify(siteJson, null, 2)
</script>

<template>
  <teleport to="head">
    <meta name="theme-color" :content="themeColor" />
    <link rel="icon" :href="logo" type="image/svg+xml" />
    <meta name="keyword" :content="routeMeta.content?.toString()" />
    <meta name="description" :content="routeMeta.description?.toString()" />
    <component :is="'script'" type="application/ld+json">
      {{ jsonLd }}
    </component>
  </teleport>
</template>
