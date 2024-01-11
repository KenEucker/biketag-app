<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBikeTagStore } from 'biketag-vue'
import { QForm } from 'quasar'

const bikeTagStore = useBikeTagStore()
type StateType = {
  step: number
  name: string
  email: string
  selectGame: string[] // Change from any[] to string[]
}
// state for binding
const state = ref<StateType>({
  step: 1,
  name: '',
  email: '',
  selectGame: [],
})

const generalForm = ref<QForm | null>(null)
const emailForm = ref<QForm | null>(null)

const emit = defineEmits(['update:ambassadorForm'])

const progress = computed(() => {
  const nameCompletion = state.value.name ? 0.3 : 0
  const emailCompletion =
    state.value.email && state.value.step == 1
      ? emailForm.value?.validate()
        ? 0.3
        : 0
      : state.value.email
      ? 0.3
      : 0
  const selectGameCompletion = state.value.selectGame.length !== 0 ? 0.4 : 0
  return nameCompletion + emailCompletion + selectGameCompletion
})

const nameValid = computed(() => {
  return [(v: string) => !!v || 'Name is required']
})

// Email validation
const emailValidation = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return [
    (v: string) => !!v || 'Email is required',
    (v: string) => (v && emailRegex.test(v)) || 'Email format is not valid',
  ]
})

// on form submit for check form validation
const onChangeNext = async () => {
  if (await generalForm.value?.validate()) {
    // check form validation and after move on next step
    if (state.value.step === 1) {
      handleNext()
    }
    if (state.value.step === 2) {
      // check form validation and after move on submit
      handleCreateAmbassador()
    }
  }
}

// Function to handle moving to the next step
const handleNext = () => {
  state.value.step = Math.min(state.value.step + 1, 4)
}
// Function to handle moving to the previous step
const handlePrevious = () => {
  state.value.step = Math.max(state.value.step - 1, 1)
}

// Function to handle creating an ambassador
const handleCreateAmbassador = () => {
  console.log(
    'Creating Ambassador:',
    state.value.name,
    state.value.email,
    state.value.selectGame
  )
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
              STEP: {{ state.step == 1 ? 0 : 1 }} OF 1
            </p>
            <p class="p-0 text-lg text-gray-500 font-medium">
              {{ state.step == 1 ? 'General Info' : 'Assign Games' }}
            </p>
          </div>
          <div class="col-start-5 col-span-4 flex">
            <q-linear-progress
              rounded
              :value="progress"
              class="md:w-[90%] w-[70%] self-center"
              size="5px"
              color="green"
            />
            <span class="self-center pt-2 ms-3 text-sm"
              >{{ progress * 100 }}%</span
            >
          </div>
        </div>
      </q-toolbar-title>

      <q-icon
        name="highlight_off"
        size="md"
        class="cursor-pointer"
        @click="emit('update:ambassadorForm', false)"
      ></q-icon>
    </q-toolbar>

    <q-separator />
    <q-form ref="generalForm" @submit="onChangeNext" greedy>
      <q-stepper
        v-model="state.step"
        ref="stepper"
        color="primary"
        animated
        flat
      >
        <!-- Step 1: Ambassador information -->
        <q-step :name="1" title="" icon="settings" :done="state.step > 1">
          <div>
            <p class="p-0 pb-3 text-sm font-medium">Ambassador information</p>
          </div>
          <div class="mb-3">
            <label for="">Name</label>
            <q-input
              outlined
              dense
              v-model.trim="state.name"
              placeholder="Name"
              :rules="nameValid"
            />
          </div>
          <div>
            <label for="">Email</label>
            <q-input
              ref="emailForm"
              outlined
              dense
              v-model.trim="state.email"
              :rules="emailValidation"
              placeholder="Email"
            />
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
            <p class="p-0 pb-3 text-sm font-medium">Select Games</p>
          </div>
          <q-scroll-area
            style="height: 70vh"
            :thumb-style="{
              width: '0px',
            }"
          >
            <div v-for="game in bikeTagStore.getAllGames" :key="game._id">
              <q-checkbox
                v-model="state.selectGame"
                :val="game._id"
                :label="game.name"
                color="teal"
              />
            </div>
          </q-scroll-area>
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
                v-if="state.step === 1"
                type="submit"
                unelevated
                no-caps
                color="primary"
                label="Next"
              />
              <q-btn
                v-if="
                  state.step === 2 &&
                  state.selectGame.length !== 0 &&
                  state.email !== '' &&
                  state.name !== ''
                "
                unelevated
                no-caps
                color="primary"
                label="Create Ambassador"
                type="submit"
              />
            </div>
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-form>
  </q-card>
</template>
<style lang="scss">
.q-stepper__header {
  display: none;
}
</style>
