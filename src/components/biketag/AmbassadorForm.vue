<script setup lang="ts">
import { ref, defineEmits, computed } from 'vue'
import { useBikeTagApiStore } from '@/store/biketag'

const biketag = useBikeTagApiStore()
const ambassador = ref({
  name: '',
  email: '',
  games: [] as string[]
})
const games = ref(biketag.allGames)
const current_step = ref(0)
const steps = ref(1)
const ambassadorCreationResult = ref(false)
const progression = computed(() => {
  let progress = 0
  if (ambassador.value.name) progress++
  if (ambassador.value.email) progress++
  if (ambassador.value.games.length) progress++
  return Math.ceil((progress / 3) * 100)
})
const emit = defineEmits(['onClose'])

const toggleGame = (gameName: string) => {
  const i = ambassador.value.games.indexOf(gameName)
  if (i == -1) {
    ambassador.value.games.push(gameName)
  } else {
    ambassador.value.games.splice(i, 1)
  }
}
const updateCurrentStep = (by: number) => (current_step.value += by)
// eslint-disable-next-line @typescript-eslint/no-empty-function
const createAmbassador = async () => {}
</script>

<template>
  <v-header>
    <v-toolbar>
      <v-buttons>
        <v-btn @click="emit('onClose')">
          <v-icon icon="mdi-close-circle-outline" />
        </v-btn>
      </v-buttons>
      <div
        class="uppercase tracking-wide text-xs font-bold text-gray-500 mb-1 ml-5 mt-2 md:mt-1 leading-tight"
      >
        Step: {{ Math.min(current_step, steps) }} of {{ steps }}
      </div>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <v-title
          v-if="current_step === 0"
          class="text-lg font-bold text-gray-700 leading-tight"
        >
          General Info
        </v-title>
        <v-title
          v-if="current_step === 1"
          class="text-lg font-bold text-gray-700 leading-tight"
        >
          Assign Games
        </v-title>
        <v-title
          v-if="current_step > 1"
          class="text-lg font-bold text-gray-700 leading-tight"
        >
          All set!
        </v-title>
        <div class="mb-4 md:mb-0"></div>

        <div
          class="absolute md:static bottom-0 flex items-center h-1 md:h-2 md:ml-2 w-screen md:w-64"
        >
          <div class="w-full bg-white md:rounded-full md:mr-2">
            <div
              class="md:rounded-full bg-green-500 leading-none h-2 text-center text-white"
              :style="`width: ${progression}%`"
            />
          </div>
          <div class="hidden md:block text-xs w-10 text-gray-600">
            {{ progression }}%
          </div>
        </div>
      </div>
    </v-toolbar>
  </v-header>
  <v-content class="modal-content cnt">
    <transition-group name="creation-form-steps" tag="div" class="h-full">
      <v-list v-if="current_step === 0">
        <v-list-header>
          <v-label> Ambassador Information </v-label>
        </v-list-header>
        <v-item>
          <v-label position="floating"> Name </v-label>
          <v-input v-model="ambassador.name" type="name" />
        </v-item>
        <v-item>
          <v-label position="floating"> Email </v-label>
          <v-input v-model="ambassador.email" type="email" />
        </v-item>
      </v-list>

      <v-list v-else-if="current_step === 1">
        <v-list-header lines="full">
          <v-label> Select Games </v-label>
        </v-list-header>
        <v-item v-for="(game, index) in games" :key="`game_${index}`">
          <v-label>{{ game.name }}</v-label>
          <v-checkbox color="primary" @change="toggleGame(game.name)" />
        </v-item>
      </v-list>

      <div
        v-else-if="current_step === 2"
        class="card flex justify-center items-center flex-col h-full"
      >
        <v-icon
          v-if="ambassadorCreationResult"
          class="icon--green"
          icon="mdi-checkbox-marked-circle-outline"
        />
        <v-icon v-else class="icon--red" icon="mdi-bug-outline" />
        <h3 class="mt-6">
          {{
            ambassadorCreationResult
              ? 'Success'
              : `Error creating the new ambassador ${ambassador.name}`
          }}
        </h3>
      </div>
    </transition-group>
  </v-content>
  <v-item class="cnt--sticky-footer">
    <v-btn
      v-if="current_step > 0 && current_step < steps + 1"
      class="mb-4 md:mb-2"
      @click="() => updateCurrentStep(-1)"
    >
      Back
    </v-btn>
    <v-btn
      v-if="current_step < steps"
      class="mb-4 md:mb-2"
      @click="() => updateCurrentStep(1)"
    >
      Next
    </v-btn>
    <v-btn
      v-else-if="progression == 100 && current_step == steps"
      class="mb-4 md:mb-2"
      type="submit"
      @click="
        () => {
          updateCurrentStep(1)
          createAmbassador()
        }
      "
    >
      Create Ambassador
    </v-btn>
  </v-item>
</template>

<style lang="scss">
$size: 48px;
$md: 768px;

.creation-form-steps {
  &-enter-active,
  &-leave-active {
    transition: all 0.5s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}

.cnt {
  margin-bottom: -$size !important;
  height: calc(var(--width) - 56px - $size) !important;

  &--sticky-footer {
    height: $size;
  }
}

.icon {
  &--green,
  &--red {
    font-size: 78px;
  }

  &--green {
    color: green;
  }

  &--red {
    color: red;
  }
}
</style>
