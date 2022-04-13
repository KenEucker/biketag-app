<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
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
} from '@ionic/vue'
import { closeCircleOutline, trashOutline, personAddOutline, addCircleOutline } from 'ionicons/icons'
const emit = defineEmits(['onClose'])
const props = defineProps({
  game: {
    type: Object,
    default: null,
  },
})
const game = ref({...props.game});
const newAmbassador = ref("")
const addNewAmbassador = () => {
  game.value.ambassadors.push(newAmbassador.value)
  newAmbassador.value = ""
}
const removeAmbassador = (index: number) => {
  game.value.ambassadors.splice(index, 1)
}
const newSettingKey = ref("")
const newSettingValue = ref("")
const addNewSetting = () => {
  if (newSettingKey.value) {
    game.value.settings[newSettingKey.value] = newSettingValue.value
  }
  newSettingKey.value = ""
  newSettingValue.value = ""
}
const removeSetting = (name: string) => {
  delete game.value.settings[name]
}
const updateGame = () => {
  console.log("update")
}
const capitalizeFirstLetter = (str : string) => str.charAt(0).toUpperCase() + str.slice(1);
const typeEqualsTo = (value : any, type : string) => {
  return typeof(value) === type
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
          <ion-item v-if="game[key] && (typeEqualsTo(game[key], 'string') || typeEqualsTo(game[key], 'number'))" :key="key">
            <ion-label> {{ capitalizeFirstLetter(key) }} : </ion-label>
            <ion-input v-if="typeEqualsTo(game[key], 'number')" type="number" v-model="game[key]" />
            <ion-input v-else v-model="game[key]" />
          </ion-item>
        </template>
      </ion-list>

      <ion-list>
        <ion-list-header lines="full">
          <ion-label> Ambassadors </ion-label>
        </ion-list-header>
        <ion-item class="ion-margin-start" v-for="(ambassador, index) in game.ambassadors" :key="`amb_${index}`">
          <ion-input v-model="game.ambassadors[index]" />
          <ion-button fill="clear" @click="() => removeAmbassador(index)">
            <ion-icon :icon="trashOutline" />
          </ion-button>
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label> Add an ambassador : </ion-label>
          <ion-input v-model="newAmbassador" />
          <ion-button fill="clear" @click="addNewAmbassador">
              <ion-icon :icon="personAddOutline" />
          </ion-button>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header lines="full">
          <ion-label> Settings </ion-label>
        </ion-list-header>
        <template v-if="game.settings && Object.keys(game.settings).length">
          <ion-item class="ion-margin-start" v-for="(key, index) in Object.keys(game.settings)" :key="`${key}-${index}`">
            <ion-label> {{ capitalizeFirstLetter(key) }} : </ion-label>
            <ion-input v-model="game.settings[key]" />
            <ion-button fill="clear" @click="() => removeSetting(key)">
              <ion-icon :icon="trashOutline" />
            </ion-button>
          </ion-item>
        </template>
        <ion-list class="ion-margin-start">
          <ion-list-header lines="full">
            <ion-label ion-label> Add new setting </ion-label>
          </ion-list-header>
          <ion-item class="ion-margin-start">
            <ion-label> Setting key  : </ion-label>
            <ion-input v-model="newSettingKey" />
          </ion-item>
          <ion-item class="ion-margin-start">
            <ion-label> Setting value : </ion-label>
            <ion-input v-model="newSettingValue" />
          </ion-item>
          <ion-item>
            <ion-button slot="end" fill="clear" @click="addNewSetting">
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
          <ion-label> Latitude : </ion-label>
          <ion-input v-model="game.boundary.lat" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label> Longitude : </ion-label>
          <ion-input v-model="game.boundary.lng" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label> Altitude : </ion-label>
          <ion-input v-model="game.boundary.alt" />
        </ion-item>
      </ion-list>

      <ion-list v-if="typeof(game.region) != 'string'">
        <ion-list-header lines="full">
          <ion-label> Region </ion-label>
        </ion-list-header>
        <ion-item class="ion-margin-start">
          <ion-label> Slug : </ion-label>
          <ion-input  v-model="game.region.slug" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label> Name : </ion-label>
          <ion-input  v-model="game.region.name" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label> Description : </ion-label>
          <ion-input  v-model="game.region.description" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label> ZipCode : </ion-label>
          <ion-input type="number" v-model="game.region.zipcode" />
        </ion-item>
      </ion-list>

      <ion-item>
        <ion-button slot="end" type="submit"> Update </ion-button>
      </ion-item>
    </form>
  </ion-content>
</template>