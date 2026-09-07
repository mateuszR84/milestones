<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventsStore } from '../../stores/events'
import FriendPicker from '../friends/FriendPicker.vue'

const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()
const eventsStore = useEventsStore()

const title = ref('')
const description = ref('')
const eventDate = ref(new Date().toISOString().slice(0, 10))
const externalLink = ref('')
const participantIds = ref<number[]>([])
const photos = ref<File[]>([])
const error = ref('')
const submitting = ref(false)

function onFilesChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (files.length > 5) {
    error.value = t('eventForm.tooManyPhotos')
    return
  }
  error.value = ''
  photos.value = files
}

async function submit() {
  error.value = ''
  submitting.value = true
  try {
    await eventsStore.create({
      title: title.value,
      description: description.value || undefined,
      event_date: eventDate.value,
      external_link: externalLink.value || undefined,
      photos: photos.value,
      participant_ids: participantIds.value,
    })
    emit('close')
  } catch {
    error.value = t('eventForm.saveError')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-4" @click.self="emit('close')">
    <form class="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl" @submit.prevent="submit">
      <h2 class="text-lg font-medium text-neutral-900">{{ $t('eventForm.title') }}</h2>

      <div>
        <label class="block text-sm text-neutral-600">{{ $t('eventForm.titleLabel') }}</label>
        <input v-model="title" type="text" required maxlength="255" class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm text-neutral-600">{{ $t('eventForm.descriptionLabel') }}</label>
        <textarea v-model="description" rows="2" maxlength="2000" class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm text-neutral-600">{{ $t('eventForm.dateLabel') }}</label>
        <input v-model="eventDate" type="date" required class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm text-neutral-600">{{ $t('eventForm.linkLabel') }}</label>
        <input v-model="externalLink" type="url" :placeholder="$t('eventForm.linkPlaceholder')" class="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm text-neutral-600">{{ $t('eventForm.photosLabel') }}</label>
        <input type="file" accept="image/*" multiple class="mt-1 w-full text-sm" @change="onFilesChange" />
      </div>

      <div>
        <label class="mb-1 block text-sm text-neutral-600">{{ $t('eventForm.friendsLabel') }}</label>
        <FriendPicker v-model="participantIds" />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="rounded px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-50" @click="emit('close')">
          {{ $t('eventForm.cancel') }}
        </button>
        <button type="submit" :disabled="submitting" class="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50">
          {{ $t('eventForm.save') }}
        </button>
      </div>
    </form>
  </div>
</template>
