import type { Config } from 'tailwindcss'

export default {
  mode: "jit",
  content: [
      "./components/*.{vue,js}",
      "./components/**/*.{vue,js}",
      "./layouts/**/*.vue",
      "./pages/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "~/assets/*.css",
      "~/assets/*/*.css",
      "~/assets/**/*.css",
      "app.vue",
      'error.vue'
  ],
  media: false, // or 'media' or 'class'
  theme: {
      extend: {},
  },
  variants: {
      extend: {},
  },
  plugins: [],
} satisfies Config