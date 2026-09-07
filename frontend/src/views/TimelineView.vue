<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useEventsStore } from '../stores/events'
import { useTimelineScale } from '../composables/useTimelineScale'
import TimelineAxis from '../components/timeline/TimelineAxis.vue'
import TimelineMarkers from '../components/timeline/TimelineMarkers.vue'
import ZoomControls from '../components/timeline/ZoomControls.vue'
import EventModal from '../components/timeline/EventModal.vue'
import EventForm from '../components/timeline/EventForm.vue'

const route = useRoute()
const auth = useAuthStore()
const eventsStore = useEventsStore()

const containerRef = ref<HTMLElement | null>(null)
const width = ref(0)
const axisY = 280

const timelineUserId = computed(() => {
  const routeUserId = route.params.userId
  return routeUserId ? Number(routeUserId) : auth.user!.id
})

const isOwnTimeline = computed(() => timelineUserId.value === auth.user?.id)

const { currentScale, zoomIn, zoomOut } = useTimelineScale(containerRef, width)

const selectedEventId = ref<number | null>(null)
const showForm = ref(false)

const selectedEvent = computed(() => eventsStore.events.find((e) => e.id === selectedEventId.value) ?? null)

function loadTimeline() {
  eventsStore.loadForUser(timelineUserId.value)
}

onMounted(() => {
  loadTimeline()

  if (containerRef.value) {
    width.value = containerRef.value.clientWidth
    const observer = new ResizeObserver(() => {
      width.value = containerRef.value?.clientWidth ?? 0
    })
    observer.observe(containerRef.value)
  }
})

watch(timelineUserId, loadTimeline)
</script>

<template>
  <div class="relative flex-1">
    <div ref="containerRef" class="relative h-[420px] w-full touch-none select-none overflow-hidden">
      <svg v-if="width" :width="width" height="420">
        <TimelineAxis :scale="currentScale" :axis-y="axisY" :width="width" />
        <TimelineMarkers :scale="currentScale" :events="eventsStore.events" :axis-y="axisY" @select="selectedEventId = $event" />
      </svg>

      <ZoomControls @zoom-in="zoomIn" @zoom-out="zoomOut" />
    </div>

    <button
      v-if="isOwnTimeline"
      class="fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-2xl text-white shadow-lg hover:bg-neutral-700"
      aria-label="Dodaj wydarzenie"
      @click="showForm = true"
    >
      +
    </button>

    <EventModal v-if="selectedEvent" :event="selectedEvent" @close="selectedEventId = null" />
    <EventForm v-if="showForm" @close="showForm = false" />
  </div>
</template>
