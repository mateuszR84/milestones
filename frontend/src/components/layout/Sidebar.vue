<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { SUPPORTED_LOCALES, setLocale, type SupportedLocale } from '../../i18n'

const auth = useAuthStore()
const route = useRoute()
const { locale, t } = useI18n()

const initial = computed(() => auth.user?.name?.trim()?.charAt(0)?.toUpperCase() ?? '?')
const preferencesOpen = ref(false)
</script>

<template>
  <aside class="flex w-56 shrink-0 flex-col border-r border-white/40 bg-white/30 backdrop-blur-xl">
    <nav class="flex-1 px-3 py-3 space-y-1">
      <router-link
        to="/"
        class="block rounded-lg px-3 py-2 text-sm font-medium transition"
        :class="route.name === 'timeline' ? 'bg-white/70 text-neutral-900' : 'text-neutral-600 hover:bg-white/40'"
      >
        {{ t('nav.timeline') }}
      </router-link>
      <router-link
        to="/events"
        class="block rounded-lg px-3 py-2 text-sm font-medium transition"
        :class="route.name === 'events' ? 'bg-white/70 text-neutral-900' : 'text-neutral-600 hover:bg-white/40'"
      >
        {{ t('nav.events') }}
      </router-link>
    </nav>

    <div v-if="preferencesOpen" class="border-t border-white/40 px-4 py-3">
      <p class="mb-1.5 text-xs text-neutral-500">{{ t('sidebar.language') }}</p>
      <div class="inline-flex gap-1 rounded-full border border-white/50 bg-white/60 p-1">
        <button
          v-for="option in SUPPORTED_LOCALES"
          :key="option.value"
          type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition"
          :class="locale === option.value ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-white'"
          @click="setLocale(option.value as SupportedLocale)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <button
      v-if="auth.user"
      type="button"
      class="flex items-center gap-3 border-t border-white/40 px-4 py-3 text-left hover:bg-white/30"
      @click="preferencesOpen = !preferencesOpen"
    >
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white">
        {{ initial }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-neutral-800">{{ auth.user.name }}</p>
        <p class="truncate text-xs text-neutral-500">{{ auth.user.email }}</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 shrink-0 text-neutral-400 transition-transform"
        :class="{ 'rotate-180': preferencesOpen }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  </aside>
</template>
