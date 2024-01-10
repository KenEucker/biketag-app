<script setup lang="ts">
import { ref, computed } from 'vue';
import BikeTagClient from 'biketag';
// import MapView from '../global/MapView.vue';
import ImportForm from '../global/ImportForm.vue';
// import { Game } from 'biketag/lib/common/schema';
// import TagForm from './TagForm.vue';

// interface GameData extends Omit<Game, 'boundary'> {
//   lat: number;
//   long: number;
//   alt: number;
//   gps: {
//     lat: number;
//     long: number;
//     alt: number;
//   };
// }

// const game = ref<GameData>({
//   ...BikeTagClient.createGameObject(),
//   boundary: { lat: 0, long: 0, alt: 0 },
// });

const game = ref(BikeTagClient.createGameObject());
(() => {
  const sett = {}; //: settingsArray = {}
  Object.assign(sett, game.value.settings);
  game.value.settings = sett;
})();

const firstTag = ref(BikeTagClient.createTagObject());
const current_step = ref(0);
const settings = computed(() => Object.keys(game.value.settings));
const skipSettings = ref(false);
const gps = ref({
  lat: game.value.boundary?.lat ?? 0,
  lng: game.value.boundary?.long ?? 0,
});
const launchGameResults = ref(['', '']);
const progression = computed(() => {
  let progress = 0;
  if (game.value.name) progress++;
  if (game.value.logo) progress++;
  if (game.value.region.slug) progress++;
  if (game.value.region.name) progress++;
  if (game.value.region.description) progress++;
  if (game.value.region.zipcode) progress++;
  if (game.value.boundary.alt) progress++;
  if (gps.value.lat || gps.value.lat == 0) progress++;
  if (gps.value.lng || gps.value.lng == 0) progress++;
  if (game.value.ambassadors.length) progress++;
  if (settings.value.length || skipSettings.value) progress++;
  if (firstTag.value.game) progress++;
  return Math.ceil((progress / 12) * 100);
});
// const center = ref({ ...gps.value });
const emit = defineEmits(['update:gameCreationForm']);
// const updateMarker = (e: any) => {
//   gps.value = { ...e };
// };
const newAmbassador = ref('');
const addNewAmbassador = () => {
  if (newAmbassador.value) {
    game.value.ambassadors.push(newAmbassador.value);
    newAmbassador.value = '';
  }
};
const removeAmbassador = (index: number) => {
  game.value.ambassadors.splice(index, 1);
};
const newSettingKey = ref('');
const newSettingValue = ref('');
const addNewSetting = () => {
  if (newSettingKey.value) {
    game.value.settings[newSettingKey.value] = newSettingValue.value;
  }
  newSettingKey.value = '';
  newSettingValue.value = '';
};
const removeSetting = (name: string) => {
  delete game.value.settings[name];
};
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
const updateCurrentStep = (by: number) => {
  current_step.value += by;
  if (!skipSettings.value && current_step.value > 2) {
    skipSettings.value = true;
  }
};
const loadTag = (data: any) => {
  if (data.length) {
    firstTag.value = data[0];
  }
};
const launchGame = async () => {
  (game.value.boundary as any).gps = {
    lat: gps.value.lat,
    long: gps.value.lng,
    alt: (game.value.boundary as any).gps?.alt ?? 0,
  };
  try {
    // const res: any = await biketag.launchGame(game.value as any, firstTag as any);
    // launchGameResults.value = [res.success, res.success];
  } catch (e) {
    console.log(e);
    launchGameResults.value = [String(e), ''];
  }
};

// import { computed, ref } from 'vue';
type StateType = {
  step: number;
};
// state for binding
const state = ref<StateType>({
  step: 1,
});
// Function to handle moving to the next step
const handleNext = () => {
  state.value.step = Math.min(state.value.step + 1, 4);
};
// Function to handle moving to the previous step
const handlePrevious = () => {
  state.value.step = Math.max(state.value.step - 1, 1);
};
</script>

<template>
  <q-card flat bordered class="mb-10">
    <!-- Stepper component -->
    <q-toolbar class="bg-slate-200 px-6 py-2">
      <q-toolbar-title>
        <div class="grid grid-cols-8 md:gap-x-4 gap-x-4">
          <div class="self-center">
            <p class="p-0 text-sm font-medium pt-1 md:pt-0">
              STEP:
              {{
                state.step === 1
                  ? 0
                  : state.step === 2
                  ? 1
                  : state.step === 3
                  ? 2
                  : state.step === 4
                  ? 3
                  : 3
              }}
              OF 3
            </p>
            <p class="p-0 text-lg text-gray-500 font-medium">
              {{
                state.step === 1
                  ? 'General Info'
                  : state.step === 2
                  ? 'Ambassadors'
                  : state.step === 3
                  ? 'Settings'
                  : state.step === 4
                  ? 'First Tag'
                  : ''
              }}
            </p>
          </div>
          <div class="col-start-5 col-span-4 flex">
            <q-linear-progress
              rounded
              :value="progression / 100"
              class="md:w-[90%] w-[70%] self-center"
              size="5px"
              color="green"
            />
            <span class="self-center pt-2 ms-3 text-sm"
              >{{ progression }}%</span
            >
          </div>
        </div>
      </q-toolbar-title>

      <q-icon
        name="highlight_off"
        size="md"
        class="cursor-pointer"
        @click="emit('update:gameCreationForm', false)"
      ></q-icon>
    </q-toolbar>
    <q-separator />
    <q-stepper v-model="state.step" ref="stepper" color="primary" animated>
      <!-- Step 1: Ambassador information -->
      <q-step :name="1" title="" icon="settings" :done="state.step > 1">
        <div>
          <p class="p-0 text-base font-medium py-2">Game General Information</p>
          <div class="mb-3">
            <label for="">Name</label>
            <q-input
              outlined
              dense
              v-model.trim="game.name"
              placeholder="Name"
            />
          </div>
          <div class="mb-3">
            <label for="">Logo URL</label>
            <q-input
              outlined
              dense
              v-model.trim="game.logo"
              placeholder="Logo URL"
            />
          </div>
          <p class="p-0 text-base font-medium py-2">Region</p>
          <div class="mb-3">
            <label for="">Slug</label>
            <q-input
              outlined
              dense
              v-model.trim="game.region.slug"
              placeholder="Slug"
            />
          </div>
          <div class="mb-3">
            <label for="">Name</label>
            <q-input
              outlined
              dense
              v-model.trim="game.region.name"
              placeholder="Name"
            />
          </div>
          <div class="mb-3">
            <label for="">Description</label>
            <q-input
              outlined
              dense
              v-model.trim="game.region.description"
              placeholder="Description"
            />
          </div>
          <div class="mb-3">
            <label for="">ZipCode</label>
            <q-input
              outlined
              dense
              v-model.trim="game.region.zipcode"
              placeholder="ZipCode"
            />
          </div>
          <p class="p-0 text-base font-medium py-2">Boundary</p>
          <div class="row">
            <div class="col-12 col-md-4">
              <p>Latitude: {{ gps.lat }}</p>
            </div>
            <div class="col-12 col-md-4">
              <p>Longitude: {{ gps.lng }}</p>
            </div>

            <div class="col-12 col-md-4">
              <div>
                <label for="">Altitude</label>
                <q-input
                  outlined
                  dense
                  v-model.trim="game.boundary.alt"
                  placeholder="Altitude"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-3">
            <!-- <MapView :gps="gps" :center="center" @dragend="updateMarker" /> -->
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193423.20281089068!2d78.33716858338033!3d17.3742811933008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1704870890834!5m2!1sen!2sin"
              width="600"
              height="450"
              style="border: 0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </q-step>
      <!-- Step 2: Game selection -->
      <q-step
        :name="2"
        title=""
        caption=""
        icon="create_new_folder"
        :done="state.step > 2"
      >
        <div>
          <p class="p-0 text-base font-medium py-2">Ambassadors</p>
          <q-item
            class="ion-margin-start"
            v-for="(ambassador, index) in game.ambassadors"
            :key="`amb_${index}`"
          >
            <q-input v-model="game.ambassadors[index]" />
            <q-btn icon="o_trash" unelevated @click="removeAmbassador(index)" />
          </q-item>
          <div class="mb-3">
            <label for="">Add an Ambassador</label>
            <q-input
              outlined
              dense
              v-model.trim="newAmbassador"
              placeholder="Add an Ambassador"
            >
              <template v-slot:append>
                <q-btn
                  icon="o_person_add"
                  unelevated
                  @click="addNewAmbassador"
                /> </template
            ></q-input>
          </div>
        </div>
      </q-step>
      <q-step :name="3" title="" icon="settings" :done="state.step > 1">
        <div>
          <p class="p-0 text-base font-medium py-2">Settings</p>
          <q-item
            class="ion-margin-start"
            v-for="(key, index) in settings"
            :key="`${key}-${index}`"
          >
            {{ capitalizeFirstLetter(key) }}
            <q-input v-model="game.settings[key]" />
            <q-btn icon="o_trash" unelevated @click="removeSetting(key)" />
          </q-item>
          <div class="mb-3">
            <label for="">Setting key</label>
            <q-input
              outlined
              dense
              v-model.trim="newSettingKey"
              placeholder="Setting key"
            >
            </q-input>
          </div>
          <div class="mb-3">
            <label for="">Setting value</label>
            <q-input
              outlined
              dense
              v-model.trim="newSettingValue"
              placeholder="Setting value"
            >
            </q-input>
          </div>
          <div class="text-right">
            <q-btn icon="o_add_circle" @click="addNewSetting" />
          </div>
        </div>
      </q-step>
      <q-step :name="4" title="" icon="settings" :done="state.step > 1">
        <div>
          <p class="p-0 text-base font-medium py-2">First Mystery tag</p>
          <ImportForm
            class="m-auto mb-2"
            @dataImported="loadTag"
            text="Upload First Tag"
          ></ImportForm>
        </div>
      </q-step>
      <!-- Navigation buttons -->
      <template v-slot:navigation>
        <q-stepper-navigation class="bg-slate-200 !p-0 !pr-6">
          <div class="text-right py-2">
            <q-btn
              v-if="state.step > 1"
              unelevated
              no-caps
              color="primary"
              @click="handlePrevious"
              label="Back"
              class="q-mr-sm"
            />
            <q-btn
              v-if="state.step === 1 || state.step === 2 || state.step === 3"
              @click="handleNext"
              unelevated
              no-caps
              color="primary"
              label="Next"
            />
            <q-btn
              v-if="state.step === 4 && progression == 100"
              @click="
                () => {
                  updateCurrentStep(1);
                  launchGame();
                }
              "
              unelevated
              no-caps
              color="primary"
              label="Launch"
            />
            <!-- <q-btn
              unelevated
              no-caps
              color="primary"
              label="Create Ambassador"
              @click="handleCreateAmbassador"
            /> -->
          </div>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-card>
</template>
<style lang="scss">
.q-stepper__header {
  display: none;
}
</style>
