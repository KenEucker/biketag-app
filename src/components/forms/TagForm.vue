<script setup lang="ts">
import { ref } from 'vue'
// import { useBikeTagStore } from 'biketag-vue'
// import { Tag } from 'biketag/dist/common/schema';
import MapView from '../global/MapView.vue'
import { Tag } from 'biketag/dist/common/schema'
import { Notify } from 'quasar'

const emit = defineEmits(['update:tagUpdateForm'])

const loader = ref<boolean>(false)

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
const updateTag = () => {
  if (props.commit) {
    try {
      updateTagGps()
      loader.value = true
      Notify.create({
        icon: 'check_circle',
        color: 'green',
        message: 'Tag updated successfully',
        type: 'success',
        timeout: Math.random() * 5000 + 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
      emit('update:tagUpdateForm', false)
    } catch (e) {
      Notify.create({
        message: 'Something went wrong',
        type: 'negative',
        timeout: Math.random() * 5000 + 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
    } finally {
      loader.value = false
    }
  }
  loader.value = false
}
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
  <q-card flat>
    <q-inner-loading
      :showing="loader"
      class="z-10 text-lg !bg-opacity-65 font-semibold"
    >
    </q-inner-loading>
    <q-toolbar class="bg-slate-200 p-2" v-if="props.commit">
      <q-toolbar-title>
        <div class="grid grid-cols-8 md:gap-x-4 gap-x-4">
          <div class="self-center flex col-span-4">
            <div>
              <p class="p-0 text-lg pt-1 font-medium">Tag Info</p>
            </div>
          </div>
        </div>
      </q-toolbar-title>
      <q-icon
        name="highlight_off"
        size="md"
        class="cursor-pointer"
        @click="emit('update:tagUpdateForm', false)"
      ></q-icon>
    </q-toolbar>
    <p v-if="!props.commit" class="p-0 text-base font-medium py-2">
      Tag Details
    </p>
    <q-separator v-if="!props.commit" class="mb-4" />
    <div
      class="grid md:grid-cols-2 grid-cols-1 gap-x-4"
      :class="props.commit ? 'm-4' : 'm-0'"
    >
      <template v-for="key in Object.keys(tag)" :key="key">
        <div
          v-if="
            tag &&
            (tag as unknown as TagType)[key] != undefined &&
            (typeEqualsTo((tag as unknown as TagType)[key], 'string') || typeEqualsTo((tag as unknown as TagType)[key], 'number'))
          "
        >
          <q-item dense class="w-full mb-3 p-0" flat>
            <q-item-section>
              <div>
                <label for="">{{ capitalizeFirstLetter(key) }}</label>
                <q-input
                  v-if="typeEqualsTo((tag as unknown as TagType)[key], 'number')"
                  outlined
                  type="number"
                  v-model="(tag as unknown as TagType)[key]"
                  :disable="readOnly.includes(key)"
                  dense
                  class="mb-3"
                  flat
                />
                <q-input
                  outlined
                  v-model="(tag as unknown as TagType)[key]"
                  :disable="readOnly.includes(key)"
                  dense
                  flat
                />
              </div>
            </q-item-section>
          </q-item>
        </div>
      </template>
    </div>
    <div :class="props.commit ? 'm-4' : 'm-0'">
      <p class="p-0 text-base font-medium py-2">GPS</p>
      <q-separator class="mb-4" />
      <div class="grid grid-cols-3 gap-x-4">
        <div>
          <div>
            <label for="">Latitude</label>
            <q-input
              disable
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
              disable
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
    <div class="grid grid-cols-1 text-center mb-3">
      <div>
        <q-btn
          v-if="props.commit"
          @click="updateTag"
          unelevated
          :loading="loader"
          :disable="loader"
          no-caps
          color="primary"
          label="Update"
        />
      </div>
    </div>
  </q-card>
</template>
