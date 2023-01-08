import { defineStore } from 'pinia'

/** Global state */
type GlobalState = {
  /** Loading overlay */
  _loading: boolean
  /** ProgressBar Percentage */
  _progress: number | null
  /** SnackBar Text */
  _message: string
}

/** Global Store */
export default defineStore('global', {
  // Default Global State
  state: (): GlobalState => ({
    _loading: true,
    _progress: null,
    _message: ''
  }),
  // Getters
  getters: {
    /** Loading overlay visibility */
    loading: (s): boolean => s._loading,
    /** Loadig progress value */
    progress: (s): number | null => {
      s._loading = true
      return s._progress
    },
    /** Snackbar Text */
    message: (s): string => s._message
  },
  // Actions
  actions: {
    /** Show loading Overlay */
    setLoading(display: boolean) {
      this._loading = display
      if (!display) {
        // Reset Progress value
        this._progress = null
      }
    },
    /** Update progress value */
    setProgress(progress: number | null = null) {
      // update progress value
      this._progress = progress
      // display loading overlay
      this._loading = true
    },
    /** Show snackbar message */
    setMessage(message = '') {
      // put snackbar text
      this._message = message
    }
  }
  /*
  persist: {
    key: import.meta.env.VITE_APP_WEBSTORAGE_NAMESPACE || 'vuetify',
    storage: window.localStorage,
  },
  */
})
