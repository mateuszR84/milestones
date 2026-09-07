import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as eventsApi from '../api/events'
import type { MilestoneEvent } from '../types'
import type { CreateEventPayload } from '../api/events'

export const useEventsStore = defineStore('events', () => {
  const events = ref<MilestoneEvent[]>([])
  const timelineUserId = ref<number | null>(null)
  const loading = ref(false)

  async function loadForUser(userId: number): Promise<void> {
    loading.value = true
    timelineUserId.value = userId
    try {
      events.value = await eventsApi.fetchEventsForUser(userId)
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CreateEventPayload): Promise<void> {
    await eventsApi.createEvent(payload)
    if (timelineUserId.value) await loadForUser(timelineUserId.value)
  }

  async function remove(id: number): Promise<void> {
    await eventsApi.deleteEvent(id)
    events.value = events.value.filter((e) => e.id !== id)
  }

  return { events, loading, timelineUserId, loadForUser, create, remove }
})
