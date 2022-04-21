<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { 
  IonIcon, 
  IonButton, 
  IonRow, 
  IonCol, 
  IonSegment, 
  IonSegmentButton, 
  IonLabel,
} from '@ionic/vue'
import { cloudDownloadOutline } from 'ionicons/icons'

const props = defineProps({
  data: {
    type: Array,
    default: []
  },
  info: {
    type: String,
    default: 'prime-tags'
  },
  areTags: {
    type: Boolean,
    default: true
  }
})

const tagKeys = [
  'slug', 
  'name', 
  'tagnumber', 
  'mysteryPlayer', 
  'mysteryImage', 
  'mysteryImageUrl', 
  'mysteryTime',
  'foundPlayer',
  'foundImage',
  'foundImageUrl',
  'foundTime',
  'foundLocation',
  'game',
  'hint',
  'discussionUrl',
  'mentionUrl',
  'shareUrl',
  'playerId',
  'latitude',
  'longitude',
  'altitude',
]
const fileType = ref("csv")

const downloadFile = (data : string, fileName : string, fileType: string ) => {
  const blob = new Blob([data], { type: fileType })

  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(blob)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}

const exportToJson = () => {
  downloadFile(
    JSON.stringify(props.data),
    `${props.info}.json`,
    'text/json',
  )
}

const getUTCDateTime = (timestamp: number) =>
  new Date(timestamp * 1000).toUTCString().replaceAll(',','')

const transformTags = () => props.data.map((val : any) => {
  const val_copy = {
    ...val,
    mysteryTime: val.mysteryTime ? getUTCDateTime(val.mysteryTime) : '',
    foundTime: val.foundTime ? getUTCDateTime(val.foundTime) : '',
    latitude: val.gps.lat ? val.gps.lat : 0,
    longitude: val.gps.long ? val.gps.long : 0,
    altitude: val.gps.alt ? val.gps.alt : 0
  }
  delete val_copy.gps
  return val_copy
})

const exportToCsv = (data : any[]) => {
  // Headers for each column
  let headers = props.areTags ? tagKeys : Object.keys((data as Array<{}>)[0])

  // Convert users data to a csv
  let usersCsv = data.reduce((acc : Array<string>, datap : any) => {
    acc.push(headers.map((val : string) => datap[val] ?? ' ').join(','))
    return acc
  }, [])

  downloadFile(
    [headers.join(','), ...usersCsv].join('\n'),
    `${props.info}.csv`,
    'text/csv',
  )
}

const downloadData = () => {
  switch (fileType.value) {
    case 'csv':
      exportToCsv(props.areTags ? transformTags() : props.data)
      break
    case 'json':
    default:
      exportToJson()
      break
  }
}
</script>

<template>
  <form class="export-form--fixed">
    <ion-row>
      <ion-col>
        <ion-button fill="clear" @click.prevent="downloadData">
          <ion-icon :icon="cloudDownloadOutline"/>
        </ion-button>
      </ion-col>
      <ion-col>
        <ion-segment color="tertiary" v-model="fileType">
          <ion-segment-button value="csv">
            <ion-label> CSV </ion-label>
          </ion-segment-button>
          <ion-segment-button value="json">
            <ion-label> JSON </ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-col>
    </ion-row>
  </form>
</template>
