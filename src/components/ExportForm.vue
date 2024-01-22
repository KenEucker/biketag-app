<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { Notify } from 'quasar'
import JSZip from 'jszip'
import { Tag } from 'biketag/dist/common/schema'
import { computed, ref } from 'vue'

const zip = new JSZip()

interface MyTag {
  [key: string]: string
}

const csvLoader = ref<boolean>(false)
const jsonLoader = ref<boolean>(false)
const allImageLoader = ref<boolean>(false)

interface Props {
  downloadLoader?: boolean
  tag?: MyTag | null
  downloadType?: string
  data?: Tag[] | null
  info?: string
}

const emit = defineEmits(['update:downloadLoader'])

const props = withDefaults(defineProps<Props>(), {
  downloadLoader: false,
  tag: null,
  downloadType: 'data',
  data: null,
  info: '',
})

// download tag images
const download = (data: Blob, fileName: string) => {
  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(data)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}

const tagsImgsUrls = computed(() =>
  props.data?.reduce(
    (acc: MyTag[], tagData: MyTag | Tag) =>
      acc.concat(reduceImgUrls(tagData as MyTag) as MyTag[]),
    []
  )
)

const getImgUrls = async (tag: MyTag | MyTag[] = []) => {
  emit('update:downloadLoader', true)
  let data: MyTag[] | null = null
  if (props.downloadType === 'all-images') {
    allImageLoader.value = true
    data = tagsImgsUrls?.value as MyTag[]
  } else {
    data = reduceImgUrls(tag as MyTag) as MyTag[]
  }
  for (const img of data) {
    const image = await fetch(img[0])
    const imageBlog = await image.blob()
    zip.file(img[1], imageBlog)
  }

  zip.generateAsync({ type: 'blob' }).then((content) => {
    download(content, 'tags-pictures.zip')
    emit('update:downloadLoader', false)
    allImageLoader.value = false
    Notify.create({
      icon: 'check_circle',
      color: 'green',
      message: 'File downloaded successfully',
      type: 'success',
      timeout: Math.random() * 5000 + 3000,
      actions: [{ icon: 'close', color: 'white' }],
    })
  })
  return data
}

const reduceImgUrls = (tag: MyTag): MyTag[] | string[][] => {
  const data: string[][] = []
  const pushImg = (prop: string, name: string) => {
    data.push([
      tag[prop],
      `tag-${tag.tagnumber}-${name}${tag[prop].slice(
        tag[prop].lastIndexOf('.')
      )}`,
    ])
  }
  if (tag.foundImageUrl) {
    pushImg('foundImageUrl', 'found-image')
  }
  if (tag.mysteryImageUrl) {
    pushImg('mysteryImageUrl', 'mystery-image')
  }
  return data
}
// Export csv or json

const downloadFile = (data: string, fileName: string, fileType: string) => {
  const blob = new Blob([data], { type: fileType })
  download(blob, fileName)
}

const exportToJson = () => {
  downloadFile(JSON.stringify(props.data), `${props.info}.json`, 'text/json')
}

const toCsvLine = function (data: string[]): string {
  return data.map((field: string) => `"${field}"`).join(',')
}

const exportToCsv = (data: Tag[]) => {
  // Headers for each column
  let headers = Object.keys((data as Tag[])[0])

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

const downloadData = (fileType: string) => {
  switch (fileType) {
    case 'csv':
      csvLoader.value = true
      emit('update:downloadLoader', true)
      exportToCsv(props.data as Tag[])
      csvLoader.value = false
      emit('update:downloadLoader', false)
      Notify.create({
        icon: 'check_circle',
        color: 'green',
        message: 'CSV file downloaded successfully',
        type: 'success',
        timeout: Math.random() * 5000 + 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
      break
    case 'json':
    default:
      jsonLoader.value = true
      emit('update:downloadLoader', true)
      exportToJson()
      jsonLoader.value = false
      emit('update:downloadLoader', false)
      Notify.create({
        icon: 'check_circle',
        color: 'green',
        message: 'JSON file downloaded successfully',
        type: 'success',
        timeout: Math.random() * 5000 + 3000,
        actions: [{ icon: 'close', color: 'white' }],
      })
      break
  }
}
</script>
<template>
  <q-btn
    dense
    round
    flat
    class="capitalize text-primary"
    size="md"
    icon="o_broken_image"
    v-if="downloadType === 'images'"
    :disable="downloadLoader"
    @click="getImgUrls(props.tag as MyTag)"
  ></q-btn>
  <div v-else>
    <q-btn
      color="primary"
      class="capitalize rounded-lg"
      :loading="csvLoader"
      :disable="csvLoader"
      outline
      icon="o_cloud_download"
      label="CSV"
      v-if="downloadType === 'data'"
      @click="downloadData('csv')"
    />
    <q-btn
      class="capitalize rounded-lg ms-2"
      outline
      :loading="jsonLoader"
      :disable="jsonLoader"
      color="primary"
      icon="o_sim_card_download"
      label="JSON"
      v-if="downloadType === 'data'"
      @click="downloadData('json')"
    />
    <q-btn
      color="primary"
      class="capitalize rounded-lg ms-2"
      :disable="allImageLoader"
      outline
      icon="o_download"
      label="All Images"
      v-if="downloadType === 'all-images'"
      @click="getImgUrls()"
    />
  </div>
</template>
