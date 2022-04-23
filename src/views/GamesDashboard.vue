<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { IonModal, IonIcon, IonButton, IonSearchbar } from "@ionic/vue";
import { useBikeTagApiStore } from "@/store/biketag";
import GameForm from "../components/GameForm.vue";
import { create, linkOutline, arrowBackOutline, arrowForwardOutline } from "ionicons/icons";

const modalIsOpen = ref(false)
const selectedGameIndex = ref(0)
const biketag = useBikeTagApiStore()
const query = ref("")
const splitBy = ref(20)
const games = ref(biketag.allGames)
const gamesFiltered = computed(() => games.value.filter(
  (val) => !query ? true : val.name.toLowerCase().indexOf(query.value) > -1
))
const paginationSelected = ref(0)
const split = computed(() => Math.ceil(gamesFiltered.value.length / splitBy.value))
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
const shownGames = computed(() => gamesFiltered.value.slice(
    paginationSelected.value * splitBy.value, 
    paginationSelected.value * splitBy.value + splitBy.value
  )
)

biketag.setGames().then(() => games.value = biketag.allGames)
const showModal = (index: number) => {
  selectedGameIndex.value = index
  modalIsOpen.value = true
};
const closeModal = () => {
  modalIsOpen.value = false
};

const filter = (event : any) => {
  query.value = event.target.value.toLowerCase()
  // games.value = biketag.allGames.filter((val) => val.name.toLowerCase().indexOf(query) > -1)
}
const clear = () => {
  query.value = ""
  // games.value = biketag.allGames
}

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
      <game-form :game="games[selectedGameIndex]" @on-close="closeModal" />
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
                  class="px-6 py-3 hidden md:table-cell text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Region
                </th>
                <th
                  class="px-6 py-3 hidden lg:table-cell text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  Main Album Hash
                </th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(game, index) in shownGames" :key="index">
                <td class="pl-2 sm:px-6 py-4 border-b border-gray-200 whitespace-nowrap">
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

                <td class="px-6 py-4 hidden md:table-cell border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ game.region.description }}
                  </div>
                  <div
                    v-if="Object.keys(game.boundary).length"
                    class="text-sm leading-5 text-gray-500"
                  >
                    Lat : {{ game.boundary.lat }} Long : {{ game.boundary.long }}
                  </div>
                </td>

                <td class="px-6 py-4 hidden lg:table-cell border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ game.mainhash }}
                  </div>
                </td>

                <td
                  class="py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="flex justify-around">
                    <span class="flex justify-center text-yellow-500">
                      <ion-button
                        fill="clear"
                        @click.prevent="() => showModal(index)"
                        class="rounded-md"
                      >
                        <ion-icon :icon="create"></ion-icon>
                      </ion-button>
                      <ion-button
                        fill="clear"
                        @click.prevent="() => $router.push(`/games/${game.name}`)"
                        class="ml-2 rounded-md"
                      >
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
    
    <div class="sm:flex-1 flex items-center sm:items-around flex-col sm:flex-row sm:justify-between ion-margin">
      <div class="mt-3 ms:mt-0">
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium"> {{ paginationSelected * splitBy }} </span>
          to
          <span class="font-medium"> {{ Math.min(paginationSelected * splitBy + splitBy, games.length) }} </span>
          of
          <span class="font-medium"> {{ games.length }} </span>
          results
        </p>
      </div>
      <div v-if="paginationArray.length" class="mt-3 ms:mt-0">
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
