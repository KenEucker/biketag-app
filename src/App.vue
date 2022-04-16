<script setup lang="ts">
import DashboardLayout from './layouts/DashboardLayout.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const { currentRoute } = useRouter()
const layout = computed(() => {
  const l = `${currentRoute.value.meta?.layout ?? 'Default'}Layout`
  console.log({ l })
  return l
})
</script>

<template>
  <dashboard-layout v-if="layout == 'DashboardLayout'">
    <router-view />
  </dashboard-layout>
  <router-view v-else />
</template>
