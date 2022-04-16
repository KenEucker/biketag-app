<script setup lang="ts">
import { ref, inject, defineEmits, defineProps } from 'vue'
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
// import { Tag } from 'biketag/lib/common/schema';
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
const tag = ref({...props.tag})// as Tag);
const biketag = useBikeTagApiStore()
const toast: any = inject('toast')
console.log(toast)
const readOnly = [
  'tagnumber',
  'name',
  'slug',
  'foundTime',
  'mysteryTime',
  'mysteryImageUrl',
  'foundImageUrl',
]
const updateTag = () => {
  const res = biketag.updateTag(tag.value, props.gameName)
  if (res) {
    console.log(res)
    res.then(() => toast.open({
      message: `Tag #${tag.value.tagnumber} of BikeTag ${props.gameName} updated!`,
      type: 'success',
      position: 'top',
    })).catch((e) => toast.open({
      message: `Error #${tag.value.tagnumber} ${e}`,
      type: 'error',
      position: 'top',
    }))
  }
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
            <ion-item v-if="tag[key] != undefined && (typeEqualsTo(tag[key], 'string') || typeEqualsTo(tag[key], 'number'))" :key="key">
              <ion-label position="floating"> {{ capitalizeFirstLetter(key) }} </ion-label>
              <ion-input :readonly="readOnly.includes(key)" v-if="typeEqualsTo(tag[key], 'number')" type="number" v-model="tag[key]" />
              <ion-input :readonly="readOnly.includes(key)" v-else v-model="tag[key]" />
            </ion-item>
          </template>
        </ion-list>

        <ion-list>
          <ion-list-header lines="full">
            <ion-label> GPS </ion-label>
          </ion-list-header>
          <ion-item class="ion-margin-start">
            <ion-label position="floating"> Latitude </ion-label>
            <ion-input v-model="tag.gps.lat" />
          </ion-item>
          <ion-item class="ion-margin-start">
            <ion-label position="floating"> Longitude </ion-label>
            <ion-input v-model="tag.gps.long" />
          </ion-item>
          <ion-item class="ion-margin-start">
            <ion-label position="floating"> Altitude </ion-label>
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