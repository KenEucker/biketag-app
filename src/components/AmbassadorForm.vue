<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  IonIcon,
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonInput,
  IonLabel,
  IonCheckbox,
} from '@ionic/vue'
import { 
  closeCircleOutline,
  checkmarkCircleOutline,
  bugOutline,
} from 'ionicons/icons'
import { useBikeTagApiStore } from '@/store/biketag'

const biketag = useBikeTagApiStore()
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
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button @click="emit('onClose')">
          <ion-icon :icon="closeCircleOutline" />
        </ion-button>
      </ion-buttons>
      <div class="mt-2 mb-1 ml-5 text-xs font-bold leading-tight tracking-wide text-gray-500 uppercase md:mt-1">
        Step: {{ Math.min(current_step, steps) }} of {{ steps }}
      </div>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <ion-title v-if="current_step === 0" class="text-lg font-bold leading-tight text-gray-700"> General Info </ion-title>
        <ion-title v-if="current_step === 1" class="text-lg font-bold leading-tight text-gray-700"> Assign Games </ion-title>
        <ion-title v-if="current_step > 1" class="text-lg font-bold leading-tight text-gray-700"> All set! </ion-title>
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
    </ion-toolbar>
  </ion-header>
  <ion-content class="modal-content cnt">
    <transition-group name="creation-form-steps" tag="div" class="h-full">

      <ion-list v-if="current_step === 0">
        <ion-list-header>
          <ion-label> Ambassador Information </ion-label>
        </ion-list-header>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Name </ion-label>
          <ion-input type="name" v-model="ambassador.name" />
        </ion-item>
        <ion-item class="ion-margin-start">
          <ion-label position="floating"> Email </ion-label>
          <ion-input type="email" v-model="ambassador.email" />
        </ion-item>
      </ion-list>

      <ion-list v-else-if="current_step === 1">
        <ion-list-header lines="full">
          <ion-label> Select Games </ion-label>
        </ion-list-header>
        <ion-item
          class="ion-margin-start"
          v-for="(game, index) in games"
          :key="`game_${index}`"
        >
          <ion-label>{{game.name}}</ion-label>
          <ion-checkbox @ionChange="toggleGame(game.name)" color="primary" slot="start" />
        </ion-item>
      </ion-list>

      <div class="flex flex-col items-center justify-center h-full card" v-else-if="current_step === 2">
        <ion-icon class="icon--green" v-if="ambassadorCreationResult" :icon="checkmarkCircleOutline"/>
        <ion-icon class="icon--red" v-else :icon="bugOutline"/>
        <h3 class="mt-6"> {{ ambassadorCreationResult ? 'Success' : `Error creating the new ambassador ${ambassador.name}` }} </h3>
      </div>
    </transition-group>

  </ion-content>
  <ion-item class="cnt--sticky-footer">
    <ion-button class="mb-4 md:mb-2" slot="end" v-if="current_step > 0 && current_step < steps + 1" @click="() => updateCurrentStep(-1)"> Back </ion-button>
    <ion-button class="mb-4 md:mb-2" slot="end" v-if="current_step < steps" @click="() => updateCurrentStep(1)"> Next </ion-button>
    <ion-button class="mb-4 md:mb-2" slot="end" type="submit" 
      v-else-if="progression == 100 && current_step == steps" 
      @click="() => {updateCurrentStep(1); createAmbassador()}"
      > 
      Create Ambassador 
    </ion-button>
  </ion-item>
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