<script setup lang="ts">
import { Game } from 'biketag/lib/common/schema';
import { QTableProps } from 'quasar';
import { useBikeTagStore } from 'src/stores/biketag';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getLogoUrl } from 'src/utils/global';

type StateType = {
  searchGame: string;
};

const bikeTagStore = useBikeTagStore();

const router = useRouter();

// state for binding
const state = reactive<StateType>({
  searchGame: '',
});

// pagination component props
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  // rowsNumber: 10
});
const rowsPerPageOptions = ref([5, 10, 15, 25, 50]);

onMounted(async () => {
  // Get game list
  await bikeTagStore.fetchGamesList();
});

// data table data using computed
const rows = computed((): QTableProps['rows'] => {
  if (state.searchGame) {
    return bikeTagStore.getGames.filter((item) => {
      if (item.name) {
        return item.name.toLowerCase().indexOf(state.searchGame.toLowerCase()) > -1;
      }
    });
  } else {
    return bikeTagStore.getGames;
  }
});
const columns = computed((): QTableProps['columns'] => {
  return [
    {
      name: 'name',
      align: 'left',
      label: 'Name',
      field: (row: { name: string }): string => row.name,
      sortable: true,
    },
    {
      name: 'region',
      align: 'left',
      label: 'Region',
      field: 'region',
      sortable: true,
    },
    {
      name: 'site',
      align: 'left',
      label: 'Site',
      field: 'site',
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

// total page number for pagination
const pagesNumber = computed(() => {
  if (rows.value?.length) {
    return Math.ceil(rows.value.length / pagination.value.rowsPerPage);
  }
  return 0;
});
const onUpdatePage = async (props: number) => {
  await bikeTagStore.fetchGamesList();
};
const onPagePerItem = (perItem: number) => {
  pagination.value.rowsPerPage = perItem;
  pagination.value.page = 1;
};

const getGameUrl = (game: Game): string => `https://${game.slug}.biketag.${'io'}`;
</script>
<template>
  <q-card flat bordered class="mb-10">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-x-4 py-2 px-2 bg-slate-200">
      <p class="font-medium text-lg text-primary-400 col-span-3 col-start-1 pt-2">
        Game List
      </p>
      <q-input
        outlined
        dense
        clearable
        debounce="400"
        v-model="state.searchGame"
        class="md:col-start-6 col-start-4"
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
      :filter="state.searchGame"
      title-class="primary"
      table-header-class="bg-gray-100"
      v-model:pagination="pagination"
      hide-pagination
    >
      <template #header="props">
        <q-tr class="bg-gray-100 text-gray-500 uppercase h-md">
          <!-- <q-th :props="props" key="id" rowspan="2">Id</q-th> -->
          <q-th :props="props" key="name" rowspan="2">Name</q-th>
          <q-th :props="props" key="region" rowspan="2">Region</q-th>
          <q-th :props="props" key="site" rowspan="2">Site</q-th>
          <q-th :props="props" key="action" style="text-align: center"
            ><q-btn
              round
              outline
              color="primary"
              size="sm"
              icon="add"
              v-show="false"
            ></q-btn
          ></q-th>
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
            icon="o_sell"
            @click="router.push('/games/' + props.row.name + '/' + props.row.mainhash)"
          ></q-btn>
        </q-td>
      </template>
      <template #body-cell-name="props">
        <q-td :props="props">
          <div class="!flex items-center">
            <q-avatar>
              <q-img
                class="rounded-full"
                :ratio="1 / 1"
                :src="getLogoUrl(props.row.logo)"
                :alt="`${props.row.name} Logo`"
              >
                <template v-slot:loading>
                  <q-skeleton width="35px" height="35px" />
                </template>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center !bg-slate-300">
                    <q-icon class="px-0 mx-0" color="white" name="image" size="18px" />
                  </div>
                </template>
              </q-img>
            </q-avatar>
            <div class="ms-2">
              <p class="text-start text-md font-medium">{{ props.row.slug }}</p>
              <p class="text-start text-xs text-gray-500">
                {{ props.row.name }}
              </p>
            </div>
          </div>
        </q-td>
      </template>
      <template #body-cell-region="props">
        <q-td :props="props">
          <p class="text-md">{{ props.row.region.description ?? '-' }}</p>
          <span
            class="text-xs text-gray-500"
            v-if="Object.keys(props.row.boundary).length"
            >Lat: {{ props.row.boundary.lat ?? '-' }} Long:{{
              props.row.boundary.lng ?? '-'
            }}</span
          >
        </q-td>
      </template>
      <template #body-cell-site="props">
        <q-td :props="props">
          <q-btn
            :href="getGameUrl(props.row)"
            target="_blank"
            flat
            :ripple="false"
            type="a"
            no-caps
            color="indigo-10"
            :text="getGameUrl(props.row)"
            class="underline p-0"
          />
        </q-td>
      </template>

      <template #bottom>
        <div class="md:flex md:items-center md:justify-between w-full">
          <div class="font-medium text-right md:text-left md:!block !hidden">
            Total row count: {{ bikeTagStore.getGames.length }}
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
              class="px-1 my-2 md:my-0 md:px-0 border-black md:border-0 rounded-md"
            >
              <template #prepend>
                <span class="text-caption text-primary-100 font-medium">Per page:</span>
              </template>
            </q-select>
            <div class="">
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
