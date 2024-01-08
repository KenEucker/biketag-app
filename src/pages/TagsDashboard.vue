<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useBikeTagStore } from 'src/stores/biketag';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getThumbnail, getLocalDateTime } from 'src/utils/global';

type StateType = {
  searchTag: string;
};

const route = useRoute();
const router = useRouter();
const bikeTagStore = useBikeTagStore();

const state = reactive<StateType>({
  searchTag: '',
});

// pagination component props
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  // rowsNumber: 10
});
const rowsPerPageOptions = ref([5, 10, 15, 25, 50]);

onMounted(async () => {
  if (route.params.name) {
    await bikeTagStore.fetchTagsList(
      route.params.name as string,
      route.params.mainhash as string
    );
  }
});

// data table data using computed
const rows = computed((): QTableProps['rows'] => {
  if (state.searchTag) {
    return bikeTagStore.getGamesTag.filter((item) => {
      if (item.name) {
        return (
          item.name.toLowerCase().indexOf(state.searchTag.toLowerCase()) > -1
        );
      }
    });
  } else {
    return bikeTagStore.getGamesTag;
  }
});
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
    {
      name: 'gpsLocation',
      align: 'left',
      label: 'GPS Location',
      field: 'gpsLocation',
      sortable: true,
    },
    {
      name: 'action',
      align: 'center',
      label: 'Action',
      field: 'action',
    },
  ];
});
const pagesNumber = computed(() => {
  if (rows.value?.length) {
    return Math.ceil(rows.value.length / pagination.value.rowsPerPage);
  }
  return 0;
});
const onUpdatePage = async (props: number) => {
  if (route.params.name) {
    await bikeTagStore.fetchTagsList(
      route.params.name as string,
      route.params.mainhash as string
    );
  }
};
const onPagePerItem = (perItem: number) => {
  pagination.value.rowsPerPage = perItem;
  pagination.value.page = 1;
};

onUnmounted(() => {
  bikeTagStore.$state.gamesTag = [];
});
</script>
<template>
  <q-card flat bordered class="mb-10">
    <div class="grid grid-cols-6 gap-x-4 my-3 px-4 md:grid-cols-6">
      <p
        class="font-medium text-lg text-primary-400 col-span-1 md:col-start-1 pt-1 md:pt-0"
      >
        <q-btn
          dense
          round
          flat
          size="md"
          icon="arrow_back"
          @click="router.push('/games')"
        ></q-btn>
      </p>
      <q-input
        outlined
        dense
        clearable
        debounce="400"
        v-model="state.searchTag"
        class="md:col-start-11 md:col-span-2 col-start-3 col-span-10 w-full md:w-auto"
        placeholder="Search"
        rounded
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-table
      :loading="bikeTagStore.getGamesLoader"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="state.searchTag"
      title-class="primary"
      table-header-class="bg-gray-100"
      v-model:pagination="pagination"
      hide-pagination
    >
      <template #header="props">
        <q-tr class="bg-gray-100 text-gray-500 uppercase">
          <q-th :props="props" key="number" rowspan="2">Number</q-th>
          <q-th :props="props" key="mysteryTag" rowspan="2">Mystery tag</q-th>
          <q-th :props="props" key="foundTag" rowspan="2">Found tag</q-th>
          <q-th :props="props" key="gpsLocation" rowspan="2">GPS Location</q-th>
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
          ></q-btn>
          <q-btn
            dense
            round
            flat
            class="text-primary"
            size="md"
            icon="o_broken_image"
          ></q-btn>
        </q-td>
      </template>
      <template #body-cell-mysteryTag="props">
        <q-td :props="props" class="w-fit">
          <div class="!flex items-center">
            <q-avatar v-if="props.row.mysteryImageUrl">
              <q-img
                class="rounded-full"
                :ratio="1 / 1"
                :src="getThumbnail(props.row.mysteryImageUrl)"
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
                class="text-start text-md font-medium truncate"
                v-if="props.row.mysteryPlayer"
              >
                {{ props.row.mysteryPlayer }}
              </p>
              <p
                class="text-start text-xs text-gray-500"
                v-if="props.row.mysteryTime"
              >
                {{ getLocalDateTime(props.row.mysteryTime) }}
              </p>
            </div>
          </div>
        </q-td>
      </template>
      <template #body-cell-foundTag="props">
        <q-td :props="props">
          <div class="!flex items-center">
            <q-avatar v-if="props.row.foundImageUrl">
              <q-img
                class="rounded-full"
                :ratio="1 / 1"
                :src="getThumbnail(props.row.foundImageUrl)"
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
                class="text-start text-md font-medium"
                v-if="props.row.foundPlayer"
              >
                {{ props.row.foundPlayer }}
              </p>
              <p
                class="text-start text-xs text-gray-500"
                v-if="props.row.foundTime"
              >
                {{ getLocalDateTime(props.row.foundTime) }}
              </p>
            </div>
          </div>
        </q-td>
      </template>
      <template #body-cell-gpsLocation="props">
        <q-td :props="props">
          <p>Lat: {{ props.row.gps.lat }}</p>
          <p class="text-gray-500">Long: {{ props.row.gps.long }}</p>
        </q-td>
      </template>
      <template #bottom>
        <div class="md:flex md:items-center md:justify-between w-full">
          <div class="font-medium md:!block !hidden">
            Total row count: {{ bikeTagStore.getGamesTag.length }}
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
              class="px-1 my-2 md:my-0 md:px-0 border-black md:border-0 rounded-md w-full"
            >
              <template #prepend>
                <span class="text-caption text-primary-100 font-medium"
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
</template>
