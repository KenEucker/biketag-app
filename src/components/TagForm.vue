<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import {
  IonContent,
  IonButton,
  IonButtons,
  // IonBackButton,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
const emit = defineEmits(['onClose'])
const props = defineProps({
  tag: {
    type: Object,
    default: null,
  },
})
const tag = ref({...props.tag});
const updateTag = () => {}
const capitalizeFirstLetter = (str : string) => str.charAt(0).toUpperCase() + str.slice(1);
const typeEqualsTo = (value : any, type : string) => {
  return typeof(value) === type
}
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-button @click="emit('onClose')">CLOSE</ion-button>
      </ion-buttons>
      <ion-title>About Modal</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list lines="full" class="ion-no-margin">
      <form @submit.prevent="updateTag">
        <ion-list>
          <template v-for="key in Object.keys(tag)">
            <ion-item v-if="tag[key] && (typeEqualsTo(tag[key], 'string') || typeEqualsTo(tag[key], 'number'))" :key="key">
              <ion-label> {{ capitalizeFirstLetter(key) }} </ion-label>
              <ion-input v-if="typeEqualsTo(tag[key], 'number')" type="number" v-model="tag[key]" />
              <ion-input v-else v-model="tag[key]" />
            </ion-item>
          </template>
        </ion-list>

        <ion-list>
          <ion-list-header lines="full">
            <ion-label> GPS </ion-label>
          </ion-list-header>
          <ion-item>
            <ion-label> Latitude  </ion-label>
            <ion-input type="number" v-model="tag.gps.lat" />
          </ion-item>
          <ion-item>
            <ion-label> Longitude  </ion-label>
            <ion-input type="number" v-model="tag.gps.long" />
          </ion-item>
          <ion-item>
            <ion-label> Altitude  </ion-label>
            <ion-input type="number" v-model="tag.gps.alt" />
          </ion-item>
        </ion-list>
      </form>
    </ion-list>
  </ion-content>
</template>