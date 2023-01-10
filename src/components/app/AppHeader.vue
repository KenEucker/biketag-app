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
import AppBarMenuComponent from '@/components/app/AppBarMenuComponent.vue'
import DrawerComponent from '@/components/cells/RoutesNav.vue'
import BiketagLogo from '@/components/biketag/BikeTagLogo.vue'
import { useGlobal } from '@/store'

const globalStore = useGlobal()
/** drawer visibility */
const drawer: Ref<boolean> = ref(false)

/** Title */
const title = import.meta.env.VITE_APP_TITLE || 'The BikeTag Platform'

/** Appbar progressbar value */
const progress: ComputedRef<number | null> = computed(
  () => globalStore.progress
)

/** loading overlay visibility */
const loading: WritableComputedRef<boolean> = computed({
  get: () => globalStore.loading,
  set: (v) => globalStore.setLoading(v)
})

// When loading overlay value change, force redraw screen.
watch(loading, async () => nextTick())

onMounted(() => {
  document.title = title
  loading.value = false
})
</script>

<template>
  <v-navigation-drawer v-model="drawer" temporary>
    <drawer-component />
  </v-navigation-drawer>

  <v-app-bar>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <biketag-logo />
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

  <v-overlay v-model="loading" app class="justify-center align-center">
    <v-progress-circular indeterminate size="64" />
  </v-overlay>
</template>
