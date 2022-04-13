<script setup lang="ts">
import { ref } from 'vue'
import { IonModal, IonIcon, IonButton } from '@ionic/vue'
import { useBikeTagApiStore } from '@/store/biketag';
import GameForm from '../components/GameForm.vue'
import { create, linkOutline } from 'ionicons/icons'

const modalIsOpen = ref(false)
const selectedGameIndex = ref(0)
const biketag = useBikeTagApiStore()
biketag.setGames()

const showModal = (index: number) => {
  selectedGameIndex.value = index
  modalIsOpen.value = true
}

const closeModal = () => {
  modalIsOpen.value = false
}
</script>

<template>
  <div>
    <ion-modal :is-open="modalIsOpen" @did-dismiss="closeModal()">
      <game-form :game="biketag.allGames[selectedGameIndex]" @on-close="closeModal" />
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
              <tr v-for="(game, index) in biketag.allGames" :key="index">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        class="w-10 h-10 rounded-full"
                        :src="biketag.getLogoUrl(game.logo)"
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
                  <div v-if="Object.keys(game.boundary).length" class="text-sm leading-5 text-gray-500">
                    Lat : {{ game.boundary.lat }} Long : {{ game.boundary.lng }}
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
                      <ion-button fill="clear" @click.prevent="() => showModal(index)" class="px-2 mx-2 rounded-md">
                        <ion-icon :icon="create"></ion-icon>
                      </ion-button>
                      <ion-button fill="clear" @click.prevent="() => $router.push(`/games/${game.name}`)">
                        <ion-icon :icon="linkOutline"></ion-icon>
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
