<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ViewPreset } from '../../composables/useTimelineScale'

const emit = defineEmits<{ select: [preset: ViewPreset] }>()

const { t } = useI18n()

const presets = computed<{ value: ViewPreset; label: string }[]>(() => [
  { value: 'week', label: t('timeline.rangeWeek') },
  { value: 'month', label: t('timeline.rangeMonth') },
  { value: 'quarter', label: t('timeline.rangeQuarter') },
  { value: 'year', label: t('timeline.rangeYear') },
])
</script>

<template>
  <div class="flex gap-1 rounded-full border border-white/50 bg-white/70 p-1 shadow-md backdrop-blur-md">
    <button
      v-for="preset in presets"
      :key="preset.value"
      type="button"
      class="rounded-full px-3 py-1 text-xs font-medium text-neutral-600 transition hover:bg-white hover:text-neutral-900"
      @click="emit('select', preset.value)"
    >
      {{ preset.label }}
    </button>
  </div>
</template>
