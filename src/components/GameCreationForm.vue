<script setup lang="ts">
import { ref, defineEmits, computed } from 'vue'
import {
  IonIcon,
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonItem,
  IonInput,
  IonLabel,
  IonText,
} from '@ionic/vue'
import { 
  closeCircleOutline,   
  trashOutline,
  personAddOutline,
  addCircleOutline,
  checkmarkCircleOutline,
  bugOutline,
} from 'ionicons/icons'
import BikeTagClient from 'biketag'
import Map from './Map.vue'
import ImportForm from './ImportForm.vue'
import TagForm from './TagForm.vue'
import { useBikeTagApiStore } from '@/store/biketag'

const biketag = useBikeTagApiStore()
const game = ref(BikeTagClient.createGameObject());
(() => {
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
  lng: game.value.boundary?.long ?? 0,
})
const launchGameResults = ref(["", ""])
const progression = computed(() => {
  let progress = 0
  if (game.value.name) progress++;
  if (game.value.logo) progress++;
  if (game.value.region.slug) progress++;
  if (game.value.region.name) progress++;
  if (game.value.region.description) progress++;
  if (game.value.region.zipcode) progress++;
  if (game.value.boundary.alt) progress++;
  if (gps.value.lat != null) progress++;
  if (gps.value.lng != null) progress++;
  if (game.value.ambassadors.length) progress++;
  if (settings.value.length || skipSettings.value) progress++;
  if (firstTag.value.game) progress++;
  return Math.ceil(progress / 12 * 100)
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
  (game.value.boundary as any).gps = {
    lat: gps.value.lat,
    long: gps.value.lng,
    alt: (game.value.boundary as any).gps?.alt ?? 0,
  }
  try {
    const res : any = await biketag.launchGame(game.value as any, firstTag as any)
    launchGameResults.value = [res.success, res.success]
  } catch (e) {
    console.log(e)
    launchGameResults.value = [String(e), '']
  }
}
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button @click="emit('onClose')">
          <ion-icon :icon="closeCircleOutline" />
        </ion-button>
      </ion-buttons>
      <div class="uppercase tracking-wide text-xs font-bold text-gray-500 mb-1 ml-5 mt-2 md:mt-1 leading-tight">
        Step: {{ Math.min(current_step, steps) }} of {{ steps }}
      </div>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <ion-title v-if="current_step === 0" class="text-lg font-bold text-gray-700 leading-tight"> General Info </ion-title>
        <ion-title v-if="current_step === 1" class="text-lg font-bold text-gray-700 leading-tight"> Ambassadors </ion-title>
        <ion-title v-if="current_step === 2" class="text-lg font-bold text-gray-700 leading-tight"> Settings </ion-title>
        <ion-title v-if="current_step === 3" class="text-lg font-bold text-gray-700 leading-tight"> First Tag </ion-title>
        <ion-title v-if="current_step > 3" class="text-lg font-bold text-gray-700 leading-tight"> Launched! </ion-title>
        <div class="mb-4 md:mb-0"></div>

        <div class="absolute md:static bottom-0 flex items-center h-1 md:h-2 md:ml-2 w-screen md:w-64">
          <div class="w-full bg-white md:rounded-full md:mr-2">
            <div 
              class="md:rounded-full bg-green-500 leading-none h-2 text-center text-white" 
              :style="`width: ${progression}%`" />
          </div>
          <div class="hidden md:block text-xs w-10 text-gray-600">
            {{ progression }}%
          </div>
        </div>
      </div>
    </ion-toolbar>
  </ion-header>
  <ion-content class="modal-content cnt">
    <transition-group name="creation-form-steps" tag="div" class="h-full">

      <ion-list v-if="current_step === 0">
        <ion-list-header>
          <ion-label> Game General Information </ion-label>
        </ion-list-header>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Name </ion-label>
          <ion-input v-model="game.name" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Logo URL </ion-label>
          <ion-input v-model="game.logo" />
        </ion-item>

        <ion-list-header lines="full">
          <ion-label> Region </ion-label>
        </ion-list-header>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Slug </ion-label>
          <ion-input v-model="game.region.slug" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Name </ion-label>
          <ion-input v-model="game.region.name" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Description </ion-label>
          <ion-input v-model="game.region.description" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> ZipCode </ion-label>
          <ion-input type="number" v-model="game.region.zipcode" />
        </ion-item>

        <ion-list-header lines="full">
          <ion-label> Boundary </ion-label>
        </ion-list-header>
        <ion-row class="flex ml-4 md:ml-3 flex-wrap md:flex-nowrap flex-row justify-start md:justify-around items-center">
          <ion-item class="flex justify-center items-center">
            <ion-text> Latitude : {{ gps.lat }} </ion-text>
          </ion-item>
          <ion-item class="flex justify-center items-center">
            <ion-text>  Longitude : {{ gps.lng }} </ion-text>
          </ion-item>
          <ion-item class="flex justify-center items-center mb-1">
            <ion-label position="floating"> Altitude </ion-label>
            <ion-input v-model="game.boundary.alt" />
          </ion-item>
        </ion-row>
        <Map :gps="gps" :center="center" @dragend="updateMarker" />
      </ion-list>

      <ion-list v-else-if="current_step === 1">
        <ion-list-header lines="full">
          <ion-label> Ambassadors </ion-label>
        </ion-list-header>
        <ion-item
          class="ion-margin-start"
          v-for="(ambassador, index) in game.ambassadors"
          :key="`amb_${index}`"
        >
          <ion-input v-model="game.ambassadors[index]" />
          <ion-button fill="clear" @click="() => removeAmbassador(index)">
            <ion-icon :icon="trashOutline" />
          </ion-button>
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-row style="width: 100%">
            <ion-col size="8">
              <ion-label position="floating"> Add an ambassador </ion-label>
              <ion-input v-model="newAmbassador" />
            </ion-col>
            <ion-col class="center-end" size="4">
              <ion-button fill="clear" @click="addNewAmbassador">
                <ion-icon :icon="personAddOutline" />
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-item>
      </ion-list>

      <ion-list v-else-if="current_step === 2">
        <ion-list-header lines="full">
          <ion-label> Settings </ion-label>
        </ion-list-header>
        <template v-if="settings.length">
          <ion-item
            class="ion-margin-start"
            v-for="(key, index) in settings"
            :key="`${key}-${index}`"
          >
            <ion-row style="width: 100%">
              <ion-col size="8">
                <ion-label position="floating">
                  {{ capitalizeFirstLetter(key) }}
                </ion-label>
                <ion-input v-model="game.settings[key]" />
              </ion-col>
              <ion-col class="center-end" size="4">
                <ion-button fill="clear" @click="() => removeSetting(key)">
                  <ion-icon :icon="trashOutline" />
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-item>
        </template>
        <ion-list class="ion-margin-start">
          <ion-list-header lines="full">
            <ion-label> Add new setting </ion-label>
          </ion-list-header>
          <ion-item class="ion-margin-start">
            <ion-label position="floating"> Setting key </ion-label>
            <ion-input v-model="newSettingKey" />
          </ion-item>
          <ion-item class="ion-margin-start">
            <ion-label position="floating"> Setting value </ion-label>
            <ion-input v-model="newSettingValue" />
          </ion-item>
          <ion-item>
            <ion-button
              style="margin: auto 2rem"
              slot="end"
              fill="clear"
              @click="addNewSetting"
            >
              <ion-icon :icon="addCircleOutline" />
            </ion-button>
          </ion-item>
        </ion-list>
      </ion-list>

      <ion-list v-else-if="current_step === 3">
        <ion-list-header lines="full">
          <ion-label> First Mystery Tag </ion-label>
        </ion-list-header>
        <import-form class="m-auto mb-2" @dataImported="loadTag" text="Upload First Tag"/>
        <tag-form v-if="firstTag.game" :tag="firstTag" :commit="false"/>
      </ion-list>

      <div class="card flex justify-center items-center flex-col h-full" v-else-if="current_step === 4">
        <ion-icon class="icon--green" v-if="launchGameResults[0] && launchGameResults[1]" :icon="checkmarkCircleOutline"/>
        <ion-icon class="icon--red" v-else :icon="bugOutline"/>
        <h3 class="mt-6"> {{ launchGameResults[0] ? 'Success' : 'Error launching the game' }} </h3>
        <h5> {{ launchGameResults[1] ? 'The first tag has been created!' : 'Error creating the first tag' }} </h5>
      </div>
    </transition-group>

  </ion-content>
  <ion-item class="cnt--sticky-footer">
    <ion-button class="mb-4 md:mb-2" slot="end" v-if="current_step > 0 && current_step < steps + 1" @click="() => updateCurrentStep(-1)"> Back </ion-button>
    <ion-button class="mb-4 md:mb-2" slot="end" v-if="current_step < steps" @click="() => updateCurrentStep(1)"> Next </ion-button>
    <ion-button class="mb-4 md:mb-2" slot="end" type="submit" 
      v-else-if="progression == 100 && current_step == steps" 
      @click="() => {updateCurrentStep(1); launchGame()}"
      > 
      Launch 
    </ion-button>
  </ion-item>
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
  &--green, &--red {
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