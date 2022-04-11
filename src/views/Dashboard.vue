<script setup lang="ts">
import { ref } from 'vue'
import Banner from '../components/Banner.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { Game } from 'biketag/lib/common/schema';
import { IonModal } from '@ionic/vue'
import GameForm from '../components/TagForm.vue'

const modalIsOpen = ref(false)
const selectedGameIndex = ref(0)

const showModal = (index: number) => {
  selectedGameIndex.value = index
  modalIsOpen.value = true
}

const closeModal = () => {
  modalIsOpen.value = false
}

const getLogoUrl = (
  logo: string,
  size = '',
  sanityBaseCDNUrl = 'https://cdn.sanity.io/images/x37ikhvs/production/'
) => {
  switch (size) {
    case 'l':
      size = 'h=512'
      break
    case 'm':
      size = 'h=256'
      break
    case 's':
      size = 'h=192'
      break
    default:
      size = 'h=45'
      break
  }
  return `${sanityBaseCDNUrl}${logo
    .replace('image-', '')
    .replace('-png', '.png')
    .replace('-jpg', '.jpg')}${size.length ? `?${size}` : ''}`
}

const getAllGames = () => {
    return ref<Game[]>()
}

const games = getAllGames()
</script>

<template>
  <div>
    <ion-modal :is-open="modalIsOpen" @did-dismiss="closeModal()">
      <game-form :tag="games[selectedGameIndex]" @on-close="closeModal" />
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
                  Name
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Region
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Hashes
                </th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(game, index) in games" :key="index">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        class="w-10 h-10 rounded-full"
                        :src="getLogoUrl(game.logo)"
                        :alt="`${game.name} Logo`"
                      />
                    </div>

                    <div class="ml-4">
                      <div class="text-sm font-medium leading-5 text-gray-900">
                        {{ game.slug }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        {{ game.name }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ game.region }}
                  </div>
                  <div class="text-sm leading-5 text-gray-500">
                    Lat : {{ game.boundary.geo.lat }} Long : {{ game.boundary.geo.long }}
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ game.mainhash }}
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
                      <a @click="() => $router.push(`/game/${game.name}`)">
                        <svg  
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-5 h-5 text-blue-700"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                            <path d="M384 320c-17.67 0-32 14.33-32 32v96H64V160h96c17.67 0 32-14.32 32-32s-14.33-32-32-32L64 96c-35.35 0-64 28.65-64 64V448c0 35.34 28.65 64 64 64h288c35.35 0 64-28.66 64-64v-96C416 334.3 401.7 320 384 320zM488 0H352c-12.94 0-24.62 7.797-29.56 19.75c-4.969 11.97-2.219 25.72 6.938 34.88L370.8 96L169.4 297.4c-12.5 12.5-12.5 32.75 0 45.25C175.6 348.9 183.8 352 192 352s16.38-3.125 22.62-9.375L416 141.3l41.38 41.38c9.156 9.141 22.88 11.84 34.88 6.938C504.2 184.6 512 172.9 512 160V24C512 10.74 501.3 0 488 0z"/>
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
