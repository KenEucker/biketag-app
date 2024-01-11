<script setup lang="ts">
import { ref, computed } from 'vue'
import { Notify } from 'quasar'
import BikeTagClient from 'biketag'
import MapView from '../global/MapView.vue'
import ImportForm from '../global/ImportForm.vue'
import { Game, Tag } from 'biketag/lib/common/schema'
import TagForm from './TagForm.vue'
import { useBikeTagStore } from 'biketag-vue'

interface LatLng {
  lat: number
  lng: number
  alt: number
}

interface Boundarydata extends LatLng {
  gps: LatLng
}

const bikeTagStore = useBikeTagStore()

const game = ref(BikeTagClient.createGameObject())

const loader = ref<boolean>(false)
// setting
;(() => {
  const sett = {} //: settingsArray = {}
  Object.assign(sett, game.value.settings)
  game.value.settings = sett
})()

const firstTag = ref(BikeTagClient.createTagObject())
const current_step = ref(0)
const settings = computed(() => Object.keys(game.value.settings))
const skipSettings = ref(false)

const gps = ref({
  lat: (game.value.boundary as unknown as Boundarydata)?.lat ?? 0,
  lng: (game.value.boundary as unknown as Boundarydata)?.lng ?? 0,
})
const launchGameResults = ref(['', ''])
const progression = computed(() => {
  let progress = 0
  if (game.value.name) progress++
  if (game.value.logo) progress++
  if (game.value.region.slug) progress++
  if (game.value.region.name) progress++
  if (game.value.region.description) progress++
  if (game.value.region.zipcode) progress++
  if ((game.value.boundary as unknown as Boundarydata).alt) progress++
  if (gps.value.lat) progress++
  if (gps.value.lng) progress++
  if (game.value.ambassadors.length) progress++
  if (settings.value.length || skipSettings.value) progress++
  if (firstTag.value.game) progress++
  return Math.ceil((progress / 12) * 100)
})
const center = ref({ ...gps.value })
const emit = defineEmits(['update:gameCreationForm'])
const updateMarker = (e: Boundarydata) => {
  gps.value = { ...e }
}
const newAmbassador = ref('')
const addNewAmbassador = () => {
  if (newAmbassador.value) {
    game.value.ambassadors.push(newAmbassador.value)
    newAmbassador.value = ''
  }
}
const removeAmbassador = (index: number) => {
  game.value.ambassadors.splice(index, 1)
}
const newSettingKey = ref('')
const newSettingValue = ref('')
const addNewSetting = () => {
  if (newSettingKey.value) {
    game.value.settings[newSettingKey.value] = newSettingValue.value
  }
  newSettingKey.value = ''
  newSettingValue.value = ''
}
const removeSetting = (name: string) => {
  delete game.value.settings[name]
}
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)
const updateCurrentStep = (by: number) => {
  current_step.value += by
  if (!skipSettings.value && current_step.value > 2) {
    skipSettings.value = true
  }
}
const loadTag = (data: Tag[]) => {
  if (data.length) {
    console.log(data)
    firstTag.value = data[0]
  }
}
const launchGame = async () => {
  ;(game.value.boundary as unknown as Boundarydata).gps = {
    lat: gps.value.lat,
    lng: gps.value.lng,
    alt: (game.value.boundary as unknown as Boundarydata).gps?.alt ?? 0,
  }
  try {
    // Need to verify for which api will be used for create game
    loader.value = true
    const res = await bikeTagStore.setGame(
      game.value as Game,
      firstTag as unknown as Tag
    )
    Notify.create({
      icon: 'check_circle',
      color: 'green',
      message: 'Game created successfully',
      type: 'success',
      timeout: Math.random() * 5000 + 3000,
      actions: [{ icon: 'close', color: 'white' }],
    })
    emit('update:gameCreationForm', false)
    // const res: any = await biketag.launchGame(game.value as any, firstTag as any);
    launchGameResults.value = [res.success, res.success]
  } catch (e) {
    launchGameResults.value = [String(e), '']
    Notify.create({
      message: 'Something went wrong',
      type: 'negative',
      timeout: Math.random() * 5000 + 3000,
      actions: [{ icon: 'close', color: 'white' }],
    })
  } finally {
    loader.value = false
  }
}

// import { computed, ref } from 'vue';
type StateType = {
  step: number
}
// state for binding
const state = ref<StateType>({
  step: 1,
})
// Function to handle moving to the next step
const handleNext = () => {
  state.value.step = Math.min(state.value.step + 1, 4)
}
// Function to handle moving to the previous step
const handlePrevious = () => {
  state.value.step = Math.max(state.value.step - 1, 1)
}
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
        <div class="grid md:grid-cols-2 grid-cols-1 gap-x-4">
          <div>
            <p class="p-0 text-base font-medium py-2">
              Game General Information
            </p>
            <q-separator class="mb-4" />
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
          </div>
          <div>
            <p class="p-0 text-base font-medium py-2">Boundary</p>
            <q-separator class="mb-4" />
            <div class="grid grid-cols-3 gap-x-4">
              <div>
                <div>
                  <label for="">Latitude</label>
                  <q-input
                    readonly
                    outlined
                    dense
                    v-model.trim="gps.lat"
                    placeholder="Latitude"
                  />
                </div>
                <!-- <p>Latitude: {{ gps.lat }}</p> -->
              </div>
              <div>
                <div>
                  <label for="">Longitude</label>
                  <q-input
                    readonly
                    outlined
                    dense
                    v-model.trim="gps.lng"
                    placeholder="Longitude"
                  />
                </div>
                <!-- <p>Longitude: {{ gps.lng }}</p> -->
              </div>

              <div>
                <div>
                  <label for="">Altitude</label>
                  <q-input
                    outlined
                    dense
                    v-model.trim="(game.boundary as unknown as Boundarydata).alt"
                    placeholder="Altitude"
                  />
                </div>
              </div>
            </div>
            <div class="flex justify-center md:m-4 m-0 my-4">
              <MapView
                class="w-[100%] md:h-[380px] h-[300px]"
                :gps="gps"
                :center="center"
                @dragend="updateMarker"
              />
            </div>
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
          <q-separator class="mb-4" />
          <div class="grid md:grid-cols-2 grid-cols-1 gap-x-4">
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
            <div>
              <q-item
                dense
                class="w-full"
                flat
                v-for="(ambassador, index) in game.ambassadors"
                :key="`amb_${index}`"
              >
                <q-item-section>
                  <q-input v-model="game.ambassadors[index]" dense flat />
                </q-item-section>
                <q-item-section avatar>
                  <q-btn
                    icon="o_delete"
                    unelevated
                    @click="removeAmbassador(index)"
                  />
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-step>
      <q-step :name="3" title="" icon="settings" :done="state.step > 1">
        <div>
          <p class="p-0 text-base font-medium py-2">Settings</p>
          <q-separator class="mb-4" />
          <div class="grid md:grid-cols-2 grid-cols-1 gap-x-4">
            <div
              class="mb-3 grid md:grid-cols-3 grid-cols-1 gap-x-4 align-center"
            >
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
              <div class="mt-4 md:text-left text-center">
                <q-btn round dense icon="o_add_circle" @click="addNewSetting" />
              </div>
            </div>
            <div>
              <q-item
                dense
                class="w-full mb-3"
                flat
                v-for="(key, index) in settings"
                :key="`${key}-${index}`"
              >
                <q-item-section>
                  <q-input
                    :label="capitalizeFirstLetter(key)"
                    v-model="game.settings[key]"
                    dense
                    flat
                  />
                </q-item-section>
                <q-item-section avatar>
                  <q-btn
                    icon="o_delete"
                    unelevated
                    @click="removeSetting(key)"
                  />
                </q-item-section>
              </q-item>
            </div>
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
          <tag-form v-if="firstTag.game" :tag="firstTag" :commit="false" />
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
                  updateCurrentStep(1)
                  launchGame()
                }
              "
              unelevated
              :loading="loader"
              :disable="loader"
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
