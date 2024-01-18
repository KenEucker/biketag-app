<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useBikeTagStore } from 'biketag-vue'
import { Auth0VueClient, IdToken, useAuth0 } from '@auth0/auth0-vue'
import { Notify } from 'quasar'

const biketag = useBikeTagStore()
const profile = ref(biketag.getProfile)
const loader = ref<boolean>(false)
const getDataLoader = ref<boolean>(false)
const isPwd = ref<boolean[]>([])
const socialNetworkIcons = ref([
  ['reddit', 'reddit'],
  ['instagram', 'fa-brands fa-instagram'],
  ['twitter', 'fa-brands fa-twitter'],
  ['imgur', 'src/assets/Imgur.svg'],
  ['discord', 'fa-brands fa-discord'],
])

const auth = ref<Auth0VueClient>()

onBeforeMount(async () => {
  auth.value = useAuth0()
  if (!Object.keys(profile.value).length) {
    getDataLoader.value = true
    const claims: IdToken | undefined = auth.value
      ?.idTokenClaims as unknown as IdToken
    try {
      await biketag.setProfile(auth.value?.user, claims.__raw)
    } catch (e) {
      console.log(e)
    } finally {
      getDataLoader.value = false
    }
    profile.value = biketag.getProfile
  }
})

const updateProfile = async () => {
  const claims: IdToken | undefined = auth.value
    ?.idTokenClaims as unknown as IdToken
  if (claims) {
    loader.value = true
    // const token = claims.__raw
    try {
      await biketag.updateProfile(profile.value)
      Notify.create({
        icon: 'check_circle',
        color: 'green',
        message: 'Profile updated successfully',
        type: 'success',
        timeout: Math.random() * 5000 + 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
    } catch (e) {
      Notify.create({
        message: 'Something went wrong',
        type: 'negative',
        timeout: Math.random() * 5000 + 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
    } finally {
      loader.value = false
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
  <q-card
    flat
    bordered
    class="md:border-[1px] border-0 md:rounded-lg rounded-none"
  >
    <q-inner-loading
      :showing="getDataLoader"
      class="z-10 text-lg !bg-opacity-65"
    />
    <div
      class="bg-gray-200 md:rounded-t-lg rounded-t-none p-4 w-full md:h-[75px] h-[62px]"
    >
      <div class="flex m-auto justify-center items-center relative">
        <div class="absolute items-center bottom-0 top-5">
          <q-avatar class="md:text-[70px] text-[50px] bg-white shadow-4">
            <img
              class="rounded-full p-1"
              :src="profile?.picture"
              :alt="profile?.name"
            />
          </q-avatar>
          <p class="text-center md:text-xl text-lg font-semibold mt-2">
            {{ profile?.name }}
          </p>
        </div>
      </div>
    </div>
    <div class="p-3">
      <p class="p-0 text-base font-medium py-2 md:mt-16 mt-14">User Info</p>
      <q-separator class="mb-3" />
      <div class="grid md:grid-cols-2 grid-cols-1 gap-x-4">
        <div>
          <div class="mb-3" v-if="profile.user_metadata">
            <label for="">User Name</label>
            <q-input
              outlined
              dense
              v-model.trim="profile.user_metadata.name"
              placeholder="User Name"
              readonly
            />
          </div>
        </div>
        <div>
          <div class="mb-3">
            <label for="">User Email</label>
            <q-input
              outlined
              dense
              v-model.trim="profile.email"
              readonly
              placeholder="User Email"
            />
          </div>
          <div class="mb-3" v-if="profile.user_metadata">
            <label for="">Passcode</label>
            <q-input
              outlined
              dense
              v-model.trim="profile.user_metadata.passcode"
              placeholder="Passcode"
            />
          </div>
        </div>
      </div>
      <div v-if="profile.user_metadata">
        <p class="p-0 text-base font-medium py-2">Social Links</p>
        <q-separator class="mb-3" />
        <div class="grid md:grid-cols-2 grid-cols-1 gap-x-4">
          <template
            v-for="(social, i) in socialNetworkIcons"
            :key="`${i}_inputs`"
          >
            <div>
              <q-item dense class="w-full mb-3 p-0" flat>
                <q-item-section>
                  <div>
                    <label for="">{{ splitCamelCase(social[0]) }}</label>
                    <q-input
                      :id="social[0]"
                      v-model="(profile.user_metadata.social as Record<string, string>)[social[0]]"
                      outlined
                      :placeholder="`${
                        social[0].charAt(0).toUpperCase() + social[0].slice(1)
                      } player name`"
                      dense
                      class="mb-3"
                      flat
                    >
                      <template #append>
                        <q-icon
                          :name="social[1]"
                          v-if="social[0] !== 'imgur'"
                        />
                        <q-icon class="text-dark" size="lg" v-else>
                          <img :src="social[1]" />
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </q-item-section>
              </q-item>
            </div>
          </template>
        </div>
      </div>
      <div v-if="profile.user_metadata && profile.user_metadata.credentials">
        <p class="p-0 text-base font-medium py-2">Ambassador Configuration</p>
        <q-separator class="mb-2" />
        <div class="grid grid-cols-1 gap-x-4">
          <q-expansion-item
            header-class="bg-slate-200 mb-2 rounded-lg"
            expand-separator
            v-for="(credential, i) in Object.keys(
              profile.user_metadata.credentials
            )"
            :key="`${i}_config`"
            :label="firstToUperCase(credential)"
          >
            <q-card>
              <q-card-section>
                <template
                  v-for="(inputField, j) in Object.keys(
                  (profile.user_metadata.credentials as unknown as Record<string, string>)[credential as string]
                )"
                  :key="`${j}_config_ipnuts`"
                >
                  <div>
                    <q-item dense class="w-full mb-3 p-0" flat>
                      <q-item-section>
                        <div>
                          <label for="">{{ splitCamelCase(inputField) }}</label>
                          <q-input
                            :id="j"
                            v-model="((profile.user_metadata.credentials as unknown as Record<string, string>)[credential] as unknown as Record<string, string>)[inputField]"
                            outlined
                            :type="isPwd[j] ? 'password' : 'text'"
                            dense
                            class="mb-3"
                            flat
                            @vue:mounted="isPwd[j] = true"
                          >
                            <template v-slot:append>
                              <q-icon
                                :name="
                                  isPwd[j] ? 'visibility_off' : 'visibility'
                                "
                                class="cursor-pointer"
                                @click="isPwd[j] = !isPwd[j]"
                              />
                            </template>
                          </q-input>
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                </template>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-x-4">
        <div class="text-center mt-2">
          <q-btn
            @click="updateProfile"
            unelevated
            :loading="loader"
            :disable="loader"
            no-caps
            color="primary"
            label="Update"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>
