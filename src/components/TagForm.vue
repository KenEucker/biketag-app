<script setup lang="ts">
import { ref, inject } from 'vue'
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
  IonText,
  IonRow,
} from '@ionic/vue'
import { closeCircleOutline } from 'ionicons/icons'
import { useBikeTagApiStore } from '@/store/biketag'
// import { Tag } from 'biketag/lib/common/schema';
import Map from './Map.vue'
const emit = defineEmits(['onClose'])
const props = defineProps({
  tag: {
    type: Object,
    default: null,
  },
  gameName: {
    type: String,
    default: null,
  },
  commit: {
    type: Boolean,
    default: true,
  },
})
const tag = ref(props.commit ? { ...props.tag } : props.tag) // as Tag);
const gps = ref({
  lat: tag.value.gps?.lat ?? 0,
  lng: tag.value.gps?.long ?? 0,
})
const center = ref({ ...gps.value })
const biketag = useBikeTagApiStore()
const toast: any = inject('toast')
const readOnly = [
  'tagnumber',
  'name',
  'slug',
  'foundTime',
  'mysteryTime',
  'mysteryImageUrl',
  'foundImageUrl',
]
const updateTagGps = () => {
  tag.value.gps = {
    lat: gps.value.lat,
    long: gps.value.lng,
    alt: tag.value.gps?.alt ?? 0,
  }
}
const updateTag = () => {
  updateTagGps()
  if (props.commit) {
    const res = biketag.updateTag(tag.value, props.gameName)
    if (res) {
      res
        .then(() =>
          toast.open({
            message: `Tag #${tag.value.tagnumber} of BikeTag ${props.gameName} updated!`,
            type: 'success',
            position: 'top',
          })
        )
        .catch((e) =>
          toast.open({
            message: `Error #${tag.value.tagnumber} ${e}`,
            type: 'error',
            position: 'top',
          })
        )
    }
  }
}
const updateMarker = (e: any) => {
  gps.value = { ...e }
  if (!props.commit) {
    updateTagGps()
  }
}
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)
const typeEqualsTo = (value: any, type: string) => {
  return typeof value === type
}
</script>

<template>
  <template v-if="props.gameName">
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
              <ion-item
                v-if="
                  tag[key] != undefined &&
                  (typeEqualsTo(tag[key], 'string') ||
                    typeEqualsTo(tag[key], 'number'))
                "
                :key="key"
              >
                <ion-label position="floating">
                  {{ capitalizeFirstLetter(key) }}
                </ion-label>
                <ion-input
                  :readonly="readOnly.includes(key)"
                  v-if="typeEqualsTo(tag[key], 'number')"
                  type="number"
                  v-model="tag[key]"
                />
                <ion-input
                  :readonly="readOnly.includes(key)"
                  v-else
                  v-model="tag[key]"
                />
              </ion-item>
            </template>
          </ion-list>

          <ion-list>
            <ion-list-header lines="full">
              <ion-label> GPS </ion-label>
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
                <ion-input v-model="tag.gps.alt" />
              </ion-item>
            </ion-row>
            <Map :gps="gps" :center="center" @dragend="updateMarker" />
          </ion-list>
        </ion-list>

        <ion-item v-if="commit">
          <ion-button slot="end" type="submit"> Update </ion-button>
        </ion-item>
      </form>
    </ion-content>
  </template>
  <template v-else>
    <template v-for="key in Object.keys(tag)">
      <ion-item
        v-if="
          tag[key] != undefined &&
          (typeEqualsTo(tag[key], 'string') ||
            typeEqualsTo(tag[key], 'number'))
        "
        :key="key"
      >
        <ion-label position="floating">
          {{ capitalizeFirstLetter(key) }}
        </ion-label>
        <ion-input
          :readonly="readOnly.includes(key)"
          v-if="typeEqualsTo(tag[key], 'number')"
          type="number"
          v-model="tag[key]"
        />
        <ion-input
          :readonly="readOnly.includes(key)"
          v-else
          v-model="tag[key]"
        />
      </ion-item>
    </template>
    <ion-list-header lines="full">
        <ion-label> GPS </ion-label>
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
        <ion-input v-model="tag.gps.alt" />
      </ion-item>
    </ion-row>
    <Map :gps="gps" :center="center" @dragend="updateMarker" />
  </template>
</template>
