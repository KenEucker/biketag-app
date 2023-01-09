<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, inject } from 'vue'
// import { Game, settingsArray } from 'biketag/lib/common/schema';
import { useBikeTagApiStore } from '@/store/biketag'
import Map from './Map.vue'
const emit = defineEmits(['onClose'])
const props = defineProps({
  game: {
    type: Object,
    default: null
  }
})
const game = ref({ ...props.game }) //as Game);
;(() => {
  const sett = {} //: settingsArray = {}
  Object.assign(sett, game.value.settings)
  game.value.settings = sett
})()
const gps = ref({
  lat: game.value.boundary?.lat ?? 0,
  lng: game.value.boundary?.long ?? 0
})
const center = ref({ ...gps.value })
const biketag = useBikeTagApiStore()
const toast: any = inject('toast')
const settings = computed(() => Object.keys(game.value.settings))
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
const updateGame = async () => {
  game.value.boundary.gps = {
    lat: gps.value.lat,
    long: gps.value.lng,
    alt: game.value.boundary.gps?.alt ?? 0
  }
  try {
    const res: any = await biketag.updateGame(
      props.game as any,
      game.value as any
    )
    console.log(res)
    if (res.success) {
      toast.open({
        message: `Game updated: ${game.value.name}`,
        type: 'success',
        position: 'top'
      })
    } else {
      toast.open({
        message: `Error updating game: ${game.value.name}`,
        type: 'error',
        position: 'top'
      })
    }
  } catch (e) {
    console.log(e)
    toast.open({
      message: `Error updating game: ${game.value.name}`,
      type: 'error',
      position: 'top'
    })
  }
}
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)
const typeEqualsTo = (value: any, type: string) => {
  return typeof value === type
}
const updateMarker = (e: any) => {
  gps.value = { ...e }
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
      <v-title> {{ props.game.name }} </v-title>
    </v-toolbar>
  </v-header>
  <v-content class="modal-content">
    <form @submit.prevent="updateGame">
      <v-list>
        <template v-for="key in Object.keys(game)">
          <v-item
            v-if="
              game[key] != undefined &&
              (typeEqualsTo(game[key], 'string') ||
                typeEqualsTo(game[key], 'number'))
            "
            :key="key"
          >
            <v-label position="floating">
              {{ capitalizeFirstLetter(key) }}
            </v-label>
            <v-input
              v-if="typeEqualsTo(game[key], 'number')"
              v-model="game[key]"
              type="number"
            />
            <v-input v-else v-model="game[key]" />
          </v-item>
        </template>
      </v-list>

      <v-list>
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

      <v-list>
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

      <v-list>
        <v-list-header lines="full">
          <v-label> Boundary </v-label>
        </v-list-header>
        <v-item>
          <v-text> Latitude : {{ gps.lat }} </v-text>
          <v-text> Longitude : {{ gps.lng }} </v-text>
        </v-item>
        <Map :gps="gps" :center="center" @dragend="updateMarker" />
        <v-item>
          <v-label position="floating"> Altitude </v-label>
          <v-input v-model="game.boundary.alt" />
        </v-item>
      </v-list>

      <v-list v-if="typeof game.region != 'string'">
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
      </v-list>

      <v-item>
        <v-btn type="submit"> Update </v-btn>
      </v-item>
    </form>
  </v-content>
</template>
