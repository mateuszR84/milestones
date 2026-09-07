<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useEventsStore } from '../stores/events'
import { useTimelineScale } from '../composables/useTimelineScale'
import { assignCardLanes } from '../composables/useCardLanes'
import TimelineAxis from '../components/timeline/TimelineAxis.vue'
import TimelineMarkers from '../components/timeline/TimelineMarkers.vue'
import EventCard from '../components/timeline/EventCard.vue'
import TimelineRangeControls from '../components/timeline/TimelineRangeControls.vue'
import EventModal from '../components/timeline/EventModal.vue'
import EventForm from '../components/timeline/EventForm.vue'

const route = useRoute()
const auth = useAuthStore()
const eventsStore = useEventsStore()

const containerRef = ref<HTMLElement | null>(null)
const width = ref(0)
const height = ref(0)
const AXIS_BOTTOM_MARGIN = 40
const axisY = computed(() => Math.max(height.value - AXIS_BOTTOM_MARGIN, 0))

const timelineUserId = computed(() => {
  const routeUserId = route.params.userId
  return routeUserId ? Number(routeUserId) : auth.user!.id
})

const isOwnTimeline = computed(() => timelineUserId.value === auth.user?.id)

// Measuring the container must happen before useTimelineScale's own onMounted
// runs (registration order = execution order), otherwise it computes the
// initial "current month" view against a width of 0.
onMounted(() => {
  if (containerRef.value) {
    width.value = containerRef.value.clientWidth
    height.value = containerRef.value.clientHeight
    const observer = new ResizeObserver(() => {
      width.value = containerRef.value?.clientWidth ?? 0
      height.value = containerRef.value?.clientHeight ?? 0
    })
    observer.observe(containerRef.value)
  }
})

const { currentScale, viewPreset, hasWandered } = useTimelineScale(containerRef, width)

const selectedEventId = ref<number | null>(null)
const showForm = ref(false)

const selectedEvent = computed(() => eventsStore.events.find((e) => e.id === selectedEventId.value) ?? null)

const todayX = computed(() => {
  const [start, end] = currentScale.value.domain()
  const today = new Date()
  if (today < start || today > end) return null
  return currentScale.value(today)
})

const CARD_WIDTH = 224
const CARD_LANES = 3

const cardPlacements = computed(() => {
  const [start, end] = currentScale.value.domain()
  const visible = eventsStore.events
    .filter((event) => {
      const date = new Date(event.event_date)
      return date >= start && date <= end
    })
    .map((event) => ({ x: currentScale.value(new Date(event.event_date)), event }))

  return assignCardLanes(visible, { laneCount: CARD_LANES, cardWidth: CARD_WIDTH, gap: 16 })
})

function laneCenterY(lane: number): number {
  const laneHeight = axisY.value / CARD_LANES
  return laneHeight * lane + laneHeight / 2
}

function loadTimeline() {
  eventsStore.loadForUser(timelineUserId.value)
}

onMounted(loadTimeline)
watch(timelineUserId, loadTimeline)
</script>

<template>
  <div class="relative flex-1">
    <div ref="containerRef" class="absolute inset-0 touch-none select-none overflow-hidden">
      <svg v-if="width && height" :width="width" :height="height">
        <line
          v-if="todayX !== null"
          :x1="todayX"
          :y1="0"
          :x2="todayX"
          :y2="axisY"
          stroke="#7c3aed"
          stroke-width="1.5"
          stroke-dasharray="4 4"
          opacity="0.45"
        />
        <TimelineAxis :scale="currentScale" :axis-y="axisY" :width="width" />
        <TimelineMarkers :scale="currentScale" :events="eventsStore.events" :axis-y="axisY" @select="selectedEventId = $event" />
      </svg>

      <div
        v-for="placement in cardPlacements"
        :key="placement.event.id"
        class="absolute"
        :style="{ left: `${placement.x + 14}px`, top: `${laneCenterY(placement.lane)}px`, transform: 'translateY(-50%)' }"
      >
        <EventCard :event="placement.event" @select="selectedEventId = $event" />
      </div>

      <div class="absolute left-1/2 flex -translate-x-1/2 items-center gap-2" :style="{ top: `${axisY - 44}px` }">
        <button
          v-if="hasWandered"
          type="button"
          class="rounded-full bg-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-md transition hover:bg-violet-500"
          @click="viewPreset('month')"
        >
          {{ $t('timeline.jumpToToday') }}
        </button>
        <TimelineRangeControls @select="viewPreset" />
      </div>
    </div>

    <button
      v-if="isOwnTimeline"
      class="fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-2xl text-white shadow-lg hover:bg-neutral-700"
      :aria-label="$t('timeline.addEvent')"
      @click="showForm = true"
    >
      +
    </button>

    <EventModal v-if="selectedEvent" :event="selectedEvent" @close="selectedEventId = null" />
    <EventForm v-if="showForm" @close="showForm = false" />
  </div>
</template>
