import { defineConfig } from 'windicss/helpers'
import formsPlugin from 'windicss/plugin/forms'

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ll: {
          base: '#00000014',
          neutral: '#FFFFFF',
          primary: '#00A651',
          secondary: '#008D45',
          accent: '#FFD025',
          border: '#EAEBEF'
        },
        ld: {
          base: '#212332',
          neutral: '#2A2E3F',
          primary: '#00A651',
          secondary: '#008D45',
          accent: '#FFD025',
          border: '#111219'
        }
      }
    }
  },
  plugins: [formsPlugin],
  extract: {
    exclude: ['node_modules', '.git']
  }
})
