<script setup lang="ts">
import { ref, computed, inject } from 'vue'
// import { Game, settingsArray } from 'biketag/lib/common/schema';
import { useBikeTagStore } from '../store/biketag'
import Map from './Map.vue'
const emit = defineEmits(['onClose'])
const props = defineProps({
  game: {
    type: Object,
    default: null,
  },
})
const game = ref({ ...props.game }); //as Game);
(() => {
  const sett = {} //: settingsArray = {}
  Object.assign(sett, game.value.settings)
  game.value.settings = sett
})()
const gps = ref({
  lat: game.value.boundary?.lat ?? 0,
  lng: game.value.boundary?.long ?? 0,
})
const center = ref({ ...gps.value })
const biketag = useBikeTagStore()
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
    alt: game.value.boundary.gps?.alt ?? 0,
  }
  try {
    const res : any = await biketag.updateGame(props.game as any, game.value as any)
    console.log(res)
    if (res.success) {
      toast.open({
        message: `Game updated: ${game.value.name}`,
        type: 'success',
        position: 'top',
      })
    } else {
      toast.open({
        message: `Error updating game: ${game.value.name}`,
        type: 'error',
        position: 'top',
      })
    }
  } catch (e) {
    console.log(e)
    toast.open({
      message: `Error updating game: ${game.value.name}`,
      type: 'error',
      position: 'top',
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
  <header>
    <toolbar>
      <buttons slot="end">
        <u-button @click="emit('onClose')">
          closeCircleOutline
        </u-button>
      </buttons>
      <title> {{ props.game.name }} </title>
    </toolbar>
  </header>
  <content class="modal-content">
    <form @submit.prevent="updateGame">
      <list>
        <template v-for="key in Object.keys(game)">
          <item
            v-if="
              game[key] != undefined &&
              (typeEqualsTo(game[key], 'string') ||
                typeEqualsTo(game[key], 'number'))
            "
            :key="key"
          >
            <label position="floating">
              {{ capitalizeFirstLetter(key) }}
            </label>
            <input
              v-if="typeEqualsTo(game[key], 'number')"
              type="number"
              v-model="game[key]"
            />
            <input v-else v-model="game[key]" />
          </item>
        </template>
      </list>

      <list>
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

      <list>
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

      <list>
        <list-header lines="full">
          <label> Boundary </label>
        </list-header>
        <item class="margin-start">
          <text> Latitude : {{ gps.lat }} </text>
          <text class="margin-start">
            Longitude : {{ gps.lng }}
          </text>
        </item>
        <Map :gps="gps" :center="center" @dragend="updateMarker" />
        <item class="margin-start">
          <label position="floating"> Altitude </label>
          <input v-model="game.boundary.alt" />
        </item>
      </list>

      <list v-if="typeof game.region != 'string'">
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
      </list>

      <item>
        <u-button slot="end" type="submit"> Update </u-button>
      </item>
    </form>
  </content>
</template>
