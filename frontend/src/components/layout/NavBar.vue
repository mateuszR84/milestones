<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)

async function handleLogout() {
  await auth.logout()
  menuOpen.value = false
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="flex items-center justify-between border-b border-neutral-200 px-6 py-3">
    <router-link to="/" class="text-lg font-medium tracking-tight text-neutral-900">
      milestones
    </router-link>

    <div class="relative">
      <button
        class="rounded p-2 text-neutral-500 hover:bg-neutral-100"
        aria-label="Menu"
        @click="menuOpen = !menuOpen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        v-if="menuOpen"
        class="absolute right-0 top-full z-20 mt-2 w-48 rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
        @click="menuOpen = false"
      >
        <router-link to="/" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Oś czasu</router-link>
        <router-link to="/friends" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Znajomi</router-link>
        <button class="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50" @click="handleLogout">
          Wyloguj
        </button>
      </div>
    </div>
  </header>
</template>
