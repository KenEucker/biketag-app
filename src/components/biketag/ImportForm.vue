<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-case-declarations */
import { ref } from 'vue'

const props = defineProps({
  areTags: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: 'Upload Tags'
  }
})
const emits = defineEmits(['dataImported'])
const file = ref<HTMLElement | null>(null)
const getDate = (date: string) => new Date(date).getTime() / 1000
const isNumb = (n: number) => !isNaN(Number(n))
//Missing check - imgur image url exist in album ?
const validateTag = (tag: any) =>
  (tag.foundImageUrl && tag.foundImageUrl.length) ||
  (tag.mysteryImageUrl && tag.mysteryImageUrl.length)
const transformTags = (val: any) => {
  const val_copy = {
    ...val,
    tagnumber: isNumb(val.tagnumber) ? Number(val.tagnumber) : 0,
    mysteryTime: val.mysteryTime?.length ? getDate(val.mysteryTime) : undefined,
    foundTime: val.foundTime?.length ? getDate(val.foundTime) : undefined,
    gps: {
      lat: isNumb(val.latitude) ? Number(val.latitude) : 0,
      long: isNumb(val.longitude) ? Number(val.longitude) : 0,
      alt: isNumb(val.altitude) ? Number(val.altitude) : 0
    }
  }
  delete val_copy.latitude
  delete val_copy.longitude
  delete val_copy.altitude
  return val_copy
}
const convertData = (data: string, type: string) => {
  switch (type) {
    case 'text/csv':
      const lines = data.split('\n')
      lines.splice(lines.length - 1)
      const header = lines.splice(0, 1)[0].trim().split(',')
      const dataCsv: {}[] = []
      lines.forEach((line) => {
        const lineData: any = {}

        line.split(',').forEach((val, i) => {
          const val_trimed = val.trimEnd()
          if (val_trimed.length > 0) {
            lineData[header[i]] = val.trimEnd()
          }
        })
        if (props.areTags && validateTag(lineData)) {
          dataCsv.push(lineData)
        }
      })
      emits(
        'dataImported',
        props.areTags ? dataCsv.map((val) => transformTags(val)) : dataCsv
      )
      break
    case 'application/json':
    default:
      let dataJson = []
      try {
        dataJson = JSON.parse(data)
        if (props.areTags) {
          const tags = []
          for (const tag of dataJson) {
            if (validateTag(tag)) {
              tags.push(tag)
            }
          }
          dataJson = tags
        }
      } catch (e) {
        console.log(e)
      }
      emits('dataImported', dataJson)
      break
  }
}
const loadFile = (event: any) => {
  const reader = new FileReader()
  reader.onload = (e: any) =>
    convertData(e.target.result, event.target.files[0].type)
  reader.readAsText(event.target.files[0])
}
const getFile = () => file.value?.click()
</script>

<template>
  <form class="export-form--centered">
    <div class="export-form--centered__cnt">
      <input
        ref="file"
        type="file"
        accept="text/csv, application/json"
        hidden
        required
        @change="loadFile"
      />
      <v-btn
        class="justify-content-between"
        fill="clear"
        @click.prevent="getFile"
      >
        <v-icon icon="mdi-cloud-plus-outline" />
        <v-label> {{ props.text }} </v-label>
      </v-btn>
    </div>
  </form>
</template>
