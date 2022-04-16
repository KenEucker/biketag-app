<script setup lang="ts">
import { ref } from 'vue'
import { IonModal, IonIcon, IonButton } from '@ionic/vue'
import { useBikeTagApiStore } from '@/store/biketag'
import { useRouter } from 'vue-router'
import TagForm from '../components/TagForm.vue'
import { create } from 'ionicons/icons'

const modalIsOpen = ref(false)
const selectedGameIndex = ref(0)
const biketag = useBikeTagApiStore()
biketag.setTagsFromGame(useRouter().currentRoute.value.params.name as string)

const showModal = (index: number) => {
  selectedGameIndex.value = index
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
</script>

<template>
  <div>
    <ion-modal :is-open="modalIsOpen" @did-dismiss="closeModal()">
      <tag-form
        :gameName="($route.params.name as string)"
        :tag="biketag.tags($route.params.name)[selectedGameIndex]"
        @on-close="closeModal"
      />
    </ion-modal>

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
                v-for="(tag, index) in biketag.tags($route.params.name)"
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
  </div>
</template>
