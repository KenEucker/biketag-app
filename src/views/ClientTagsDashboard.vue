<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useBikeTagApiStore } from '@/store/biketag'
import { useRouter } from 'vue-router'

const routeParam = useRouter().currentRoute.value.params.name
const biketag = useBikeTagApiStore()
const query = ref('')
const splitBy = ref(20)
const tags = ref(biketag.tags(routeParam))
const tagsFiltered = computed(() =>
  tags.value.filter((val: any) =>
    !query.value
      ? true
      : val?.mysteryPlayer?.toLowerCase().indexOf(query.value) > -1 ||
        val?.foundPlayer?.toLowerCase().indexOf(query.value) > -1
  )
)
const shownTags = computed(() =>
  tagsFiltered.value.slice(
    paginationSelected.value * splitBy.value,
    paginationSelected.value * splitBy.value + splitBy.value
  )
)
biketag
  .setTagsFromGame(routeParam as string)
  .then(() => (tags.value = biketag.tags(routeParam)))
const paginationSelected = ref(0)
const split = computed(() =>
  Math.ceil(tagsFiltered.value.length / splitBy.value)
)
const getStartPos = () => Math.trunc(paginationSelected.value / 4) * 4
const showRigthArrow = computed(() => {
  return paginationSelected.value + 4 < split.value
})
const showLeftArrow = computed(() => {
  return paginationSelected.value - 4 >= 0
})
const paginationArray = computed(() => {
  const pagination = Array.from(Array(split.value).keys()).map((x) => x + 1)
  const start_p = getStartPos()
  return pagination.slice(start_p, start_p + 4)
})
const setPagSelected = (i: number) => {
  paginationSelected.value = i
}
const changePagSelected = (i: number) => {
  if (i > 0 && showRigthArrow.value) {
    paginationSelected.value = getStartPos() + i
  } else if (i < 0 && showLeftArrow.value) {
    paginationSelected.value = getStartPos() + i
  }
}

const getThumbnail = (imgUrl: string) => {
  const imgType = imgUrl.lastIndexOf('.')
  return `${imgUrl.slice(0, imgType)}s${imgUrl.slice(imgType)}`
}

const getLocalDateTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString()

const filter = (event: any) => {
  query.value = event.target.value.toLowerCase()
}
const clear = () => {
  query.value = ''
}
// const fileSafeQuery = computed(() =>
//   query.value.replace(/[^a-z0-9]/gi, '_').toLowerCase()
// )

// const getImgUrls = (tag: any) => {
//   const data: any[] = []
//   const pushImg = (prop: string, name: string) => {
//     data.push([
//       tag[prop],
//       `tag-${tag.tagnumber}-${name}${tag[prop].slice(
//         tag[prop].lastIndexOf('.')
//       )}`
//     ])
//   }
//   if (tag.foundImageUrl) {
//     pushImg('foundImageUrl', 'found-image')
//   }
//   if (tag.mysteryImageUrl) {
//     pushImg('mysteryImageUrl', 'mystery-image')
//   }
//   return data
// }

onMounted(() => {
  const searchBar = document.getElementById('search-bar')
  if (searchBar) {
    searchBar.addEventListener('ion-input', filter)
    searchBar.addEventListener('ion-clear', clear)
  }
})
onBeforeUnmount(() => {
  const searchBar = document.getElementById('search-bar')
  if (searchBar) {
    searchBar.removeEventListener('ion-input', filter)
    searchBar.removeEventListener('ion-clear', clear)
  }
})
</script>

<template>
  <div>
    <div class="mt-8"></div>

    <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
        >
          <table class="min-w-full">
            <thead>
              <tr>
                <th
                  class="px-3 md:px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Number
                </th>
                <th
                  class="pl-0 md:pl-2 lg:px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Mystery Tag
                </th>
                <th
                  class="pl-2 lg:px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Found Tag
                </th>
                <th
                  class="px-6 py-3 hidden lg:table-cell text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Hint
                </th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(tag, index) in shownTags" :key="index">
                <td
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="text-sm leading-5 text-gray-900">
                    {{ tag.tagnumber }}
                  </div>
                </td>

                <td
                  class="lg:px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div
                    class="flex items-center justify-center md:justify-start"
                  >
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        v-if="tag.mysteryImageUrl"
                        class="w-10 h-10 rounded-full"
                        :src="getThumbnail(tag.mysteryImageUrl)"
                        alt="Mystery Image"
                      />
                    </div>

                    <div class="ml-4 hidden md:table-cell">
                      <div
                        v-if="tag.mysteryPlayer"
                        class="text-sm font-medium leading-5 text-gray-900"
                      >
                        {{ tag.mysteryPlayer }}
                      </div>
                      <div
                        v-if="tag.mysteryTime"
                        class="text-sm leading-5 text-gray-500"
                      >
                        {{ getLocalDateTime(tag.mysteryTime) }}
                      </div>
                    </div>
                  </div>
                </td>

                <td
                  class="lg:px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div
                    class="flex items-center justify-center md:justify-start"
                  >
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        v-if="tag.foundImageUrl"
                        class="w-10 h-10 rounded-full"
                        :src="getThumbnail(tag.foundImageUrl)"
                        alt="Found Image"
                      />
                    </div>

                    <div class="ml-4 hidden md:table-cell">
                      <div
                        v-if="tag.foundPlayer"
                        class="text-sm font-medium leading-5 text-gray-900"
                      >
                        {{ tag.foundPlayer }}
                      </div>
                      <div
                        v-if="tag.foundTime"
                        class="text-sm leading-5 text-gray-500"
                      >
                        {{ getLocalDateTime(tag.foundTime) }}
                      </div>
                    </div>
                  </div>
                </td>

                <td
                  class="px-6 py-4 hidden lg:table-cell break-words border-b border-gray-200 whitespace-nowrap"
                >
                  <p
                    v-if="tag.hint"
                    class="text-sm leading-5 text-gray-900 break-all whitespace-pre-wrap"
                  >
                    {{ tag.hint }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      class="sm:flex-1 flex items-center sm:items-around flex-col sm:flex-row sm:justify-between m-auto"
    >
      <div class="mt-3 ms:mt-0">
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium"> {{ paginationSelected * splitBy }} </span>
          to
          <span class="font-medium">
            {{ Math.min(paginationSelected * splitBy + splitBy, tags.length) }}
          </span>
          of
          <span class="font-medium"> {{ tags.length }} </span>
          results
        </p>
      </div>
      <div v-if="paginationArray.length" class="mt-3 ms:mt-0">
        <nav
          class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            :disabled="!showLeftArrow"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            @click="changePagSelected(-4)"
          >
            <span class="sr-only">Previous</span>
            <v-icon icon="mdi-arrow-left-circle-outline" />
          </button>
          <template v-for="val in paginationArray" :key="val">
            <button
              :class="
                (val - 1 === paginationSelected
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50') +
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
              "
              @click="() => setPagSelected(val - 1)"
            >
              {{ val }}
            </button>
          </template>
          <button
            :disabled="!showRigthArrow"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            @click="changePagSelected(4)"
          >
            <span class="sr-only">Next</span>
            <v-icon icon="mdi-arrow-right-circle-outline" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
