<script setup lang="ts">
import DocumentHead from '@/components/app/DocumentHead.vue'
import AppHeader from '@/components/app/AppHeader.vue'
import AppFooter from '@/components/app/AppFooter.vue'
</script>

<template>
  <v-app class="overflow-hidden">
    <document-head />

    <app-header />

    <v-main class="px-15 pt-30 mb-100 overflow-auto relative">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </v-main>

    <app-footer />
  </v-app>
</template>

<style lang="scss">
@import '~/vuetify/lib/styles/settings';

html {
  // Fix always scrollbar shown.
  // overflow-y: hidden;

  // Modern scrollbar style
  scrollbar-width: thin;
  scrollbar-color: map-get($grey, 'lighten-2') map-get($grey, 'base');
}

::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.5rem rgb(0 0 0 / 10%);
  background-color: map-get($grey, 'lighten-2');
}

::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: map-get($grey, 'base');
  box-shadow: inset 0 0 0.5rem rgb(0 0 0 / 10%);
}

// Fixed a bug that the theme color is interrupted when scrolling
// .v-application {
//   overflow-y: auto;
// }

// Fix app-bar's progress-bar
.v-app-bar .v-progress-linear {
  position: absolute;
  bottom: 0;
}
</style>
