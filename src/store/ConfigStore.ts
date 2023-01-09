import { defineStore } from 'pinia'

/** Config State */
type ConfigState = {
  /** Language */
  _locale: string
}

/** Config Store */
export default defineStore('config', {
  // Default Config State
  state: (): ConfigState => ({
    _locale:
      (window.navigator.languages && window.navigator.languages[0]) ||
      window.navigator.language
  }),
  // Getters
  getters: {
    locale: (s): string => s._locale
  },
  // Actions
  actions: {
    /** Set Locale. */
    setLocale(locale: string) {
      this._locale = locale
    }
  },
  // Data persistence destination
  persist: {
    key: import.meta.env.VITE_APP_WEBSTORAGE_NAMESPACE || 'vuetify',
    storage: window.sessionStorage
  }
})
