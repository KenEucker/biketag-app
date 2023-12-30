<script setup lang="ts">
import { ref, inject } from 'vue'
import { useBikeTagStore } from '../store/biketag'
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
const biketag = useBikeTagStore()
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
    <header>
      <toolbar>
        <buttons slot="end">
          <u-button @click="emit('onClose')">
            <icon name="ic:outline-round-close" />
          </u-button>
        </buttons>
        <title>Tag Form</title>
      </toolbar>
    </header>
    <content class="modal-content">
      <form @submit.prevent="updateTag">
        <list lines="full" class="no-margin">
          <list>
            <template v-for="key in Object.keys(tag)">
              <item
                v-if="
                  tag[key] != undefined &&
                  (typeEqualsTo(tag[key], 'string') ||
                    typeEqualsTo(tag[key], 'number'))
                "
                :key="key"
              >
                <label position="floating">
                  {{ capitalizeFirstLetter(key) }}
                </label>
                <input
                  :readonly="readOnly.includes(key)"
                  v-if="typeEqualsTo(tag[key], 'number')"
                  type="number"
                  v-model="tag[key]"
                />
                <input
                  :readonly="readOnly.includes(key)"
                  v-else
                  v-model="tag[key]"
                />
              </item>
            </template>
          </list>

          <list>
            <list-header lines="full">
              <label> GPS </label>
            </list-header>
            <u-row class="flex ml-4 md:ml-3 flex-wrap md:flex-nowrap flex-row justify-start md:justify-around items-center">
              <item class="flex justify-center items-center">
                <text> Latitude : {{ gps.lat }} </text>
              </item>
              <item class="flex justify-center items-center">
                <text>  Longitude : {{ gps.lng }} </text>
              </item>
              <item class="flex justify-center items-center mb-1">
                <label position="floating"> Altitude </label>
                <input v-model="tag.gps.alt" />
              </item>
            </u-row>
            <Map :gps="gps" :center="center" @dragend="updateMarker" />
          </list>
        </list>

        <item v-if="commit">
          <u-button slot="end" type="submit"> Update </u-button>
        </item>
      </form>
    </content>
  </template>
  <template v-else>
    <template v-for="key in Object.keys(tag)">
      <item
        v-if="
          tag[key] != undefined &&
          (typeEqualsTo(tag[key], 'string') ||
            typeEqualsTo(tag[key], 'number'))
        "
        :key="key"
      >
        <label position="floating">
          {{ capitalizeFirstLetter(key) }}
        </label>
        <input
          :readonly="readOnly.includes(key)"
          v-if="typeEqualsTo(tag[key], 'number')"
          type="number"
          v-model="tag[key]"
        />
        <input
          :readonly="readOnly.includes(key)"
          v-else
          v-model="tag[key]"
        />
      </item>
    </template>
    <list-header lines="full">
        <label> GPS </label>
    </list-header>
    <u-row class="flex ml-4 md:ml-3 flex-wrap md:flex-nowrap flex-row justify-start md:justify-around items-center">
      <item class="flex justify-center items-center">
        <text> Latitude : {{ gps.lat }} </text>
      </item>
      <item class="flex justify-center items-center">
        <text>  Longitude : {{ gps.lng }} </text>
      </item>
      <item class="flex justify-center items-center mb-1">
        <label position="floating"> Altitude </label>
        <input v-model="tag.gps.alt" />
      </item>
    </u-row>
    <Map :gps="gps" :center="center" @dragend="updateMarker" />
  </template>
</template>
