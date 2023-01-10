<script setup lang="ts">
import { computed, nextTick, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useGlobal } from '@/store'

const globalStore = useGlobal()

/** Snackbar visibility */
const snackbar: Ref<boolean> = ref(false)

/** Snackbar text */
const snackbarText: ComputedRef<string> = computed(() => globalStore.message)

// When snackbar text has been set, show snackbar.
watch(
  () => globalStore.message,
  async (value) => {
    snackbar.value = value !== ''
    await nextTick()
  }
)

/** Clear store when snackbar hide */
const onSnackbarChanged = async () => {
  globalStore.setMessage()
  await nextTick()
}
</script>
<template>
  <v-snackbar v-model="snackbar" @update:model-value="onSnackbarChanged">
    {{ snackbarText }}
    <template #actions>
      <v-btn icon @click="onSnackbarChanged">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>

  <v-footer app elevation="3">
    <span class="mr-5">2022 &copy; BikeTag Project</span>
  </v-footer>
</template>
