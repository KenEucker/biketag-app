<template>
  <div :class="!BUILD_DATE ? 'development-mode' : ''">
    <header class="container px-4 mx-auto mt-6 prose-sm md:px-6 md:prose">
      <h1>BikeTag v{{ VERSION }}</h1>
      <div
        class="github-ribbon"
        style="
          position: absolute;
          right: 0;
          top: 0;
          width: 150px;
          height: 150px;
          overflow: hidden;
          z-index: 99999;
        "
      >
        <a
          style="
            display: inline-block;
            width: 200px;
            overflow: hidden;
            padding: 6px 0;
            text-align: center;
            transform: rotate(45deg);
            text-decoration: none;
            color: rgb(255 255 255);
            position: inherit;
            top: 45px;
            right: -40px;
            border-width: 1px 0;
            border-style: dotted;
            border-color: rgb(255 255 255 / 70%);
            font: 700 13px 'Helvetica Neue', Helvetica, Arial, sans-serif;
            box-shadow: rgb(0 0 0 / 50%) 0 2px 3px 0;
            background-color: rgb(170 0 0);
          "
          href="https://github.com/biketagorg"
          >Fork me on GitHub</a
        >
      </div>
    </header>
    <main class="container mx-auto">
      <div
        class="p-4 mx-auto prose bg-white md:px-6 prose-indigo sm:rounded-md"
      >
        <slot></slot>
      </div>
    </main>
    <footer class="container py-6 mx-auto text-sm text-center text-gray-700">
      <div>
        BikeTag is an Open-Source Project developed on GitHub
        <a class="underline" href="https://twitter.com/uninen">@BikeTagOrg</a>
        &copy; 2018-{{ thisYear }}.
        <div v-if="BUILD_DATE">Site built {{ BUILD_DATE }}.</div>
        <div v-else class="dev-mode">Development mode</div>
      </div>
    </footer>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'

export default defineComponent({
  name: 'QueueSubmit',
  props: {
    title: {
      type: String,
      default: null
    }
  },
  setup(props) {
    useHead({
      bodyAttrs: {
        title: props.title
      },
      meta: [
        {
          property: 'og:title',
          content: props.title
        },
        {
          name: 'twitter:title',
          content: props.title
        }
      ]
    })
  },
  data() {
    return {
      thisYear: new Date().getFullYear()
    }
  },
  computed: {
    VERSION() {
      return process?.env?.VITE_APP_VERSION ?? 'beta'
    },
    BUILD_DATE() {
      return process?.env?.VITE_APP_BUILD_EPOCH
        ? new Date(
            Number(process.env.VITE_APP_BUILD_EPOCH)
          ).toLocaleDateString()
        : null
    }
  }
})
</script>
<style lang="scss" scoped>
.dev-mode {
  background-color: green;
  color: white;
  display: inline;
}
</style>
