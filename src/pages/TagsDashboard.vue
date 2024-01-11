<script setup lang="ts">
import { QTableProps } from 'quasar'
import { useBikeTagStore } from 'biketag-vue'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getThumbnail, getLocalDateTime } from 'src/utils/global'
import { useAuthStore } from 'src/stores/auth'
import ExportForm from 'src/components/ExportForm.vue'
import { Tag } from 'biketag/lib/common/schema'

type StateType = {
  searchTag: string
}

const route = useRoute()
const router = useRouter()
const bikeTagStore = useBikeTagStore()

const authStore = useAuthStore()

const isAuthenticated = computed(() => {
  return authStore.getIsAuthenticated
})

const state = reactive<StateType>({
  searchTag: '',
})

// image download loader
const downloadLoader = ref<boolean>(false)

// pagination component props
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  // rowsNumber: 10
})
const rowsPerPageOptions = ref([5, 10, 15, 25, 50])

onMounted(() => {
  nextTick(async () => {
    const name: string | null = (route?.params?.name as string) ?? null
    if (name) {
      await bikeTagStore.fetchAllGames()
      console.log('setting game', name)
      await bikeTagStore.setGame(name)
      await bikeTagStore.fetchTags()
    }
  })
})

// data table data using computed
const rows = computed(() => {
  if (state.searchTag) {
    return bikeTagStore.getTags.filter(
      (item: Tag) =>
        item?.name?.toLowerCase().indexOf(state.searchTag.toLowerCase()) > -1
    )
  }

  return bikeTagStore.getTags ?? []
})
const columns = computed((): QTableProps['columns'] => {
  return [
    {
      name: 'number',
      align: 'left',
      label: 'Number',
      field: (row: { tagnumber: string }): string => row.tagnumber,
      sortable: true,
    },
    {
      name: 'mysteryTag',
      align: 'left',
      label: 'Mystery tag',
      field: 'mysteryTag',
      sortable: true,
    },
    {
      name: 'foundTag',
      align: 'left',
      label: 'Found tag',
      field: 'foundTag',
      sortable: true,
    },
    isAuthenticated.value
      ? {
          name: 'gpsLocation',
          align: 'left',
          label: 'GPS Location',
          field: 'gpsLocation',
          sortable: true,
        }
      : {
          name: 'hint',
          align: 'left',
          label: 'Hint',
          field: 'hint',
          sortable: true,
        },
    {
      name: 'action',
      align: 'center',
      label: 'Action',
      field: 'action',
    },
  ]
})
const pagesNumber = computed(() => {
  if (rows.value?.length) {
    return Math.ceil(rows.value.length / pagination.value.rowsPerPage)
  }
  return 0
})
const onUpdatePage = async () => {
  //props: number) => {
  // if (route.params.name) {
  // await bikeTagStore.fetchTags()
  // }
}
const onPagePerItem = (perItem: number) => {
  pagination.value.rowsPerPage = perItem
  pagination.value.page = 1
}

onUnmounted(() => {
  /// unset tags?
})
</script>
<template>
  <div>
    <div class="flex justify-end">
      <export-form
        v-if="isAuthenticated"
        class="py-3 text-end"
        :data="rows"
        :info="`${(route.params.name as string).toLowerCase()}-tags`"
        v-model:download-loader="downloadLoader"
      ></export-form>
      <export-form
        class="py-3 text-end"
        :data="rows"
        download-type="all-images"
        v-model:download-loader="downloadLoader"
      ></export-form>
    </div>
    <q-card flat bordered class="mb-10">
      <div
        class="grid grid-cols-1 px-2 py-2 md:grid-cols-5 gap-x-4 bg-slate-200"
      >
        <p
          class="col-span-3 col-start-1 pt-2 text-lg font-medium text-primary-400"
        >
          <q-btn
            dense
            round
            flat
            size="md"
            icon="arrow_back"
            class="p-0 m-0"
            @click="router.push('/games')"
          ></q-btn>
          Tag List
        </p>
        <q-input
          outlined
          dense
          clearable
          debounce="400"
          v-model="state.searchTag"
          class="w-full col-start-4 md:col-start-6 md:w-auto"
          placeholder="Search"
          rounded
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-table
        :loading="downloadLoader"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :filter="state.searchTag"
        title-class="primary"
        table-header-class="bg-gray-100"
        v-model:pagination="pagination"
        hide-pagination
      >
        <template #loading>
          <q-inner-loading
            showing
            class="z-10 text-lg bg-slate-600 !bg-opacity-65 text-white font-semibold"
            :label="downloadLoader ? 'Downloading...' : ''"
          />
        </template>
        <template #header="props">
          <q-tr class="text-gray-500 uppercase bg-gray-100">
            <q-th :props="props" key="number" rowspan="2">Number</q-th>
            <q-th :props="props" key="mysteryTag" rowspan="2">Mystery tag</q-th>
            <q-th :props="props" key="foundTag" rowspan="2">Found tag</q-th>
            <q-th
              :props="props"
              key="gpsLocation"
              rowspan="2"
              v-if="isAuthenticated"
              >GPS Location</q-th
            >
            <q-th :props="props" key="hint" rowspan="2" class="w-[400px]" v-else
              >Hint</q-th
            >
            <q-th :props="props" key="action" style="text-align: center"></q-th>
          </q-tr>
        </template>
        <template #body-cell-action="props">
          <q-td :props="props">
            <q-btn
              dense
              round
              flat
              class="text-primary"
              size="md"
              icon="o_settings"
              v-if="isAuthenticated"
            ></q-btn>
            <export-form
              v-model:download-loader="downloadLoader"
              download-type="images"
              :tag="props.row"
            ></export-form>
          </q-td>
        </template>
        <template #body-cell-mysteryTag="props">
          <q-td :props="props" class="w-fit">
            <div class="!flex items-center">
              <q-avatar v-if="props.row.mysteryImageUrl">
                <q-img
                  class="rounded-full"
                  :ratio="1 / 1"
                  :src="getThumbnail(props.row.mysteryImageUrl ?? '')"
                >
                  <template v-slot:loading>
                    <q-skeleton width="35px" height="35px" />
                  </template>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center !bg-slate-300">
                      <q-icon
                        class="px-0 mx-0"
                        color="white"
                        name="image"
                        size="18px"
                      />
                    </div>
                  </template>
                </q-img>
              </q-avatar>
              <div class="ms-2">
                <p
                  class="font-medium truncate text-start text-md"
                  v-if="props.row.mysteryPlayer"
                >
                  {{ props.row.mysteryPlayer ?? '-' }}
                </p>
                <p
                  class="text-xs text-gray-500 text-start"
                  v-if="props.row.mysteryTime"
                >
                  {{
                    props.row.mysteryTime
                      ? getLocalDateTime(props.row.mysteryTime)
                      : '00:00:00'
                  }}
                </p>
              </div>
            </div>
          </q-td>
        </template>
        <template #body-cell-foundTag="props">
          <q-td :props="props">
            <div class="!flex items-center">
              <q-avatar>
                <q-img
                  class="rounded-full"
                  :ratio="1 / 1"
                  :src="getThumbnail(props.row.foundImageUrl ?? '')"
                >
                  <template v-slot:loading>
                    <q-skeleton width="35px" height="35px" />
                  </template>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center !bg-slate-300">
                      <q-icon
                        class="px-0 mx-0"
                        color="white"
                        name="image"
                        size="18px"
                      />
                    </div>
                  </template>
                </q-img>
              </q-avatar>
              <div class="ms-2">
                <p class="font-medium text-start text-md">
                  {{ props.row.foundPlayer ?? '-' }}
                </p>
                <p class="text-xs text-gray-500 text-start">
                  {{
                    props.row.foundTime
                      ? getLocalDateTime(props.row.foundTime)
                      : '00:00:00'
                  }}
                </p>
              </div>
            </div>
          </q-td>
        </template>
        <template #body-cell-gpsLocation="props" v-if="isAuthenticated">
          <q-td :props="props">
            <p>Lat: {{ props.row.gps.lat }}</p>
            <p class="text-gray-500">Long: {{ props.row.gps.long }}</p>
          </q-td>
        </template>
        <template #body-cell-hint="props" v-else>
          <q-td :props="props">
            <p
              class="text-sm leading-5 text-gray-900 break-all whitespace-pre-wrap min-w-64"
            >
              {{ props.row.hint }}
            </p>
          </q-td>
        </template>
        <template #bottom>
          <div class="w-full md:flex md:items-center md:justify-between">
            <div class="font-medium md:!block !hidden">
              Total row count: {{ bikeTagStore.getTags.length }}
            </div>
            <div class="!flex flex-row items-center justify-between">
              <q-select
                @update:model-value="onPagePerItem"
                dense
                flat
                hide-bottom-space
                borderless
                v-model="pagination.rowsPerPage"
                :options="rowsPerPageOptions"
                behavior="menu"
                :menu-offset="[0, 5]"
                popup-content-class="border"
                class="w-full px-1 my-2 border-black rounded-md md:my-0 md:px-0 md:border-0"
              >
                <template #prepend>
                  <span class="font-medium text-caption text-primary-100"
                    >Per page:</span
                  >
                </template>
              </q-select>
              <div>
                <q-pagination
                  @update:model-value="onUpdatePage"
                  v-model="pagination.page"
                  :max="pagesNumber"
                  color="black"
                  :max-pages="$q.platform.is.mobile ? 2 : 5"
                  size="md"
                  class="w-max"
                  direction-links
                />
              </div>
            </div>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>
