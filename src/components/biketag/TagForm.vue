<script setup lang="ts">
import { ref, inject, defineEmits, defineProps } from 'vue'
import { useBikeTagApiStore } from '@/store/biketag'
// import { Tag } from 'biketag/lib/common/schema';
import Map from './Map.vue'
const emit = defineEmits(['onClose'])
const props = defineProps({
  tag: {
    type: Object,
    default: null
  },
  gameName: {
    type: String,
    default: null
  },
  commit: {
    type: Boolean,
    default: true
  }
})
const tag = ref(props.commit ? { ...props.tag } : props.tag) // as Tag);
const gps = ref({
  lat: tag.value.gps?.lat ?? 0,
  lng: tag.value.gps?.long ?? 0
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
  'foundImageUrl'
]
const updateTagGps = () => {
  tag.value.gps = {
    lat: gps.value.lat,
    long: gps.value.lng,
    alt: tag.value.gps?.alt ?? 0
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
            position: 'top'
          })
        )
        .catch((e) =>
          toast.open({
            message: `Error #${tag.value.tagnumber} ${e}`,
            type: 'error',
            position: 'top'
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
    <v-header>
      <v-toolbar>
        <v-buttons>
          <v-btn @click="emit('onClose')">
            <v-icon icon="mdi-close-circle-outline" />
          </v-btn>
        </v-buttons>
        <v-title>Tag Form</v-title>
      </v-toolbar>
    </v-header>
    <v-content class="modal-content">
      <form @submit.prevent="updateTag">
        <v-list lines="full" class="ion-no-margin">
          <v-list>
            <template v-for="key in Object.keys(tag)">
              <v-item
                v-if="
                  tag[key] != undefined &&
                  (typeEqualsTo(tag[key], 'string') ||
                    typeEqualsTo(tag[key], 'number'))
                "
                :key="key"
              >
                <v-label position="floating">
                  {{ capitalizeFirstLetter(key) }}
                </v-label>
                <v-input
                  v-if="typeEqualsTo(tag[key], 'number')"
                  v-model="tag[key]"
                  :readonly="readOnly.includes(key)"
                  type="number"
                />
                <v-input
                  v-else
                  v-model="tag[key]"
                  :readonly="readOnly.includes(key)"
                />
              </v-item>
            </template>
          </v-list>

          <v-list>
            <v-list-header lines="full">
              <v-label> GPS </v-label>
            </v-list-header>
            <v-row
              class="flex ml-4 md:ml-3 flex-wrap md:flex-nowrap flex-row justify-start md:justify-around items-center"
            >
              <v-item class="flex justify-center items-center">
                <v-text> Latitude : {{ gps.lat }} </v-text>
              </v-item>
              <v-item class="flex justify-center items-center">
                <v-text> Longitude : {{ gps.lng }} </v-text>
              </v-item>
              <v-item class="flex justify-center items-center mb-1">
                <v-label position="floating"> Altitude </v-label>
                <v-input v-model="tag.gps.alt" />
              </v-item>
            </v-row>
            <Map :gps="gps" :center="center" @dragend="updateMarker" />
          </v-list>
        </v-list>

        <v-item v-if="commit">
          <v-btn type="submit"> Update </v-btn>
        </v-item>
      </form>
    </v-content>
  </template>
  <template v-else>
    <template v-for="key in Object.keys(tag)">
      <v-item
        v-if="
          tag[key] != undefined &&
          (typeEqualsTo(tag[key], 'string') || typeEqualsTo(tag[key], 'number'))
        "
        :key="key"
      >
        <v-label position="floating">
          {{ capitalizeFirstLetter(key) }}
        </v-label>
        <v-input
          v-if="typeEqualsTo(tag[key], 'number')"
          v-model="tag[key]"
          :readonly="readOnly.includes(key)"
          type="number"
        />
        <v-input v-else v-model="tag[key]" :readonly="readOnly.includes(key)" />
      </v-item>
    </template>
    <v-list-header lines="full">
      <v-label> GPS </v-label>
    </v-list-header>
    <v-row
      class="flex ml-4 md:ml-3 flex-wrap md:flex-nowrap flex-row justify-start md:justify-around items-center"
    >
      <v-item class="flex justify-center items-center">
        <v-text> Latitude : {{ gps.lat }} </v-text>
      </v-item>
      <v-item class="flex justify-center items-center">
        <v-text> Longitude : {{ gps.lng }} </v-text>
      </v-item>
      <v-item class="flex justify-center items-center mb-1">
        <v-label position="floating"> Altitude </v-label>
        <v-input v-model="tag.gps.alt" />
      </v-item>
    </v-row>
    <Map :gps="gps" :center="center" @dragend="updateMarker" />
  </template>
</template>
