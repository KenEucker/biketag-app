<script setup lang="ts">
import { ref } from 'vue'
import Banner from '../components/Banner.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { Tag } from 'biketag/lib/common/schema'
import { IonModal } from '@ionic/vue'
import TagForm from '../components/TagForm.vue'

const modalIsOpen = ref(false)
const selectedGameIndex = ref(0)

const showModal = (index: number) => {
  selectedGameIndex.value = index
  modalIsOpen.value = true
}

const closeModal = () => {
  modalIsOpen.value = false
}

const getAllTags = () => {
    const gameName = ref.prototype.$route.params.name
    return ref<Tag[]>()
}
const getLocalDateTime = (timestamp : number) => new Date(timestamp * 1000).toLocaleTimeString() 

const tags = getAllTags()
</script>

<template>
  <div>
    <ion-modal :is-open="modalIsOpen" @did-dismiss="closeModal()">
      <tag-form :tag="tags[selectedGameIndex]" @on-close="closeModal" />
    </ion-modal>

    <Breadcrumb breadcrumb="" />
    <!--Banner get you to github repo-->
    <Banner />
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
                  Found Tag
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Mystery Tag
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Number
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  GPS
                </th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(tag, index) in tags" :key="index">

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        class="w-10 h-10 rounded-full"
                        :src="tag.foundImage"
                        alt="Found Image"
                      />
                    </div>

                    <div class="ml-4">
                      <div class="text-sm font-medium leading-5 text-gray-900">
                        {{ tag.foundPlayer }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        {{ getLocalDateTime(tag.foundTime) }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        class="w-10 h-10 rounded-full"
                        :src="tag.mysteryImage"
                        alt="Mystery Image"
                      />
                    </div>

                    <div class="ml-4">
                      <div class="text-sm font-medium leading-5 text-gray-900">
                        {{ tag.mysteryPlayer }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        {{ getLocalDateTime(tag.mysteryTime) }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ tag.tagnumber }}
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
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
                      <a @click="() => showModal(index)" href="#" class="px-2 mx-2 rounded-md"
                        ><svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-5 h-5 text-green-700"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
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
