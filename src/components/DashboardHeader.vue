<script setup lang="ts">
import { ref, inject } from 'vue'
import { useSidebar } from '../hooks/useSidebar'
import { IonHeader, IonIcon, IonSearchbar } from '@ionic/vue'
import {
  notificationsOutline,
  personOutline,
  cogOutline,
  logOutOutline,
} from 'ionicons/icons'

const dropdownOpen = ref(false)
const { isOpen } = useSidebar()
const notificationOpen = ref(false)
const auth: any = inject('auth')
const logout = () => {
  auth.logout({
    returnTo: window.location.origin,
  })
}
</script>

<template>
  <ion-header
    class="flex items-center justify-between px-6 py-2 bg-white border-b-4 border-indigo-600"
  >
    <div class="flex items-center">
      <button
        class="text-gray-500 focus:outline-none lg:hidden"
        @click="isOpen = true"
      >
        <svg
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20M4 12H20M4 18H11"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div v-if="$route.meta.showSearchBar" class="relative mx-4 lg:mx-0">
        <ion-searchbar id="search-bar"></ion-searchbar>
      </div>
    </div>

    <div class="flex items-center">
      <div class="flex items-center">
        <div class="relative">
          <button
            class="flex mx-4 text-gray-600 focus:outline-none"
            @click="notificationOpen = !notificationOpen"
          >
            <ion-icon :icon="notificationsOutline"></ion-icon>
          </button>

          <div
            v-show="notificationOpen"
            class="fixed inset-0 z-10 w-full h-full"
            @click="notificationOpen = false"
          ></div>

          <div
            v-show="notificationOpen"
            class="absolute right-0 z-10 mt-2 overflow-hidden bg-white rounded-lg shadow-xl w-80"
            style="width: 20rem"
          >
            <!-- <a
              href="#"
              class="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600"
            >
              <img
                class="object-cover w-8 h-8 mx-1 rounded-full"
                src="https://images.unsplash.com/photo-1552774021-9ebbb764f03e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
                alt="avatar"
              />
              <p class="mx-2 text-sm">
                <span class="font-bold" href="#">Evan Josh</span> replied on the
                <span class="font-bold text-indigo-400" href="#">Upload Image</span>
                artical . 2m
              </p>
            </a> -->
          </div>
        </div>
      </div>
      <div class="relative">
        <button
          class="relative z-10 block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none"
          @click="dropdownOpen = !dropdownOpen"
        >
          <img
            class="object-cover w-full h-full"
            :src="auth?.user?.picture"
            alt="Your avatar"
          />
        </button>

        <div
          v-show="dropdownOpen"
          class="fixed inset-0 z-10 w-full h-full"
          @click="dropdownOpen = false"
        ></div>

        <transition
          enter-active-class="transition duration-150 ease-out transform"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in transform"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-show="dropdownOpen"
            class="absolute right-0 z-20 w-48 py-1 mt-2 bg-white rounded-lg shadow-xl"
          >
            <a
              href="#"
              class="flex px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-indigo-600 hover:text-white"
            >
              <ion-icon class="tiny-icon" :icon="personOutline"></ion-icon>
              Profile</a
            >
            <a
              href="#"
              class="flex px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-indigo-600 hover:text-white"
            >
              <ion-icon class="tiny-icon" :icon="cogOutline"></ion-icon>
              Settings</a
            >
            <a
              href="#"
              @click.prevent="logout"
              class="flex px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-indigo-600 hover:text-white"
            >
              <ion-icon class="tiny-icon" :icon="logOutOutline"></ion-icon>
              Log out
            </a>
          </div>
        </transition>
      </div>
    </div>
  </ion-header>
</template>
