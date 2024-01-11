<script setup lang="ts">
import { ref } from 'vue'
// import { useBikeTagStore } from 'biketag-vue'
// import { Tag } from 'biketag/lib/common/schema';
import MapView from '../global/MapView.vue'
import { Tag } from 'biketag/lib/common/schema'
import { Tags } from 'biketag/lib/common/types'

// const emit = defineEmits(['onClose'])

interface Props {
  tag: Tag | null
  gameName?: string | null
  commit: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: null,
  gameName: null,
  commit: true,
})
interface TagType {
  [key: string]: string | undefined
}
const tag = ref<TagType | Tag>(
  props.commit ? ({ ...props.tag } as Tag) : (props.tag as Tag)
) // as Tag);
const gps = ref({
  lat: (tag.value as Tag).gps?.lat ?? 0,
  lng: (tag.value as Tag).gps?.long ?? 0,
})
const center = ref({ ...gps.value })
// const biketag = useBikeTagStore()
// const toast: any = inject('toast')
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
  ;(tag.value as Tag).gps = {
    lat: gps.value.lat,
    long: gps.value.lng,
    alt: (tag.value as Tag).gps?.alt ?? 0,
  }
}
// const updateTag = () => {
//   updateTagGps()
//   if (props.commit) {
//     const res = biketag.updateTag(tag.value, props.gameName)
//     if (res) {
//       res
//         .then(() =>
//           toast.open({
//             message: `Tag #${tag.value.tagnumber} of BikeTag ${props.gameName} updated!`,
//             type: 'success',
//             position: 'top',
//           })
//         )
//         .catch((e) =>
//           toast.open({
//             message: `Error #${tag.value.tagnumber} ${e}`,
//             type: 'error',
//             position: 'top',
//           })
//         )
//     }
//   }
// }
interface LatLng {
  lat: number
  lng: number
  alt: number
}

interface Boundarydata extends LatLng {
  gps: LatLng
}
const updateMarker = (e: Boundarydata) => {
  gps.value = { ...e }
  if (!props.commit) {
    updateTagGps()
  }
}
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)
const typeEqualsTo = (value: string | undefined, type: string | number) => {
  return typeof value === type
}
</script>

<template>
  <div>
    <!-- <template v-if="props.gameName">
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
            <ion-row
              class="flex ml-4 md:ml-3 flex-wrap md:flex-nowrap flex-row justify-start md:justify-around items-center"
            >
              <ion-item class="flex justify-center items-center">
                <ion-text> Latitude : {{ gps.lat }} </ion-text>
              </ion-item>
              <ion-item class="flex justify-center items-center">
                <ion-text> Longitude : {{ gps.lng }} </ion-text>
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
  </template> -->
    <!-- <template> -->
    <p class="p-0 text-base font-medium py-2">Tag Details</p>
    <q-separator class="mb-4" />
    <div class="grid md:grid-cols-2 grid-cols-1 gap-x-4">
      <div
        v-for="key in (Object.keys(tag as unknown as TagType) as string[])"
        :key="key"
      >
        <q-item
          dense
          class="w-full mb-3 p-0"
          flat
          v-if="
          tag &&
          (tag as unknown as TagType)[key] != undefined &&
          (typeEqualsTo((tag as unknown as TagType)[key], 'string') || typeEqualsTo((tag as unknown as TagType)[key], 'number'))
        "
        >
          <q-item-section>
            <div>
              <label for="">{{ capitalizeFirstLetter(key) }}</label>
              <q-input
                v-if="typeEqualsTo((tag as unknown as TagType)[key], 'number')"
                outlined
                type="number"
                v-model="(tag as unknown as TagType)[key]"
                :readonly="readOnly.includes(key)"
                dense
                class="mb-3"
                flat
              />
              <q-input
                outlined
                v-model="(tag as unknown as TagType)[key]"
                :readonly="readOnly.includes(key)"
                dense
                flat
              />
            </div>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <div>
      <p class="p-0 text-base font-medium py-2">GPS</p>
      <q-separator class="mb-4" />
      <div class="grid grid-cols-3 gap-x-4">
        <div>
          <div>
            <label for="">Latitude</label>
            <q-input
              readonly
              outlined
              dense
              v-model.trim="gps.lat"
              placeholder="Latitude"
            />
          </div>
          <!-- <p>Latitude: {{ gps.lat }}</p> -->
        </div>
        <div>
          <div>
            <label for="">Longitude</label>
            <q-input
              readonly
              outlined
              dense
              v-model.trim="gps.lng"
              placeholder="Longitude"
            />
          </div>
          <!-- <p>Longitude: {{ gps.lng }}</p> -->
        </div>

        <div>
          <div>
            <label for="">Altitude</label>
            <q-input
              outlined
              dense
              v-model.trim="tag.gps.alt"
              placeholder="Altitude"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-center md:m-4 m-0 my-4">
        <MapView
          class="w-[100%] md:h-[380px] h-[300px]"
          :gps="gps"
          :center="center"
          @dragend="updateMarker"
        />
      </div>
    </div>
    <!-- </template> -->
  </div>
</template>
