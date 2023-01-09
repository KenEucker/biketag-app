<script setup lang="ts">
import { ref, reactive } from 'vue'
import LoadingSpinner from '../atomic/LoadingSpinner.vue'
const show = ref(false)
const loggingIn = ref(false)
const loginSuccess = ref(false)

const onButtonClicked = () => {
  show.value = true
  // loggingIn.value = true
}
const loginData = reactive({
  form: false,
  email: null,
  password: null
})

function onSubmit() {
  if (!loginData.form) return
  loggingIn.value = true

  setTimeout(() => {
    loginSuccess.value = true
    loggingIn.value = false
  }, 3000)
}
function required(v: string) {
  return !!v || 'Field is required'
}
</script>

<template>
  <div class="text-center" @click="loggingIn = false">
    <v-btn
      :disabled="show"
      :loading="show"
      min-width="164"
      class="white--text"
      variant="text"
      color="purple darken-2"
      @click.stop="onButtonClicked"
    >
      Login
    </v-btn>
    <v-dialog
      v-model="show"
      hide-overlay
      :persistent="loggingIn"
      transition="dialog-top-transition"
      max-width="600"
    >
      <loading-spinner v-if="loggingIn" />
      <v-card
        v-else-if="loginSuccess"
        class="mx-auto px-6 py-8"
        color="#1F7087"
      >
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title class="text-h5"> Login Successful </v-card-title>

            <v-card-subtitle
              >Thank you for logging in, please check any messages you may
              have.</v-card-subtitle
            >

            <v-card-actions>
              <v-btn class="ml-2" variant="outlined" size="small">
                Messages
              </v-btn>
            </v-card-actions>
          </div>

          <v-avatar class="ma-3" size="125" rounded="0">
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"
            ></v-img>
          </v-avatar>
        </div>
      </v-card>
      <v-sheet v-else class="pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" max-width="344">
          <v-form v-model="loginData.form" @submit.prevent="onSubmit">
            <v-text-field
              v-model="loginData.email"
              :readonly="loggingIn"
              :rules="[required]"
              class="mb-2"
              clearable
              label="Email"
            ></v-text-field>

            <v-text-field
              v-model="loginData.password"
              :readonly="loggingIn"
              :rules="[required]"
              clearable
              label="Password"
              placeholder="Enter your password"
            ></v-text-field>

            <br />

            <v-btn
              :disabled="!loginData.form"
              :loading="loggingIn"
              block
              color="success"
              size="large"
              type="submit"
              variant="elevated"
            >
              Sign In
            </v-btn>
          </v-form>
        </v-card>
      </v-sheet>
    </v-dialog>
  </div>
</template>
