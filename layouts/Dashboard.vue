<script setup lang="ts">
import Header from '../components/DashboardHeader.vue'
import Footer from '../components/DashboardFooter.vue'

const sidebarToggle = ref(true)
const sidebarMinimized = ref(false)
const selected = ref('')
const page=ref('')

const links = [{
  label: 'My Game',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  badge: 2
}, {
  label: 'Dashboard',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'All Games',
  icon: 'i-heroicons-chart-bar',
  to: '/games'
}, {
  label: 'Settings',
  icon: 'i-heroicons-command-line',
  to: '/settings'
}]
</script>

<template>
  <u-container class="flex h-screen bg-gray-200 font-roboto">
    <u-slideover v-model="sidebarToggle" side="left">
      <!-- SIDEBAR HEADER -->
      <div class="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <a href="/">
          <img src="~/assets/images/biketag-logo.svg" alt="Logo" class="bg-white p-1 m-2 rounded-lg" />
        </a>

        <button class="block lg:hidden" @click.stop="sidebarToggle = !sidebarToggle">
          <svg class="fill-current" width="20" height="18" viewBox="0 0 20 18" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill="" />
          </svg>
        </button>
      </div>
      <!-- SIDEBAR HEADER -->


      <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <u-vertical-navigation class="flex-start mt-5 py-4 px-4 lg:mt-9 lg:px-6"  :links="links" />

        <!-- Promo Box -->
        <div
          class="mb-10 w-3/4 max-w-60 rounded-sm border border-strokedark bg-boxdark py-6 px-4 text-center shadow-default absolute bottom-0 left-5">
          <h3 class="mb-1 font-semibold text-white">BikeTag is Free and Open Source Software</h3>
          <p class="mb-4 text-xs">Support the future of this project.</p>
          <a href="https://patreon.com/biketag" target="_blank" rel="nofollow"
            class="flex items-center justify-center rounded-md bg-primary p-2 text-white hover:bg-opacity-95">
            Donate Now
          </a>
        </div>
        <!-- Promo Box -->
      </div>
    </u-slideover>
    <div class="flex flex-col flex-1 overflow-hidden">
      <Header />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="container mx-auto px-6 py-8">
          <slot />
        </div>
      </main>
      <Footer />
    </div>
  </u-container>
</template>
