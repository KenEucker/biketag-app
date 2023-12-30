<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useBikeTagStore } from '~/store/biketag'
import { getLogoUrl } from '~/common/utils'
import GameForm from '~/components/GameForm.vue'
import GameCreationForm from '~/components/GameCreationForm.vue'
import AmbassadorForm from '~/components/AmbassadorForm.vue'
import Searchbar from '~/components/Searchbar.vue'

definePageMeta({
  layout: 'dashboard',
  showSearchBar: true,
})

const modalIsOpen = ref(false)
const creationModalIsOpen = ref(false)
const ambassadorModalIsOpen = ref(false)
const selectedGameIndex = ref(0)
const biketag = useBikeTagStore()
const query = ref('')
const games = ref(biketag.allGames)
const page = ref(1)
const pageCount = 20
const gamesFiltered = computed(() =>
  games.value.filter((val) =>
    !query ? true : val.name.toLowerCase().indexOf(query.value) > -1
  )
)
const gameColumns = [{
  key: 'logo',
  label: ''
}, {
  key: 'name',
  label: 'Game'
}, {
  key: 'slug',
  label: 'Website'
}, {
  key: 'actions',
  label: '...'
}]
const shownGames = computed(() =>
  gamesFiltered.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
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

const filter = (event: any) => {
  query.value = event.target.value.toLowerCase()
  // games.value = biketag.allGames.filter((val) => val.name.toLowerCase().indexOf(query) > -1)
}
const clear = () => {
  query.value = ''
  // games.value = biketag.allGames
}

const getGameUrl = (game: any) => `https://${ game.slug }.biketag.${'org'}`

onMounted(() => {
  // const searchBar = document.getElementById('search-bar')
  // if (searchBar) {
  //   searchBar.addEventListener('input', filter)
  //   searchBar.addEventListener('clear', clear)
  // }
})
onBeforeUnmount(() => {
  // const searchBar = document.getElementById('search-bar')
  // if (searchBar) {
  //   searchBar.removeEventListener('input', filter)
  //   searchBar.removeEventListener('clear', clear)
  // }
})
</script>

<template>
  <div>
    <!-- <modal :is-open="modalIsOpen" @did-dismiss="closeModal">
      <game-form :game="games[selectedGameIndex]" @on-close="closeModal" />
    </modal>
    <modal :is-open="creationModalIsOpen" @did-dismiss="closeCreationModal">
      <game-creatform @on-close="closeCreationModal"/>
    </modal>
    <modal :is-open="ambassadorModalIsOpen" @did-dismiss="closeCreationModal">
      <ambassador-form @on-close="() => ambassadorModalIsOpen = false"/>
    </modal> -->

    <div class="flex justify-center md:justify-start">
      <u-button @click="() => ambassadorModalIsOpen = true"> 
        Create Ambassador
      </u-button>
    </div>

    <div class="mt-8"></div>

    <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
        >
          <u-table :rows="shownGames" :columns="gameColumns">
            <template #logo-data="{ row }">
              <img :src="getLogoUrl(row.logo)" :alt="`BikeTag ${row.name} logo`"/>
            </template>

            <template #logo-slug="{ row }">
              <a :href="getGameUrl(row)">{{ getGameUrl(row) }}</a>
            </template>

            <template #actions-data="{ row }">
              <span class="flex justify-center text-yellow-500">
                <u-button
                  fill="clear"
                  @click.prevent="() => showModal(row)"
                  class="rounded-md"
                >
                  <Icon name="ic:outline-settings" />
                </u-button>
                <u-button
                  fill="clear"
                  @click.prevent="
                    () => $router.push(`/games/${row.name}`)
                  "
                  class="ml-2 rounded-md"
                >
                  <Icon name="ic:twotone-photo-library" />
                </u-button>
              </span>
            </template>
          </u-table>
          <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <u-pagination v-model="page" :page-count="pageCount" :total="shownGames.length" />
          </div>
          <!-- <table class="min-w-full">
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
                  <u-button fill="clear" @click="showCreationModal">
                    addCircleOutline
                  </u-button>
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
                      <u-button
                        fill="clear"
                        @click.prevent="() => showModal(index)"
                        class="rounded-md"
                      >
                        settingsOutline
                      </u-button>
                      <u-button
                        fill="clear"
                        @click.prevent="
                          () => $router.push(`/games/${game.name}`)
                        "
                        class="ml-2 rounded-md"
                      >
                        pricetagsOutline
                      </u-button>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table> -->
        </div>
      </div>
    </div>
  </div>
</template>
