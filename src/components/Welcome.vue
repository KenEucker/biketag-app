<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/store";
const counterStore = useCounterStore();
const { count } = storeToRefs(counterStore);
</script>

<template>
  <header>
    <img
      alt="vuetify logo"
      class="logo"
      src="@/assets/vuetify.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">
          <v-btn color="primary"> Home </v-btn>
        </RouterLink>
        <RouterLink to="/about">
          <v-btn color="primary"> About </v-btn>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
