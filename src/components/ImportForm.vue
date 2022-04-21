<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import { 
  IonIcon, 
  IonButton,
  IonLabel,
} from '@ionic/vue'
import { cloudUploadOutline } from 'ionicons/icons'

const props = defineProps({
  areTags: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['dataImported'])
const file = ref(null)
const getDate = (date: string) => new Date(date).getTime() / 1000
const transformTags = (val : any) => {
  const val_copy = {
    ...val,
    mysteryTime: val.mysteryTime ? getDate(val.mysteryTime) : 0,
    foundTime: val.foundTime ? getDate(val.foundTime) : 0,
    gps: {
      lat : Number(val.latitude),
      long : Number(val.longitude),
      alt : Number(val.altitude),
    }
  }
  delete val_copy.latitude
  delete val_copy.longitude
  delete val_copy.altitude
  return val_copy
}
const convertData = (data : string, type : string) => {
  switch (type) {
    case "text/csv":
      const lines = data.split('\n')
      lines.splice(lines.length-1)
      const header = lines.splice(0,1)[0].trim().split(',')
      const dataCsv: {}[] = []
      lines.forEach((line) => {
        const lineData: any = {}
        
        line.split(',').forEach((val, i) => {
          const val_trimed = val.trimEnd()
          if (val_trimed.length > 0) {
            lineData[header[i]] = val.trimEnd()
          }
        })
        dataCsv.push(lineData)
      })
      emits('dataImported', props.areTags ? dataCsv.map((val) => transformTags(val)) : dataCsv)
      break
    case "application/json":
    default:
      let dataJson = {}
      try {
        dataJson = JSON.parse(data)
      } catch (e) {
        console.log(e)
      }
      emits('dataImported', dataJson)
      break
  }
}
const loadFile = (event : any) => {
  const reader = new FileReader()
  reader.onload = (e : any) => convertData(e.target.result, event.target.files[0].type)
  reader.readAsText(event.target.files[0])
}
const getFile = () => {
  (file.value as any)?.click()
}

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
      <ion-button class="ion-justify-content-between" fill="clear" @click.prevent="getFile">
        <ion-icon :icon="cloudUploadOutline"/>
        <ion-label class="ion-margin-start"> Import Tags </ion-label>
      </ion-button>
    </div>
  </form>
</template>
