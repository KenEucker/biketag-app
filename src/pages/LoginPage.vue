<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import BikeTagLogo from 'src/components/logo/BikeTagLogo.vue';

const { loginWithRedirect } = useAuth0();
const router = useRouter();
const authStore = useAuthStore();

const loginUser = computed(() => {
  return authStore.getLoginUser;
});

const isAuthenticated = computed(() => {
  return authStore.getIsAuthenticated;
});

onMounted(async () => {
  if (isAuthenticated.value) {
    await router.push('/games');
  }
});
async function login() {
  if (isAuthenticated.value) {
    await router.push('/games');
  } else {
    loginWithRedirect();
  }
}
function asGuest() {
  router.push('/games');
}
</script>
<template>
  <div>
    <div
      class="flex items-center justify-center h-screen px-6 bg-gray-200"
      v-if="!isAuthenticated"
    >
      <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
        <div class="flex items-center justify-center">
          <bike-tag-logo class="mr-2" />
          <span class="text-2xl font-semibold text-gray-700">BikeTag</span>
        </div>
        <p
          v-if="isAuthenticated"
          class="mt-6 text-sm font-semibold text-center capitalize"
        >
          Welcome {{ isAuthenticated ? loginUser.name : '' }}
        </p>
        <q-btn
          v-else
          @click="asGuest"
          class="w-full px-4 py-2 mt-6 text-sm text-center text-white bg-primary rounded-md focus:outline-none hover:bg-indigo-500 capitalize"
        >
          Continue as Guest
        </q-btn>
        <q-btn
          @click="login"
          class="w-full px-4 py-2 mt-6 text-sm text-center text-white bg-primary rounded-md focus:outline-none hover:bg-indigo-500 capitalize"
        >
          {{ isAuthenticated ? 'Continue' : 'Sign in' }}
        </q-btn>
      </div>
    </div>
  </div>
</template>
