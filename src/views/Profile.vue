<script setup lang="ts">
import { ref, inject, onBeforeMount } from 'vue'
import { logoReddit, logoInstagram, logoTwitter, logoDiscord } from 'ionicons/icons'
import {
  IonIcon,
  IonButton,
  IonInput,
  IonLabel,
  IonList,
  IonAccordion,
  IonAccordionGroup,
  IonListHeader,
  IonItem,
  IonRow,
  IonCol
} from '@ionic/vue'
import { useBikeTagApiStore } from "@/store/biketag";
import Imgur from '@/assets/images/Imgur.svg'

const auth: any = inject('auth')
const toast: any = inject('toast')
const biketag = useBikeTagApiStore()
const profile = ref(biketag.getProfile)
const socialNetworkIcons = ref([
  ['reddit', logoReddit],
  ['instagram', logoInstagram],
  ['twitter', logoTwitter],
  ['imgur', Imgur],
  ['discord', logoDiscord],
])

onBeforeMount(async () => {
  if (!Object.keys(profile.value).length) {
    const claims = await auth.getIdTokenClaims()
    try {
      await biketag.setProfile(claims.__raw)
    } catch (e) {
      console.log(e)
    }
    profile.value = biketag.getProfile
  }
})

const updateProfile = async () => {
  const claims = await auth.getIdTokenClaims()
  if (claims) {
    const token = claims.__raw
    try {
      await biketag.updateProfile(profile.value, token)
      toast.open({
        message: 'Success',
        type: 'success',
        position: 'top',
      })
    } catch (e : any) {
      toast.open({
        message: e.response?.data ?? e.message,
        type: 'error',
        position: 'top',
      })
    }
  }
}

const firstToUperCase = (str: string) => str[0].charAt(0).toUpperCase() + str.slice(1)
const splitCamelCase = (str: string) => firstToUperCase(str).replace(/([a-z])([A-Z])/g, '$1 $2')
// const toggleShowFields = (name: string) => refs[name][0].classList.toggle('hide')
</script>

<template>
  <div class="flex max-w-xl m-auto justify-center items-center md:justify-start">
    <img class="rounded-full" :src="profile?.picture" :alt="profile?.name" />
    <p class="mx-8"> {{ profile?.name }} </p>
  </div>

  <div v-if="profile?.user_metadata" class="flex jusftify-center items-center flex-row">
    <form
      class="w-full max-w-xl mt-5 mb-2 m-auto"
      name="profile-update"
      action="profile-update"
      method="POST"
      @submit.prevent="updateProfile"
    >
      <ion-list>
        <ion-item>
          <ion-label position="floating"> User Name </ion-label>
          <ion-input 
            v-model="profile.user_metadata.name"
            readonly
          />
        </ion-item>
        <ion-item>
          <ion-label position="floating"> User Email </ion-label>
          <ion-input v-model="profile.email" readonly />
        </ion-item>
        <ion-item>
          <ion-label position="floating"> Passcode </ion-label>
          <ion-input
            v-model="profile.user_metadata.passcode"
            minlength="3"
            maxlength="30"
          />
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-item v-for="(social, i) in socialNetworkIcons" :key="`${i}_inputs`">
          <ion-row class="w-full">
            <ion-col size="10">
              <ion-label position="floating"> {{ splitCamelCase(social[0]) }} </ion-label>
              <ion-input
                :id="social[0]"
                v-model="profile.user_metadata.social[social[0]]"
                :label="splitCamelCase(social[0])"
                :placeholder="
                  (profile?.user_metadata?.length > i && profile?.user_metadata[i]) ||
                  `${social[0].charAt(0).toUpperCase() + social[0].slice(1)} player name`
                "
              />
            </ion-col>
            <ion-col class="flex justify-center items-center" size="2">
              <ion-icon :icon="social[1]" />
            </ion-col>
          </ion-row>
        </ion-item>
      </ion-list>

      <ion-list inset="true">
        <ion-list-header>Ambassador Configuration</ion-list-header>
        <ion-accordion-group>
          <ion-accordion
            v-for="(credential, i) in Object.keys(profile.user_metadata.credentials)"
            :key="`${i}_config`" :value="i"
          >
            <ion-item slot="header">
              <ion-label> {{ firstToUperCase(credential) }} </ion-label>
            </ion-item>
            <ion-list slot="content" class="px-10">
              <ion-item  v-for="(inputField, j) in Object.keys(
                    profile.user_metadata.credentials[credential]
                  )" :key="`${j}_config_ipnuts`">
                <ion-label position="floating"> {{ splitCamelCase(inputField) }} </ion-label>
                <ion-input
                  v-model="profile.user_metadata.credentials[credential][inputField]"
                  type="password"
                />
              </ion-item>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
      </ion-list>
      <div class="flex justify-center sm:justify-end">
        <ion-button type="submit" slot="end" variant="medium"> Update </ion-button>
      </div>
    </form>
  </div>
</template>