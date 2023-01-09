<script setup lang="ts">
import { defineEmits } from 'vue'
const props = defineProps({
  center: {
    type: Object,
    default: () => ({ lat: 0, lng: 0 })
  },
  gps: {
    type: Object,
    default: () => ({ lat: 0, lng: 0 })
  }
})
const emit = defineEmits(['dragend'])
const round = (n: number) => Number(Math.round(Number(`${n}e4`)) + 'e-4')
const clean = (e: any) => {
  return {
    lat: round(e.latLng.lat()),
    lng: round(e.latLng.lng())
  }
}
</script>

<template>
  <GMapMap :center="props.center" :zoom="18" map-type-id="roadmap">
    <GMapMarker
      icon="mdi-pin"
      :position="props.gps"
      :draggable="true"
      :clickeable="true"
      @dragend="(e : any) => emit('dragend', clean(e))"
    />
  </GMapMap>
</template>
