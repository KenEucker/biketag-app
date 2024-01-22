<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Props {
  leftDrawerOpen: boolean
}

const emit = defineEmits(['update:leftDrawerOpen'])

const props = withDefaults(defineProps<Props>(), {
  leftDrawerOpen: false,
})

function toggleLeftDrawer() {
  emit('update:leftDrawerOpen', !props.leftDrawerOpen)
}

const { logout } = useAuth0()
const authStore = useAuthStore()

const logoutUser = async () => {
  await logout()
  await router.push('/login')
}
</script>
<template>
  <q-header elevated class="h-[60px] bg-white text-black">
    <q-toolbar class="h-full">
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title> The BikeTag Game </q-toolbar-title>
      <div class="inline-block cursor-pointer">
        <div class="flex items-center" v-if="authStore.getIsAuthenticated">
          <span
            class="pr-[15px] text-base font-medium capitalize"
            v-if="!$q.platform.is.mobile"
          >
            {{ authStore?.getLoginUser?.name }}
          </span>
          <q-img
            width="35px"
            class="rounded-full"
            :ratio="1 / 1"
            src="https://cdn.quasar.dev/img/boy-avatar.png"
          >
            <template v-slot:loading>
              <q-skeleton width="35px" height="35px" /> </template
          ></q-img>
        </div>
        <q-menu fit :offset="[0, 12]" class="!min-w-[175px]">
          <q-list>
            <!-- <q-item clickable v-close-popup class="cursor-not-allowed">
                  <q-item-section class="!justify-start flex flex-row items-center w-full gap-2">
                    <q-icon class="px-0 mx-0" color="primary-100" name="email" size="18px" />
                    Inbox
                  </q-item-section>
                </q-item> -->
            <q-item
              clickable
              v-close-popup
              :disable="!useAuthStore().isAuthenticated"
              @click="router.push('/profile')"
            >
              <q-item-section
                class="!justify-start flex flex-row items-center w-full gap-2"
              >
                <q-icon
                  class="px-0 mx-0"
                  color="primary-100"
                  name="perm_identity"
                  size="18px"
                />
                Profile
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="logoutUser">
              <q-item-section
                class="!justify-start flex flex-row items-center w-full gap-2"
              >
                <q-icon
                  class="px-0 mx-0"
                  color="primary-100"
                  name="logout"
                  size="18px"
                />
                Logout
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </q-toolbar>
  </q-header>
</template>
