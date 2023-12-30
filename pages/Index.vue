<template>
    <nuxt-link to="/games"><h1>Go to Games</h1></nuxt-link>
    <!-- <bike-tag-login msg="Log in to BikeTag" /> -->
</template>
<script setup lang="ts">
    import {onMounted} from 'vue'
    import { useBikeTagStore } from "~/store/biketag"
    import BikeTagLogin from '~/components/BikeTagLogin.vue'

    const biketag = useBikeTagStore()
    const games = ref(biketag.allGames)
    
    onMounted(async () => {
        biketag.setGames().then(() => (games.value = biketag.allGames))
    })

    definePageMeta({
        path: '/',
        auth: false,
    })

</script>