<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useEventsStore } from '../../stores/events'
import type { MilestoneEvent } from '../../types'

const props = defineProps<{ event: MilestoneEvent }>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuthStore()
const eventsStore = useEventsStore()

const isOwner = computed(() => auth.user?.id === props.event.user_id)
const confirmingDelete = ref(false)

async function remove() {
  await eventsStore.remove(props.event.id)
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-4" @click.self="emit('close')">
    <div class="w-full max-w-lg space-y-4 rounded-lg bg-white p-6 shadow-xl">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-lg font-medium text-neutral-900">{{ event.title }}</h2>
          <p class="text-sm text-neutral-500">{{ event.event_date }}</p>
        </div>
        <button class="text-neutral-400 hover:text-neutral-600" @click="emit('close')">✕</button>
      </div>

      <p v-if="event.description" class="text-sm text-neutral-700">{{ event.description }}</p>

      <div v-if="event.photos.length" class="grid grid-cols-3 gap-2">
        <img
          v-for="photo in event.photos"
          :key="photo.id"
          :src="photo.url"
          class="aspect-square w-full rounded object-cover"
        />
      </div>

      <p v-if="event.participants.length" class="text-sm text-neutral-500">
        Z udziałem: {{ event.participants.map((p) => p.name).join(', ') }}
      </p>

      <a v-if="event.external_link" :href="event.external_link" target="_blank" rel="noopener" class="block text-sm text-neutral-900 underline">
        Więcej zdjęć →
      </a>

      <div v-if="isOwner" class="flex justify-end items-center gap-3 pt-2">
        <template v-if="confirmingDelete">
          <span class="text-sm text-neutral-500">Na pewno usunąć?</span>
          <button class="text-sm text-neutral-500 underline" @click="confirmingDelete = false">Anuluj</button>
          <button class="text-sm text-red-600 underline" @click="remove">Usuń</button>
        </template>
        <button v-else class="text-sm text-red-600 underline" @click="confirmingDelete = true">Usuń wydarzenie</button>
      </div>
    </div>
  </div>
</template>
