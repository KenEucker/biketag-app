<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import JSZip from 'jszip'

const zip = new JSZip()
const props = defineProps({
  variant: {
    type: String,
    default: 'data'
  },
  data: {
    type: Array,
    default: () => []
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
  'altitude'
]
const fileType = ref('csv')
const packing = ref(false)
const download = (data: Blob, fileName: string) => {
  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(data)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}
/**
 * Creates and downloads a zip file containing pictures.
 * @param data matrix Nx2 [[img-url, img-name]]
 */
const downloadPictures = async () => {
  packing.value = true
  for (const img of props.data) {
    const image = await fetch((img as string[])[0])
    const imageBlog = await image.blob()
    zip.file((img as string[])[1], imageBlog)
  }
  zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
    download(content, 'tags-pictures.zip')
    packing.value = false
    console.log(packing.value)
  })
}

const downloadFile = (data: string, fileName: string, fileType: string) => {
  const blob = new Blob([data], { type: fileType })
  download(blob, fileName)
}

const exportToJson = () => {
  downloadFile(JSON.stringify(props.data), `${props.info}.json`, 'text/json')
}

const getUTCDateTime = (timestamp: number) =>
  new Date(timestamp * 1000).toUTCString().replace(',', '')

const transformTags = () =>
  props.data.map((val: any) => {
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

const toCsvLine = function (data: any[]): string {
  return data.map((field: string) => `"${field}"`).join(',')
}

const exportToCsv = (data: unknown[]) => {
  // Headers for each column
  // eslint-disable-next-line @typescript-eslint/ban-types
  let headers = props.areTags ? tagKeys : Object.keys((data as Array<{}>)[0])

  // Convert users data to a csv
  let usersCsv = data.reduce((acc: Array<string>, datap: any) => {
    acc.push(toCsvLine(headers.map((val: string) => datap[val] ?? '')))
    return acc
  }, [])

  downloadFile(
    [toCsvLine(headers), ...usersCsv].join('\n'),
    `${props.info}.csv`,
    'text/csv'
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
  <form v-if="variant == 'data'" class="export-form--fixed">
    <v-row>
      <v-col>
        <v-btn fill="clear" @click.prevent="downloadData">
          <v-icon icon="mdi-download" />
        </v-btn>
      </v-col>
      <v-col>
        <v-btn-toggle v-model="fileType" color="tertiary">
          <v-btn value="csv">
            <v-label> CSV </v-label>
          </v-btn>
          <v-btn value="json">
            <v-label> JSON </v-label>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
  </form>
  <v-btn
    v-if="variant == 'inline-imgs'"
    class="mx-0 px-0 md:mx-2 md:px-2"
    fill="clear"
    :disabled="packing"
    @click="downloadPictures"
  >
    <v-icon icon="mdi-image-outline" />
  </v-btn>
  <v-btn v-if="variant == 'imgs'" :disabled="packing" @click="downloadPictures">
    <slot />
    <v-icon icon="mdi-image-multiple" />
  </v-btn>
</template>
