<template>
  <base-template title="BikeTag Game">
    <bike-tag-login msg="Log in to BikeTag" />
  </base-template>
</template>
<script>
import { defineComponent } from 'vue'
import BikeTagLogin from '@/components/BikeTagLogin'
import BaseTemplate from '@/components/BaseTemplate'

export default defineComponent({
  name: 'Index',
  components: {
    BaseTemplate,
    BikeTagLogin,
  },
})
</script>
