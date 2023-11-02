/**
 * Vuetify3 Plugin
 */
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createVuetify } from 'vuetify'

// For test use. Do not include createVuetify()
// see https://next.vuetifyjs.com/en/features/treeshaking/
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Translations provided by Vuetify
import { en } from 'vuetify/locale'

// Misc
import { loadFonts } from './webfontloader'
loadFonts()

// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const biketagLightTheme = {
  dark: false,
  colors: {
    primary: '#673ab7',
    secondary: '#03a9f4',
    accent: '#ffeb3b',
    error: '#607d8b',
    warning: '#ff9800',
    info: '#00bcd4',
    success: '#8bc34a',
    background: '#FFFFFF',
    surface: '#FFFFFF'
  }
}

export default createVuetify({
  // Global configuration
  // https://next.vuetifyjs.com/en/features/global-configuration/
  /*
  defaults: {
    global: {
      ripple: false,
    },
    VSheet: {
      elevation: 4,
    },
  },
  */
  // Icon Fonts
  // https://next.vuetifyjs.com/en/features/icon-fonts/
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  // Internationalization (i18n)
  // https://next.vuetifyjs.com/en/features/internationalization/#internationalization-i18n
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: { en }
  },
  // Theme
  // https://next.vuetifyjs.com/en/features/theme/
  theme: {
    defaultTheme: 'biketagLightTheme',
    // cspNonce: 'dQw4w9WgXcQ',
    themes: {
      biketagLightTheme
    }
  }
})

// Export for test.
export { components, directives }
