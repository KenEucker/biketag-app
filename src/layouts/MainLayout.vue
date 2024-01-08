<script setup lang="ts">
import { ref } from 'vue';
import NavBar from 'src/components/NavBar.vue';
import DrawerList from 'src/components/DrawerList.vue';

const leftDrawerOpen = ref(false);
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <nav-bar v-model:leftDrawerOpen="leftDrawerOpen"></nav-bar>
    <drawer-list v-model:left-drawer-open="leftDrawerOpen"></drawer-list>

    <q-page-container>
      <router-view class="md:m-[20px] lg:m-[20px]" />
    </q-page-container>
  </q-layout>
</template>
