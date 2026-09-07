<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/layout/NavBar.vue'

const route = useRoute()
const showNav = computed(() => !route.meta.guestOnly)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <NavBar v-if="showNav" />
    <router-view />
  </div>
</template>
