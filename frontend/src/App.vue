<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/layout/NavBar.vue'
import Sidebar from './components/layout/Sidebar.vue'

const route = useRoute()
const showNav = computed(() => !route.meta.guestOnly)
</script>

<template>
  <div class="app-bg flex h-screen flex-col">
    <NavBar v-if="showNav" />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar v-if="showNav" />
      <router-view class="flex-1" />
    </div>
  </div>
</template>

<style scoped>
.app-bg {
  background-color: #f6f5fb;
  background-image:
    radial-gradient(at 12% 18%, rgba(124, 58, 237, 0.32) 0px, transparent 50%),
    radial-gradient(at 85% 12%, rgba(96, 165, 250, 0.28) 0px, transparent 50%),
    radial-gradient(at 92% 88%, rgba(147, 197, 253, 0.35) 0px, transparent 55%),
    radial-gradient(at 8% 92%, rgba(251, 191, 146, 0.38) 0px, transparent 50%),
    radial-gradient(at 50% 50%, rgba(236, 72, 153, 0.1) 0px, transparent 60%);
}
</style>
