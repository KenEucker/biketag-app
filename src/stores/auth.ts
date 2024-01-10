// Auth 0 login

import { User } from '@auth0/auth0-vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'Auth',
  state: () => ({
    isAuthenticated: false,
    loginUser: {} as User,
    authInitLoader: true,
  }),
  getters: {
    getLoginUser: (state) => state.loginUser || null,
    getIsAuthenticated: (state) => state.isAuthenticated || false,
    getAuthInitLoader: (state) => state.authInitLoader || true,
  },
  actions: {
    logout() {
      this.isAuthenticated = false
      this.loginUser = {}
    },
  },
})
