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
import { closeCircleOutline } from 'ionicons/icons'
import { useBikeTagApiStore } from '@/store/biketag'
const emit = defineEmits(['onClose'])
const props = defineProps({
  tag: {
    type: Object,
    default: null,
  },
  gameName: {
    type: String,
    default: null
  }
})
const tag = ref({...props.tag});
const biketag = useBikeTagApiStore()
const updateTag = () => {
  biketag.updateTag(tag.value, props.gameName)
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
      <ion-title>Tag Form</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="modal-content">
    <form @submit.prevent="updateTag">
      <ion-list lines="full" class="ion-no-margin">
        <ion-list>
          <template v-for="key in Object.keys(tag)">
            <ion-item v-if="tag[key] && (typeEqualsTo(tag[key], 'string') || typeEqualsTo(tag[key], 'number'))" :key="key">
              <ion-label> {{ capitalizeFirstLetter(key) }} : </ion-label>
              <ion-input v-if="typeEqualsTo(tag[key], 'number')" type="number" v-model="tag[key]" />
              <ion-input v-else v-model="tag[key]" />
            </ion-item>
          </template>
        </ion-list>

        <ion-list>
          <ion-list-header lines="full">
            <ion-label> GPS </ion-label>
          </ion-list-header>
          <ion-item class="ion-margin-start">
            <ion-label> Latitude : </ion-label>
            <ion-input v-model="tag.gps.lat" />
          </ion-item>
          <ion-item class="ion-margin-start">
            <ion-label> Longitude : </ion-label>
            <ion-input v-model="tag.gps.long" />
          </ion-item>
          <ion-item class="ion-margin-start">
            <ion-label> Altitude : </ion-label>
            <ion-input v-model="tag.gps.alt" />
          </ion-item>
        </ion-list>
      </ion-list>

      <ion-item>
        <ion-button slot="end" type="submit"> Update </ion-button>
      </ion-item>
    </form>
  </ion-content>
</template>