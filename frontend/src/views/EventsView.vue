<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useEventsStore } from '../stores/events'
import { DEFAULT_EVENT_CARD_COLOR, EVENT_CARD_COLORS } from '../constants/eventColors'
import EventModal from '../components/timeline/EventModal.vue'
import type { MilestoneEvent } from '../types'

const auth = useAuthStore()
const eventsStore = useEventsStore()
const { locale } = useI18n()

const selectedEventId = ref<number | null>(null)
const selectedEvent = computed(() => eventsStore.events.find((e) => e.id === selectedEventId.value) ?? null)

const dateFormat = computed(() => new Intl.DateTimeFormat(locale.value === 'pl' ? 'pl-PL' : 'en-US', { dateStyle: 'long' }))

const sortedEvents = computed(() =>
  [...eventsStore.events].sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()),
)

function colorClasses(event: MilestoneEvent): string {
  return event.color ? EVENT_CARD_COLORS[event.color] : DEFAULT_EVENT_CARD_COLOR
}

onMounted(() => {
  if (auth.user) eventsStore.loadForUser(auth.user.id)
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-6 py-8">
    <h2 class="mb-4 text-lg font-medium text-neutral-900">{{ $t('nav.events') }}</h2>

    <ul class="space-y-2">
      <li v-for="event in sortedEvents" :key="event.id">
        <button
          type="button"
          class="w-full rounded-xl border p-4 text-left shadow-sm backdrop-blur-md transition hover:brightness-105"
          :class="colorClasses(event)"
          @click="selectedEventId = event.id"
        >
          <div class="flex items-baseline justify-between gap-3">
            <p class="truncate text-sm font-semibold text-neutral-900">{{ event.title }}</p>
            <p class="shrink-0 text-xs text-neutral-600">{{ dateFormat.format(new Date(event.event_date)) }}</p>
          </div>
          <p v-if="event.description" class="mt-1 line-clamp-2 text-xs text-neutral-700">{{ event.description }}</p>
        </button>
      </li>
      <li v-if="!sortedEvents.length" class="text-sm text-neutral-400">{{ $t('events.empty') }}</li>
    </ul>

    <EventModal v-if="selectedEvent" :event="selectedEvent" @close="selectedEventId = null" />
  </div>
</template>
