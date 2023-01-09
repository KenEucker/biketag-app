<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, defineEmits, computed } from 'vue'
import BikeTagClient from 'biketag'
import Map from './Map.vue'
import ImportForm from './ImportForm.vue'
import TagForm from './TagForm.vue'
import { useBikeTagApiStore } from '@/store/biketag'

const biketag = useBikeTagApiStore()
const game = ref(BikeTagClient.createGameObject())
;(() => {
  const sett = {} //: settingsArray = {}
  Object.assign(sett, game.value.settings)
  game.value.settings = sett
})()
const firstTag = ref(BikeTagClient.createTagObject())
const current_step = ref(0)
const steps = ref(3)
const settings = computed(() => Object.keys(game.value.settings))
const skipSettings = ref(false)
const gps = ref({
  lat: game.value.boundary?.lat ?? 0,
  lng: game.value.boundary?.long ?? 0
})
const launchGameResults = ref(['', ''])
const progression = computed(() => {
  let progress = 0
  if (game.value.name) progress++
  if (game.value.logo) progress++
  if (game.value.region.slug) progress++
  if (game.value.region.name) progress++
  if (game.value.region.description) progress++
  if (game.value.region.zipcode) progress++
  if (game.value.boundary.alt) progress++
  if (gps.value.lat != null) progress++
  if (gps.value.lng != null) progress++
  if (game.value.ambassadors.length) progress++
  if (settings.value.length || skipSettings.value) progress++
  if (firstTag.value.game) progress++
  return Math.ceil((progress / 12) * 100)
})
const center = ref({ ...gps.value })
const emit = defineEmits(['onClose'])
const updateMarker = (e: any) => {
  gps.value = { ...e }
}
const newAmbassador = ref('')
const addNewAmbassador = () => {
  if (newAmbassador.value) {
    game.value.ambassadors.push(newAmbassador.value)
    newAmbassador.value = ''
  }
}
const removeAmbassador = (index: number) => {
  game.value.ambassadors.splice(index, 1)
}
const newSettingKey = ref('')
const newSettingValue = ref('')
const addNewSetting = () => {
  if (newSettingKey.value) {
    game.value.settings[newSettingKey.value] = newSettingValue.value
  }
  newSettingKey.value = ''
  newSettingValue.value = ''
}
const removeSetting = (name: string) => {
  delete game.value.settings[name]
}
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)
const updateCurrentStep = (by: number) => {
  current_step.value += by
  if (!skipSettings.value && current_step.value > 2) {
    skipSettings.value = true
  }
}
const loadTag = (data: any) => {
  if (data.length) {
    firstTag.value = data[0]
  }
}
const launchGame = async () => {
  const _gps = {
    lat: gps.value.lat,
    long: gps.value.lng,
    alt: (game.value.boundary as any).gps?.alt ?? 0
  }
  ;(game.value.boundary as any).gps = _gps
  try {
    const res: any = await biketag.launchGame(
      game.value as any,
      firstTag as any
    )
    launchGameResults.value = [res.success, res.success]
  } catch (e) {
    console.log(e)
    launchGameResults.value = [String(e), '']
  }
}
</script>

<template>
  <v-header>
    <v-toolbar>
      <v-buttons>
        <v-btn @click="emit('onClose')">
          <v-icon icon="mdi-close-circle-outline" />
        </v-btn>
      </v-buttons>
      <div
        class="uppercase tracking-wide text-xs font-bold text-gray-500 mb-1 ml-5 mt-2 md:mt-1 leading-tight"
      >
        Step: {{ Math.min(current_step, steps) }} of {{ steps }}
      </div>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <v-title
          v-if="current_step === 0"
          class="text-lg font-bold text-gray-700 leading-tight"
        >
          General Info
        </v-title>
        <v-title
          v-if="current_step === 1"
          class="text-lg font-bold text-gray-700 leading-tight"
        >
          Ambassadors
        </v-title>
        <v-title
          v-if="current_step === 2"
          class="text-lg font-bold text-gray-700 leading-tight"
        >
          Settings
        </v-title>
        <v-title
          v-if="current_step === 3"
          class="text-lg font-bold text-gray-700 leading-tight"
        >
          First Tag
        </v-title>
        <v-title
          v-if="current_step > 3"
          class="text-lg font-bold text-gray-700 leading-tight"
        >
          Launched!
        </v-title>
        <div class="mb-4 md:mb-0"></div>

        <div
          class="absolute md:static bottom-0 flex items-center h-1 md:h-2 md:ml-2 w-screen md:w-64"
        >
          <div class="w-full bg-white md:rounded-full md:mr-2">
            <div
              class="md:rounded-full bg-green-500 leading-none h-2 text-center text-white"
              :style="`width: ${progression}%`"
            />
          </div>
          <div class="hidden md:block text-xs w-10 text-gray-600">
            {{ progression }}%
          </div>
        </div>
      </div>
    </v-toolbar>
  </v-header>
  <v-content class="modal-content cnt">
    <transition-group name="creation-form-steps" tag="div" class="h-full">
      <v-list v-if="current_step === 0">
        <v-list-header>
          <v-label> Game General Information </v-label>
        </v-list-header>
        <v-item>
          <v-label position="floating"> Name </v-label>
          <v-input v-model="game.name" />
        </v-item>
        <v-item>
          <v-label position="floating"> Logo URL </v-label>
          <v-input v-model="game.logo" />
        </v-item>

        <v-list-header lines="full">
          <v-label> Region </v-label>
        </v-list-header>
        <v-item>
          <v-label position="floating"> Slug </v-label>
          <v-input v-model="game.region.slug" />
        </v-item>
        <v-item>
          <v-label position="floating"> Name </v-label>
          <v-input v-model="game.region.name" />
        </v-item>
        <v-item>
          <v-label position="floating"> Description </v-label>
          <v-input v-model="game.region.description" />
        </v-item>
        <v-item>
          <v-label position="floating"> ZipCode </v-label>
          <v-input v-model="game.region.zipcode" type="number" />
        </v-item>

        <v-list-header lines="full">
          <v-label> Boundary </v-label>
        </v-list-header>
        <v-row
          class="flex ml-4 md:ml-3 flex-wrap md:flex-nowrap flex-row justify-start md:justify-around items-center"
        >
          <v-item class="flex justify-center items-center">
            <v-text> Latitude : {{ gps.lat }} </v-text>
          </v-item>
          <v-item class="flex justify-center items-center">
            <v-text> Longitude : {{ gps.lng }} </v-text>
          </v-item>
          <v-item class="flex justify-center items-center mb-1">
            <v-label position="floating"> Altitude </v-label>
            <v-input v-model="game.boundary.alt" />
          </v-item>
        </v-row>
        <Map :gps="gps" :center="center" @dragend="updateMarker" />
      </v-list>

      <v-list v-else-if="current_step === 1">
        <v-list-header lines="full">
          <v-label> Ambassadors </v-label>
        </v-list-header>
        <v-item
          v-for="(ambassador, index) in game.ambassadors"
          :key="`amb_${index}`"
        >
          <v-input v-model="game.ambassadors[index]" />
          <v-btn fill="clear" @click="() => removeAmbassador(index)">
            <v-icon icon="mdi-trash-can-outline" />
          </v-btn>
        </v-item>
        <v-item>
          <v-row style="width: 100%">
            <v-col size="8">
              <v-label position="floating"> Add an ambassador </v-label>
              <v-input v-model="newAmbassador" />
            </v-col>
            <v-col class="center-end" size="4">
              <v-btn fill="clear" @click="addNewAmbassador">
                <v-icon icon="mdi-account-plus-outline" />
              </v-btn>
            </v-col>
          </v-row>
        </v-item>
      </v-list>

      <v-list v-else-if="current_step === 2">
        <v-list-header lines="full">
          <v-label> Settings </v-label>
        </v-list-header>
        <template v-if="settings.length">
          <v-item v-for="(key, index) in settings" :key="`${key}-${index}`">
            <v-row style="width: 100%">
              <v-col size="8">
                <v-label position="floating">
                  {{ capitalizeFirstLetter(key) }}
                </v-label>
                <v-input v-model="game.settings[key]" />
              </v-col>
              <v-col class="center-end" size="4">
                <v-btn fill="clear" @click="() => removeSetting(key)">
                  <v-icon icon="mdi-trash-can-outline" />
                </v-btn>
              </v-col>
            </v-row>
          </v-item>
        </template>
        <v-list>
          <v-list-header lines="full">
            <v-label> Add new setting </v-label>
          </v-list-header>
          <v-item>
            <v-label position="floating"> Setting key </v-label>
            <v-input v-model="newSettingKey" />
          </v-item>
          <v-item>
            <v-label position="floating"> Setting value </v-label>
            <v-input v-model="newSettingValue" />
          </v-item>
          <v-item>
            <v-btn
              style="margin: auto 2rem"
              fill="clear"
              @click="addNewSetting"
            >
              <v-icon icon="mdi-plus-circle-outline" />
            </v-btn>
          </v-item>
        </v-list>
      </v-list>

      <v-list v-else-if="current_step === 3">
        <v-list-header lines="full">
          <v-label> First Mystery Tag </v-label>
        </v-list-header>
        <import-form
          class="m-auto mb-2"
          text="Upload First Tag"
          @data-imported="loadTag"
        />
        <tag-form v-if="firstTag.game" :tag="firstTag" :commit="false" />
      </v-list>

      <div
        v-else-if="current_step === 4"
        class="card flex justify-center items-center flex-col h-full"
      >
        <v-icon
          v-if="launchGameResults[0] && launchGameResults[1]"
          class="icon--green"
          icon="mdi-checkbox-marked-circle-outline"
        />
        <v-icon v-else class="icon--red" icon="mdi-bug-outline" />
        <h3 class="mt-6">
          {{ launchGameResults[0] ? 'Success' : 'Error launching the game' }}
        </h3>
        <h5>
          {{
            launchGameResults[1]
              ? 'The first tag has been created!'
              : 'Error creating the first tag'
          }}
        </h5>
      </div>
    </transition-group>
  </v-content>
  <v-item class="cnt--sticky-footer">
    <v-btn
      v-if="current_step > 0 && current_step < steps + 1"
      class="mb-4 md:mb-2"
      @click="() => updateCurrentStep(-1)"
    >
      Back
    </v-btn>
    <v-btn
      v-if="current_step < steps"
      class="mb-4 md:mb-2"
      @click="() => updateCurrentStep(1)"
    >
      Next
    </v-btn>
    <v-btn
      v-else-if="progression == 100 && current_step == steps"
      class="mb-4 md:mb-2"
      type="submit"
      @click="
        () => {
          updateCurrentStep(1)
          launchGame()
        }
      "
    >
      Launch
    </v-btn>
  </v-item>
</template>

<style lang="scss">
$size: 48px;
$md: 768px;

.creation-form-steps {
  &-enter-active,
  &-leave-active {
    transition: all 0.5s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}

.cnt {
  margin-bottom: -$size !important;
  height: calc(var(--width) - 56px - $size) !important;

  &--sticky-footer {
    height: $size;
  }
}

.icon {
  &--green,
  &--red {
    font-size: 78px;
  }

  &--green {
    color: green;
  }

  &--red {
    color: red;
  }
}
</style>
