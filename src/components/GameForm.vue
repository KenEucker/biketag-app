<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import {
  IonContent,
  IonButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
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
const updateGame = () => {}
const capitalizeFirstLetter = (str : string) => str.charAt(0).toUpperCase() + str.slice(1);
const typeEqualsTo = (value : any, type : string) => {
  return typeof(value) === type
}
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-button @click="emit('onClose')">
          <ion-icon name="close-circle-outline" />
        </ion-button>
      </ion-buttons>
      <ion-title>Game Form</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <form @submit.prevent="updateGame">
      <ion-list>
        <template v-for="key in Object.keys(game)">
          <ion-item v-if="game[key] && (typeEqualsTo(game[key], 'string') || typeEqualsTo(game[key], 'number'))" :key="key">
            <ion-label> {{ capitalizeFirstLetter(key) }} </ion-label>
            <ion-input v-if="typeEqualsTo(game[key], 'number')" type="number" v-model="game[key]" />
            <ion-input v-else v-model="game[key]" />
          </ion-item>
        </template>
      </ion-list>

      <ion-list>
        <ion-list-header lines="full">
          <ion-label> Ambassadors </ion-label>
        </ion-list-header>
        <ion-item v-for="(ambassador, index) in game.ambassadors" :key="`amb_${index}`">
          <ion-label> {{ ambassador }} </ion-label>
          <ion-input v-model="ambassador" />
          <ion-button @click="() => removeAmbassador(index)">
            <ion-icon slot="start" name="trash-outline"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item>
          <ion-label> Add an ambassador </ion-label>
          <ion-input v-model="newAmbassador" />
          <ion-button @click="addNewAmbassador">
              <ion-icon name="person-add-outline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header lines="full">
          <ion-label> Settings </ion-label>
        </ion-list-header>
        <ion-item v-for="key in Object.keys(game.settings)" :key="key">
          <ion-label> {{ capitalizeFirstLetter(key) }} </ion-label>
          <ion-input v-model="game.settings[key]" />
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header lines="full">
          <ion-label> Boundary </ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label> Latitude  </ion-label>
          <ion-input type="number" v-model="game.boundary.lat" />
        </ion-item>
        <ion-item>
          <ion-label> Longitude  </ion-label>
          <ion-input type="number" v-model="game.boundary.long" />
        </ion-item>
        <ion-item>
          <ion-label> Altitude  </ion-label>
          <ion-input type="number" v-model="game.boundary.alt" />
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header lines="full">
          <ion-label> Region </ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label> Slug  </ion-label>
          <ion-input  v-model="game.region.slug" />
        </ion-item>
        <ion-item>
          <ion-label> Name  </ion-label>
          <ion-input  v-model="game.region.name" />
        </ion-item>
        <ion-item>
          <ion-label> Description  </ion-label>
          <ion-input  v-model="game.region.description" />
        </ion-item>
        <ion-item>
          <ion-label> ZipCode  </ion-label>
          <ion-input type="number" v-model="game.region.zipcode" />
        </ion-item>
      </ion-list>

    </form>
  </ion-content>
</template>