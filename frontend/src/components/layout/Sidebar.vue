<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'
import { SUPPORTED_LOCALES, setLocale, type SupportedLocale } from '../../i18n'

const auth = useAuthStore()
const { locale, t } = useI18n()

const initial = computed(() => auth.user?.name?.trim()?.charAt(0)?.toUpperCase() ?? '?')
</script>

<template>
  <aside class="flex w-56 shrink-0 flex-col border-r border-white/40 bg-white/30 backdrop-blur-xl">
    <div class="flex-1 px-4 py-3">
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

    <div v-if="auth.user" class="flex items-center gap-3 border-t border-white/40 px-4 py-3">
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white">
        {{ initial }}
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm font-medium text-neutral-800">{{ auth.user.name }}</p>
        <p class="truncate text-xs text-neutral-500">{{ auth.user.email }}</p>
      </div>
    </div>
  </aside>
</template>
