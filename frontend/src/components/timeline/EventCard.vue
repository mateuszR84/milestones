<script setup lang="ts">
import { computed } from 'vue'
import type { MilestoneEvent } from '../../types'
import { DEFAULT_EVENT_CARD_COLOR, EVENT_CARD_COLORS } from '../../constants/eventColors'

const props = defineProps<{ event: MilestoneEvent }>()
const emit = defineEmits<{ select: [id: number] }>()

const colorClasses = computed(() => (props.event.color ? EVENT_CARD_COLORS[props.event.color] : DEFAULT_EVENT_CARD_COLOR))
</script>

<template>
  <button
    type="button"
    class="w-56 cursor-pointer rounded-xl border p-3 text-left shadow-lg shadow-black/5 backdrop-blur-md transition hover:brightness-105"
    :class="colorClasses"
    @click="emit('select', event.id)"
  >
    <p class="truncate border-b border-black/10 pb-1.5 text-sm font-semibold text-neutral-900">
      {{ event.title }}
    </p>
    <p v-if="event.description" class="mt-1.5 line-clamp-2 text-xs text-neutral-700">
      {{ event.description }}
    </p>
    <div v-if="event.external_link" class="mt-2 border-t border-black/10 pt-1.5">
      <a
        :href="event.external_link"
        target="_blank"
        rel="noopener"
        class="text-xs text-violet-700 underline"
        @click.stop
      >
        {{ $t('eventCard.link') }}
      </a>
    </div>
  </button>
</template>
