<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, inject, onBeforeMount } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useBikeTagStore } from '@/store'
import Imgur from '@/assets/images/Imgur.svg'

const auth = useAuth0()
const toast: any = inject('toast')
const biketag = useBikeTagStore()
const profile = ref(biketag.getProfile)
const socialNetworkIcons = ref([
  ['reddit', 'mdi-reddit'],
  ['instagram', 'mdi-instagram'],
  ['twitter', 'mdi-twitter'],
  ['imgur', Imgur],
  ['discord', 'mdi-discord']
])

onBeforeMount(async () => {
  if (!Object.keys(profile.value).length) {
    const token = await auth.getAccessTokenSilently()
    try {
      await biketag.setProfile(token)
    } catch (e) {
      console.log(e)
    }
    profile.value = biketag.getProfile
  }
})

const updateProfile = async () => {
  const token = await auth.getAccessTokenSilently()
  if (token) {
    try {
      await biketag.updateProfile(profile.value, token)
      toast.open({
        message: 'Success',
        type: 'success',
        position: 'top'
      })
    } catch (e: any) {
      toast.open({
        message: e.response?.data ?? e.message,
        type: 'error',
        position: 'top'
      })
    }
  }
}

const firstToUperCase = (str: string) =>
  str[0].charAt(0).toUpperCase() + str.slice(1)
const splitCamelCase = (str: string) =>
  firstToUperCase(str).replace(/([a-z])([A-Z])/g, '$1 $2')
// const toggleShowFields = (name: string) => refs[name][0].classList.toggle('hide')
</script>

<template>
  <div
    class="flex max-w-xl m-auto justify-center items-center md:justify-start"
  >
    <img class="rounded-full" :src="profile?.picture" :alt="profile?.name" />
    <p class="mx-8">{{ profile?.name }}</p>
  </div>

  <div
    v-if="profile?.user_metadata"
    class="flex jusftify-center items-center flex-row"
  >
    <form
      class="w-full max-w-xl mt-5 mb-2 m-auto"
      name="profile-update"
      action="profile-update"
      method="POST"
      @submit.prevent="updateProfile"
    >
      <v-list>
        <v-list-item>
          <v-label position="floating"> User Name </v-label>
          <v-input v-model="profile.user_metadata.name" readonly />
        </v-list-item>
        <v-list-item>
          <v-label position="floating"> User Email </v-label>
          <v-input v-model="profile.email" readonly />
        </v-list-item>
        <v-list-item>
          <v-label position="floating"> Passcode </v-label>
          <v-input
            v-model="profile.user_metadata.passcode"
            minlength="3"
            maxlength="30"
          />
        </v-list-item>
      </v-list>

      <v-list>
        <v-list-item
          v-for="(social, i) in socialNetworkIcons"
          :key="`${i}_inputs`"
        >
          <v-row class="w-full">
            <v-col size="10">
              <v-label position="floating">
                {{ splitCamelCase(social[0]) }}
              </v-label>
              <v-input
                :id="social[0]"
                v-model="profile.user_metadata.social[social[0]]"
                :label="splitCamelCase(social[0])"
                :placeholder="
                  (profile?.user_metadata?.length > i &&
                    profile?.user_metadata[i]) ||
                  `${
                    social[0].charAt(0).toUpperCase() + social[0].slice(1)
                  } player name`
                "
              />
            </v-col>
            <v-col class="flex justify-center items-center" size="2">
              <v-icon :icon="social[1]" />
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>

      <v-list inset="true">
        <v-list-header>Ambassador Configuration</v-list-header>
        <v-accordion-group>
          <v-accordion
            v-for="(credential, i) in Object.keys(
              profile.user_metadata.credentials
            )"
            :key="`${i}_config`"
            :value="i"
          >
            <v-list-item>
              <v-label> {{ firstToUperCase(credential) }} </v-label>
            </v-list-item>
            <v-list class="px-10">
              <v-list-item
                v-for="(inputField, j) in Object.keys(
                  profile.user_metadata.credentials[credential]
                )"
                :key="`${j}_config_ipnuts`"
              >
                <v-label position="floating">
                  {{ splitCamelCase(inputField) }}
                </v-label>
                <v-input
                  v-model="
                    profile.user_metadata.credentials[credential][inputField]
                  "
                  type="password"
                />
              </v-list-item>
            </v-list>
          </v-accordion>
        </v-accordion-group>
      </v-list>
      <div class="flex justify-center sm:justify-end">
        <v-btn type="submit" variant="outlined"> Update </v-btn>
      </div>
    </form>
  </div>
</template>
