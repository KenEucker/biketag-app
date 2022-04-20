<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { IonModal, IonIcon, IonButton } from '@ionic/vue'
import { useBikeTagApiStore } from '@/store/biketag'
import { useRouter } from 'vue-router'
import TagForm from '@/components/TagForm.vue'
import { create, arrowBackOutline, arrowForwardOutline } from 'ionicons/icons'
import ExportForm from '@/components/ExportForm.vue'

const modalIsOpen = ref(false)
const selectedTagIndex = ref(0)
const routeParam = useRouter().currentRoute.value.params.name
const biketag = useBikeTagApiStore()
const query = ref("")
const splitBy = ref(20)
const tags = ref(biketag.tags(routeParam))
const tagsFiltered = computed(() => tags.value.filter(
  (val : any) => !query ? true : (
    val?.mysteryPlayer?.toLowerCase().indexOf(query.value) > -1 || 
    val?.foundPlayer?.toLowerCase().indexOf(query.value) > -1)
))
const shownTags = computed(() => tagsFiltered.value.slice(
    paginationSelected.value * splitBy.value, 
    paginationSelected.value * splitBy.value + splitBy.value
  )
)
biketag.setTagsFromGame(routeParam as string).
  then(() => tags.value = biketag.tags(routeParam))
const paginationSelected = ref(0)
const split = computed(() => Math.ceil(tagsFiltered.value.length / splitBy.value))
const getStartPos = () => Math.trunc(paginationSelected.value/4)*4
const showRigthArrow = computed(() => {
  return paginationSelected.value + 4 < split.value
})
const showLeftArrow = computed(() => {
  return paginationSelected.value - 4 >= 0
})
const paginationArray = computed(() => {
  const pagination = Array.from(Array(split.value).keys()).map(x => x + 1)
  const start_p = getStartPos()
  return pagination.slice(start_p, start_p+4)
})
const setPagSelected = (i : number) => {
  paginationSelected.value = i
}
const changePagSelected = (i : number) => {
  if (i > 0 && showRigthArrow.value) {
    paginationSelected.value = getStartPos() + i;
  } else if (i < 0 && showLeftArrow.value) {
    paginationSelected.value = getStartPos() + i;
  }
}

const showModal = (index: number) => {
  selectedTagIndex.value = index
  modalIsOpen.value = true
}

const closeModal = () => {
  modalIsOpen.value = false
}

const getThumbnail = (imgUrl: string) => {
  const imgType = imgUrl.lastIndexOf('.')
  return `${imgUrl.slice(0, imgType)}s${imgUrl.slice(imgType)}`
}

const getLocalDateTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString()

const filter = (event : any) => {
  query.value = event.target.value.toLowerCase()
}
const clear = () => {
  query.value = ""
}
const fileSafeQuery = computed(() => 
  query.value.replace(/[^a-z0-9]/gi, '_').toLowerCase())

onMounted(() => {
  const searchBar = document.getElementById("search-bar")
  if (searchBar) {
    searchBar.addEventListener("ion-input", filter)
    searchBar.addEventListener("ion-clear", clear) 
  }
})
onBeforeUnmount(() => {
  const searchBar = document.getElementById("search-bar")
  if (searchBar) {
    searchBar.removeEventListener("ion-input", filter)
    searchBar.removeEventListener("ion-clear", clear) 
  }
})
</script>

<template>
  <div>
    <ion-modal :is-open="modalIsOpen" @did-dismiss="closeModal()">
      <tag-form
        :gameName="($route.params.name as string)"
        :tag="tags[selectedTagIndex]"
        @on-close="closeModal"
      />
    </ion-modal>
    <export-form 
      :info="`${($route.params.name as string).toLowerCase()}-tags${'--' + fileSafeQuery}`" 
      :data="tagsFiltered"/>
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
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Number
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Mystery Tag
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Found Tag
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  GPS Location
                </th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr
                v-for="(tag, index) in shownTags"
                :key="index"
              >

                <td
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="text-sm leading-5 text-gray-900">
                    {{ tag.tagnumber }}
                  </div>
                </td>
                
                <td
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        v-if="tag.mysteryImageUrl"
                        class="w-10 h-10 rounded-full"
                        :src="getThumbnail(tag.mysteryImageUrl)"
                        alt="Mystery Image"
                      />
                    </div>

                    <div class="ml-4">
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
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        v-if="tag.foundImageUrl"
                        class="w-10 h-10 rounded-full"
                        :src="getThumbnail(tag.foundImageUrl)"
                        alt="Found Image"
                      />
                    </div>

                    <div class="ml-4">
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
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="text-sm leading-5 text-gray-900">
                    Lat : {{ tag.gps.lat }}
                  </div>
                  <div class="text-sm leading-5 text-gray-500">
                    Long : {{ tag.gps.long }}
                  </div>
                </td>

                <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="flex justify-around">
                    <span class="flex justify-center text-yellow-500">
                      <ion-button
                        fill="clear"
                        @click="() => showModal(index)"
                        class="px-2 mx-2 rounded-md"
                      >
                        <ion-icon :icon="create"></ion-icon>
                      </ion-button>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="sm:flex-1 sm:flex sm:items-center sm:justify-between ion-margin">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium"> {{ paginationSelected * splitBy }} </span>
          to
          <span class="font-medium"> {{ Math.min(paginationSelected * splitBy + splitBy, tags.length) }} </span>
          of
          <span class="font-medium"> {{ tags.length }} </span>
          results
        </p>
      </div>
      <div v-if="paginationArray.length">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button :disabled="!showLeftArrow"
            @click="changePagSelected(-4)" 
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Previous</span>
            <ion-icon :icon="arrowBackOutline" />
          </button>
          <template v-for="(val, index) in paginationArray" :key="val">
            <button
              :class="(val - 1 === paginationSelected ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50') + 'relative inline-flex items-center px-4 py-2 border text-sm font-medium'"
              @click="() => setPagSelected(val - 1)" > {{ val }} </button>
          </template>
          <button :disabled="!showRigthArrow" 
            @click="changePagSelected(4)" 
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Next</span>
            <ion-icon :icon="arrowForwardOutline" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
