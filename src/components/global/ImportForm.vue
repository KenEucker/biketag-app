<script setup lang="ts">
import { QFile } from 'quasar'
import { Tag } from 'biketag/dist/common/schema'
import { ref } from 'vue'

interface Props {
  areTags?: boolean
  text: string
}

const props = withDefaults(defineProps<Props>(), {
  areTags: false,
  text: 'Upload Tags',
})

const emits = defineEmits(['dataImported'])
const file = ref<QFile | null>(null)
const fileData = ref<File | null>(null)
const getDate = (date: string | number) => new Date(date).getTime() / 1000
const isNumb = (n: number) => !isNaN(Number(n))
//Missing check - imgur image url exist in album ?
const validateTag = (tag: Tag) =>
  (tag.foundImageUrl && tag.foundImageUrl.length) ||
  (tag.mysteryImageUrl && tag.mysteryImageUrl.length)

const transformTags = (val: Record<string, string | number> | Tag) => {
  const val_copy: Record<string, string | number | undefined | unknown> = {
    ...val,
    tagnumber: isNumb(val.tagnumber as number) ? Number(val.tagnumber) : 0,
    mysteryTime: val.mysteryTime ? getDate(val.mysteryTime) : undefined,
    foundTime: val.foundTime ? getDate(val.foundTime) : undefined,
    gps: {
      lat: isNumb((val as Record<string, string | number>).latitude as number)
        ? Number((val as Record<string, string | number>).latitude)
        : 0,
      long: isNumb((val as Record<string, string | number>).longitude as number)
        ? Number((val as Record<string, string | number>).longitude)
        : 0,
      alt: isNumb((val as Record<string, string | number>).altitude as number)
        ? Number((val as Record<string, string | number>).altitude)
        : 0,
    },
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
      const dataCsv: Tag[] = []
      lines.forEach((line) => {
        let lineData: Tag | Record<string, string | number> = {} as Tag

        line.split(',').forEach((val, i) => {
          const val_trimed = val.trimEnd()
          if (val_trimed.length > 0) {
            lineData = Object.assign({
              ...lineData,
              [header[i]]: val.trimEnd(),
            })
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

const loadFile = () => {
  if (fileData.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      convertData(e.target?.result as string, fileData.value?.type as string)
    }
    reader.readAsText(fileData.value)
  }
}

const openFileInput = () => {
  ;(file.value as QFile)?.pickFiles()
}
</script>

<template>
  <div>
    <q-btn
      outlined
      @click="openFileInput"
      class="w-full bg-slate-500 text-white"
      icon="backup"
      :label="props.text"
    >
    </q-btn>
    <q-file
      outlined
      ref="file"
      v-model="fileData"
      @update:model-value="loadFile"
      class="hidden"
    />
  </div>
</template>
