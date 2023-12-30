<script setup lang="ts">
import { ref, computed } from 'vue'
import BikeTagClient from 'biketag'
import Map from './Map.vue'
import ImportForm from './ImportForm.vue'
import TagForm from './TagForm.vue'
import { useBikeTagStore } from '../store/biketag'

const biketag = useBikeTagStore()
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
  <header>
    <toolbar>
      <buttons slot="end">
        <u-button @click="emit('onClose')">
          closeCircleOutline
        </u-button>
      </buttons>
      <div class="uppercase tracking-wide text-xs font-bold text-gray-500 mb-1 ml-5 mt-2 md:mt-1 leading-tight">
        Step: {{ Math.min(current_step, steps) }} of {{ steps }}
      </div>
      <div class="flex flex-column md:flex-row md:items-center md:justify-between">
        <title v-if="current_step === 0" class="text-lg font-bold text-gray-700 leading-tight"> General Info </title>
        <title v-if="current_step === 1" class="text-lg font-bold text-gray-700 leading-tight"> Ambassadors </title>
        <title v-if="current_step === 2" class="text-lg font-bold text-gray-700 leading-tight"> Settings </title>
        <title v-if="current_step === 3" class="text-lg font-bold text-gray-700 leading-tight"> First Tag </title>
        <title v-if="current_step > 3" class="text-lg font-bold text-gray-700 leading-tight"> Launched! </title>
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
    </toolbar>
  </header>
  <content class="modal-content cnt">
    <transitgroup name="creatform-steps" tag="div" class="h-full">

      <list v-if="current_step === 0">
        <list-header>
          <label> Game General Information </label>
        </list-header>
        <item class="margin-start">
          <label position="floating"> Name </label>
          <input v-model="game.name" />
        </item>
        <item class="margin-start">
          <label position="floating"> Logo URL </label>
          <input v-model="game.logo" />
        </item>

        <list-header lines="full">
          <label> Region </label>
        </list-header>
        <item class="margin-start">
          <label position="floating"> Slug </label>
          <input v-model="game.region.slug" />
        </item>
        <item class="margin-start">
          <label position="floating"> Name </label>
          <input v-model="game.region.name" />
        </item>
        <item class="margin-start">
          <label position="floating"> Description </label>
          <input v-model="game.region.description" />
        </item>
        <item class="margin-start">
          <label position="floating"> ZipCode </label>
          <input type="number" v-model="game.region.zipcode" />
        </item>

        <list-header lines="full">
          <label> Boundary </label>
        </list-header>
        <u-row class="flex ml-4 md:ml-3 flex-wrap md:flex-nowrap flex-row justify-start md:justify-around items-center">
          <item class="flex justify-center items-center">
            <text> Latitude : {{ gps.lat }} </text>
          </item>
          <item class="flex justify-center items-center">
            <text>  Longitude : {{ gps.lng }} </text>
          </item>
          <item class="flex justify-center items-center mb-1">
            <label position="floating"> Altitude </label>
            <input v-model="game.boundary.alt" />
          </item>
        </u-row>
        <Map :gps="gps" :center="center" @dragend="updateMarker" />
      </list>

      <list v-else-if="current_step === 1">
        <list-header lines="full">
          <label> Ambassadors </label>
        </list-header>
        <item
          class="margin-start"
          v-for="(ambassador, index) in game.ambassadors"
          :key="`amb_${index}`"
        >
          <input v-model="game.ambassadors[index]" />
          <u-button fill="clear" @click="() => removeAmbassador(index)">
            trashOutline
          </u-button>
        </item>
        <item class="margin-start">
          <u-row style="width: 100%">
            <u-col size="8">
              <label position="floating"> Add an ambassador </label>
              <input v-model="newAmbassador" />
            </u-col>
            <u-col class="center-end" size="4">
              <u-button fill="clear" @click="addNewAmbassador">
                personAddOutline
              </u-button>
            </u-col>
          </u-row>
        </item>
      </list>

      <list v-else-if="current_step === 2">
        <list-header lines="full">
          <label> Settings </label>
        </list-header>
        <template v-if="settings.length">
          <item
            class="margin-start"
            v-for="(key, index) in settings"
            :key="`${key}-${index}`"
          >
            <u-row style="width: 100%">
              <u-col size="8">
                <label position="floating">
                  {{ capitalizeFirstLetter(key) }}
                </label>
                <input v-model="game.settings[key]" />
              </u-col>
              <u-col class="center-end" size="4">
                <u-button fill="clear" @click="() => removeSetting(key)">
                  trashOutline
                </u-button>
              </u-col>
            </u-row>
          </item>
        </template>
        <list class="margin-start">
          <list-header lines="full">
            <label> Add new setting </label>
          </list-header>
          <item class="margin-start">
            <label position="floating"> Setting key </label>
            <input v-model="newSettingKey" />
          </item>
          <item class="margin-start">
            <label position="floating"> Setting value </label>
            <input v-model="newSettingValue" />
          </item>
          <item>
            <u-button
              style="margin: auto 2rem"
              slot="end"
              fill="clear"
              @click="addNewSetting"
            >
              addCircleOutline
            </u-button>
          </item>
        </list>
      </list>

      <list v-else-if="current_step === 3">
        <list-header lines="full">
          <label> First Mystery Tag </label>
        </list-header>
        <import-form class="m-auto mb-2" @dataImported="loadTag" text="Upload First Tag"/>
        <tag-form v-if="firstTag.game" :tag="firstTag" :commit="false"/>
      </list>

      <div class="card flex justify-center items-center flex-column h-full" v-else-if="current_step === 4">
        checkmarkCircleOutline
        bugOutline
        <h3 class="mt-6"> {{ launchGameResults[0] ? 'Success' : 'Error launching the game' }} </h3>
        <h5> {{ launchGameResults[1] ? 'The first tag has been created!' : 'Error creating the first tag' }} </h5>
      </div>
    </transitgroup>

  </content>
  <item class="cnt--sticky-footer">
    <u-button class="mb-4 md:mb-2" slot="end" v-if="current_step > 0 && current_step < steps + 1" @click="() => updateCurrentStep(-1)"> Back </u-button>
    <u-button class="mb-4 md:mb-2" slot="end" v-if="current_step < steps" @click="() => updateCurrentStep(1)"> Next </u-button>
    <u-button class="mb-4 md:mb-2" slot="end" type="submit" 
      v-else-if="progression == 100 && current_step == steps" 
      @click="() => {updateCurrentStep(1); launchGame()}"
      > 
      Launch 
    </u-button>
  </item>
</template>

<style lang="scss">
$size: 48px;
$md: 768px;

.creatform-steps {
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