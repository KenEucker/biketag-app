<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
  type WritableComputedRef
} from 'vue'
import { useTheme } from 'vuetify/lib/framework.mjs'
import { useDark } from '@vueuse/core'

// Stores
import { useGlobal } from '@/store'

// Components
import AppBarMenuComponent from '@/components/app/AppBarMenuComponent.vue'
import DrawerComponent from '@/components/cells/RoutesNav.vue'

// Assets
import logo from '@/assets/logo.svg'

import { useRouter } from 'vue-router'

/** Vuetify Theme */
const theme = useTheme()
const isDark = useDark()

/** Global Store */
const globalStore = useGlobal()
/** Config Store */
// const configStore = useConfig()

/** Title */
const title = import.meta.env.VITE_APP_TITLE || 'Vuetify3 Application'

/** drawer visibility */
const drawer: Ref<boolean> = ref(false)

/** loading overlay visibility */
const loading: WritableComputedRef<boolean> = computed({
  get: () => globalStore.loading,
  set: (v) => globalStore.setLoading(v)
})

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

/** Appbar progressbar value */
const progress: ComputedRef<number | null> = computed(
  () => globalStore.progress
)

/** Snackbar visibility */
const snackbar: Ref<boolean> = ref(false)

/** Snackbar text */
const snackbarText: ComputedRef<string> = computed(() => globalStore.message)

/** Theme Color (Sync browser theme color to vuetify theme color) */
const themeColor: ComputedRef<string> = computed(
  () =>
    theme.computedThemes.value[isDark ? 'dark' : 'light'].colors.primary
) // When snackbar text has been set, show snackbar.
watch(
  () => globalStore.message,
  async (value) => {
    snackbar.value = value !== ''
    await nextTick()
  }
)

/** Clear store when snackbar hide */
const onSnackbarChanged = async () => {
  globalStore.setMessage()
  await nextTick()
}

// When loading overlay value change, force redraw screen.
watch(loading, async () => nextTick())

onMounted(() => {
  document.title = title
  loading.value = false
})
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary>
      <drawer-component />
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title tag="h1">{{ title }}</v-app-bar-title>
      <v-spacer />
      <app-bar-menu-component />
      <v-progress-linear
        v-show="loading"
        :active="loading"
        :indeterminate="progress === null"
        :model-value="progress !== null ? progress : 0"
        color="blue-accent-3"
      />
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </v-main>

    <v-overlay v-model="loading" app class="justify-center align-center">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-snackbar v-model="snackbar" @update:model-value="onSnackbarChanged">
      {{ snackbarText }}
      <template #actions>
        <v-btn icon @click="onSnackbarChanged">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <app-footer />
  </v-app>
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

<style lang="scss">
@import '~/vuetify/lib/styles/settings';

html {
  // Fix always scrollbar shown.
  overflow-y: auto;

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
.v-application {
  overflow-y: auto;
}

// Fix app-bar's progress-bar
.v-app-bar .v-progress-linear {
  position: absolute;
  bottom: 0;
}
</style>
