<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBikeTagStore } from '../store/biketag'

const biketag = useBikeTagStore()
const ambassador = ref({
    name: '',
    email: '',
    games : [] as string[],
});
const games = ref(biketag.allGames)
const current_step = ref(0)
const steps = ref(1)
const ambassadorCreationResult = ref(false)
const progression = computed(() => {
  let progress = 0
  if (ambassador.value.name) progress++;
  if (ambassador.value.email) progress++;
  if (ambassador.value.games.length) progress++;
  return Math.ceil(progress / 3 * 100)
})
const emit = defineEmits(['onClose'])

const toggleGame = (gameName: string) => {
  const i = ambassador.value.games.indexOf(gameName);
  if (i == -1) {
    ambassador.value.games.push(gameName)
  } else {
    ambassador.value.games.splice(i, 1)
  }
}
const updateCurrentStep = (by: number) => current_step.value += by
const createAmbassador = async () => {}
</script>

<template>
  <header>
    <toolbar>
      <buttons slot="end">
        <u-button @click="emit('onClose')">
          <Icon name="ic:round-close" />
        </u-button>
      </buttons>
      <div class="mt-2 mb-1 ml-5 text-xs font-bold leading-tight tracking-wide text-gray-500 uppercase md:mt-1">
        Step: {{ Math.min(current_step, steps) }} of {{ steps }}
      </div>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <title v-if="current_step === 0" class="text-lg font-bold leading-tight text-gray-700"> General Info </title>
        <title v-if="current_step === 1" class="text-lg font-bold leading-tight text-gray-700"> Assign Games </title>
        <title v-if="current_step > 1" class="text-lg font-bold leading-tight text-gray-700"> All set! </title>
        <div class="mb-4 md:mb-0"></div>

        <div class="absolute bottom-0 flex items-center w-screen h-1 md:static md:h-2 md:ml-2 md:w-64">
          <div class="w-full bg-white md:rounded-full md:mr-2">
            <div 
              class="h-2 leading-none text-center text-white bg-green-500 md:rounded-full" 
              :style="`width: ${progression}%`" />
          </div>
          <div class="hidden w-10 text-xs text-gray-600 md:block">
            {{ progression }}%
          </div>
        </div>
      </div>
    </toolbar>
  </header>
  <content class="modal-content cnt">
    <transitgroup name="creatform-steps" tag="div" class="h-full">

      <list v-if="current_step === 0">
        <list-header>
          <label> Ambassador Information </label>
        </list-header>
        <item class="margin-start">
          <label position="floating"> Name </label>
          <input type="name" v-model="ambassador.name" />
        </item>
        <item class="margin-start">
          <label position="floating"> Email </label>
          <input type="email" v-model="ambassador.email" />
        </item>
      </list>

      <list v-else-if="current_step === 1">
        <list-header lines="full">
          <label> Select Games </label>
        </list-header>
        <item
          class="margin-start"
          v-for="(game, index) in games"
          :key="`game_${index}`"
        >
          <label>{{game.name}}</label>
          <checkbox @ionChange="toggleGame(game.name)" color="primary" slot="start" />
        </item>
      </list>

      <div class="flex flex-col items-center justify-center h-full card" v-else-if="current_step === 2">
        <icon class="icon--green" v-if="ambassadorCreationResult" :icon="checkmarkCircleOutline"/>
        <icon class="icon--red" v-else :icon="bugOutline"/>
        <h3 class="mt-6"> {{ ambassadorCreationResult ? 'Success' : `Error creating the new ambassador ${ambassador.name}` }} </h3>
      </div>
    </transitgroup>

  </content>
  <item class="cnt--sticky-footer">
    <u-button class="mb-4 md:mb-2" slot="end" v-if="current_step > 0 && current_step < steps + 1" @click="() => updateCurrentStep(-1)"> Back </u-button>
    <u-button class="mb-4 md:mb-2" slot="end" v-if="current_step < steps" @click="() => updateCurrentStep(1)"> Next </u-button>
    <u-button class="mb-4 md:mb-2" slot="end" type="submit" 
      v-else-if="progression == 100 && current_step == steps" 
      @click="() => {updateCurrentStep(1); createAmbassador()}"
      > 
      Create Ambassador 
    </u-button>
  </item>
</template>

<style lang="scss">
$size: 48px;
$md: 768px;

.creatform-steps {
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
  &--green, &--red {
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