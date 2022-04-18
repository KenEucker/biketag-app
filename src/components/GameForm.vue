<script setup lang="ts">
import { ref, computed, defineEmits, defineProps } from 'vue'
import {
  IonContent,
  IonButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonIcon,
  IonList,
  IonListHeader,
  IonItem,
  IonInput,
  IonCol,
  IonRow,
} from '@ionic/vue'
import {
  closeCircleOutline,
  trashOutline,
  personAddOutline,
  addCircleOutline,
} from 'ionicons/icons'
// import { Game, settingsArray } from 'biketag/lib/common/schema';
const emit = defineEmits(['onClose'])
const props = defineProps({
  game: {
    type: Object,
    default: null,
  },
})
const game = ref({ ...props.game }) //as Game);
;(() => {
  const sett = {} //: settingsArray = {}
  Object.assign(sett, game.value.settings)
  game.value.settings = sett
})()
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
const updateGame = () => {
  console.log('update')
}
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)
const typeEqualsTo = (value: any, type: string) => {
  return typeof value === type
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
      <ion-title>Game Form</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="modal-content">
    <form @submit.prevent="updateGame">
      <ion-list>
        <template v-for="key in Object.keys(game)">
          <ion-item
            v-if="
              game[key] != undefined &&
              (typeEqualsTo(game[key], 'string') ||
                typeEqualsTo(game[key], 'number'))
            "
            :key="key"
          >
            <ion-label position="floating">
              {{ capitalizeFirstLetter(key) }}
            </ion-label>
            <ion-input
              v-if="typeEqualsTo(game[key], 'number')"
              type="number"
              v-model="game[key]"
            />
            <ion-input v-else v-model="game[key]" />
          </ion-item>
        </template>
      </ion-list>

      <ion-list>
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

      <ion-list>
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

      <ion-list>
        <ion-list-header lines="full">
          <ion-label> Boundary </ion-label>
        </ion-list-header>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Latitude </ion-label>
          <ion-input v-model="game.boundary.lat" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Longitude </ion-label>
          <ion-input v-model="game.boundary.long" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Altitude </ion-label>
          <ion-input v-model="game.boundary.alt" />
        </ion-item>
      </ion-list>

      <ion-list v-if="typeof game.region != 'string'">
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
      </ion-list>

      <ion-item>
        <ion-button slot="end" type="submit"> Update </ion-button>
      </ion-item>
    </form>
  </ion-content>
</template>
