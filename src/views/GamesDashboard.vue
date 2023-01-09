<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useBikeTagStore } from '@/store'
import GameForm from '@/components/biketag/GameForm.vue'
import GameCreationForm from '../components/biketag/GameCreationForm.vue'
import AmbassadorForm from '@/components/biketag/AmbassadorForm.vue'

const modalIsOpen = ref(false)
const creationModalIsOpen = ref(false)
const ambassadorModalIsOpen = ref(false)
const selectedGameIndex = ref(0)
const biketag = useBikeTagStore()
const query = ref('')
const splitBy = ref(20)
const games = ref(biketag.allGames)
const gamesFiltered = computed(() =>
  games.value.filter((val) =>
    !query.value ? true : val.name.toLowerCase().indexOf(query.value) > -1
  )
)
const paginationSelected = ref(0)
const split = computed(() =>
  Math.ceil(gamesFiltered.value.length / splitBy.value)
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
const shownGames = computed(() =>
  gamesFiltered.value.slice(
    paginationSelected.value * splitBy.value,
    paginationSelected.value * splitBy.value + splitBy.value
  )
)

biketag.setGames().then(() => (games.value = biketag.allGames))
const showModal = (index: number) => {
  selectedGameIndex.value = index
  modalIsOpen.value = true
}
const closeModal = () => {
  modalIsOpen.value = false
}
const showCreationModal = () => {
  creationModalIsOpen.value = true
}
const closeCreationModal = () => {
  creationModalIsOpen.value = false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filter = (event: any) => {
  query.value = event.target.value.toLowerCase()
  // games.value = biketag.allGames.filter((val) => val.name.toLowerCase().indexOf(query) > -1)
}
const clear = () => {
  query.value = ''
  // games.value = biketag.allGames
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getGameUrl = (game: any) => `https://${game.slug}.biketag.${'io'}`

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
    <v-modal :is-open="modalIsOpen" @did-dismiss="closeModal">
      <game-form :game="games[selectedGameIndex]" @on-close="closeModal" />
    </v-modal>
    <v-modal :is-open="creationModalIsOpen" @did-dismiss="closeCreationModal">
      <game-creation-form @on-close="closeCreationModal" />
    </v-modal>
    <v-modal :is-open="ambassadorModalIsOpen" @did-dismiss="closeCreationModal">
      <ambassador-form @on-close="() => (ambassadorModalIsOpen = false)" />
    </v-modal>

    <div class="flex justify-center md:justify-start">
      <v-btn @click="() => (ambassadorModalIsOpen = true)">
        Create Ambassador
      </v-btn>
    </div>

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
                  Site
                </th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50">
                  <v-btn fill="clear" @click="showCreationModal">
                    <v-icon icon="mdi-plus-circle-outline"></v-icon>
                  </v-btn>
                </th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(game, index) in shownGames" :key="index">
                <td
                  class="pl-2 sm:px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
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

                <td
                  class="px-6 py-4 hidden md:table-cell border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="text-sm leading-5 text-gray-900">
                    {{ game.region.description }}
                  </div>
                  <div
                    v-if="Object.keys(game.boundary).length"
                    class="text-sm leading-5 text-gray-500"
                  >
                    Lat : {{ game.boundary.lat }} Long :
                    {{ game.boundary.long }}
                  </div>
                </td>

                <td
                  class="px-6 py-4 hidden lg:table-cell border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="text-sm leading-5 text-gray-900">
                    <a :href="getGameUrl(game)">{{ getGameUrl(game) }}</a>
                  </div>
                </td>

                <td
                  class="py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="flex justify-around">
                    <span class="flex justify-center text-yellow-500">
                      <v-btn
                        fill="clear"
                        class="rounded-md"
                        @click.prevent="() => showModal(index)"
                      >
                        <v-icon icon="mdi-cog-outline" />
                      </v-btn>
                      <v-btn
                        fill="clear"
                        class="ml-2 rounded-md"
                        @click.prevent="
                          () => $router.push(`/games/${game.name}`)
                        "
                      >
                        <v-icon icon="mdi-tag-multiple" />
                      </v-btn>
                    </span>
                  </div>
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
            {{ Math.min(paginationSelected * splitBy + splitBy, games.length) }}
          </span>
          of
          <span class="font-medium"> {{ games.length }} </span>
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
