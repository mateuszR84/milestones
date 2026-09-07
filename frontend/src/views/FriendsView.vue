<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFriendsStore } from '../stores/friends'
import { useTimelineSharesStore } from '../stores/timelineShares'

const friendsStore = useFriendsStore()
const sharesStore = useTimelineSharesStore()

const friendEmail = ref('')
const shareEmail = ref('')
const message = ref('')

onMounted(async () => {
  await Promise.all([friendsStore.loadAll(), sharesStore.load()])
})

async function sendRequest() {
  message.value = ''
  try {
    await friendsStore.sendRequest(friendEmail.value)
    friendEmail.value = ''
    message.value = 'Zaproszenie wysłane.'
  } catch {
    message.value = 'Nie udało się wysłać zaproszenia.'
  }
}

async function shareTimeline() {
  message.value = ''
  try {
    await sharesStore.shareWith(shareEmail.value)
    shareEmail.value = ''
    message.value = 'Oś czasu udostępniona.'
  } catch {
    message.value = 'Nie udało się udostępnić osi czasu (czy to Twój znajomy?).'
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-6 py-8 space-y-10">
    <section>
      <h2 class="text-lg font-medium text-neutral-900">Zaproszenia oczekujące</h2>
      <ul class="mt-3 space-y-2">
        <li
          v-for="req in friendsStore.incomingRequests"
          :key="req.id"
          class="flex items-center justify-between rounded border border-neutral-200 px-4 py-2"
        >
          <span class="text-sm text-neutral-700">{{ req.requester?.name }} ({{ req.requester?.email }})</span>
          <div class="flex gap-2">
            <button class="text-sm text-neutral-900 underline" @click="friendsStore.accept(req.id)">Przyjmij</button>
            <button class="text-sm text-neutral-400 underline" @click="friendsStore.decline(req.id)">Odrzuć</button>
          </div>
        </li>
        <li v-if="!friendsStore.incomingRequests.length" class="text-sm text-neutral-400">Brak oczekujących zaproszeń.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-lg font-medium text-neutral-900">Znajomi</h2>
      <ul class="mt-3 space-y-2">
        <li
          v-for="friend in friendsStore.friends"
          :key="friend.id"
          class="flex items-center justify-between rounded border border-neutral-200 px-4 py-2"
        >
          <span class="text-sm text-neutral-700">{{ friend.name }} ({{ friend.email }})</span>
          <router-link :to="`/timeline/${friend.id}`" class="text-sm text-neutral-900 underline">Oś czasu</router-link>
        </li>
        <li v-if="!friendsStore.friends.length" class="text-sm text-neutral-400">Nie masz jeszcze znajomych.</li>
      </ul>

      <form class="mt-4 flex gap-2" @submit.prevent="sendRequest">
        <input
          v-model="friendEmail"
          type="email"
          required
          placeholder="e-mail znajomego"
          class="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
        <button type="submit" class="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
          Zaproś
        </button>
      </form>
    </section>

    <section>
      <h2 class="text-lg font-medium text-neutral-900">Udostępnianie osi czasu</h2>
      <p class="mt-1 text-sm text-neutral-500">Wybrani znajomi zobaczą Twoją oś czasu (tylko podgląd).</p>

      <ul class="mt-3 space-y-2">
        <li
          v-for="share in sharesStore.given"
          :key="share.id"
          class="flex items-center justify-between rounded border border-neutral-200 px-4 py-2"
        >
          <span class="text-sm text-neutral-700">{{ share.shared_with?.name }} ({{ share.shared_with?.email }})</span>
          <button class="text-sm text-neutral-400 underline" @click="sharesStore.revoke(share.id)">Odbierz dostęp</button>
        </li>
        <li v-if="!sharesStore.given.length" class="text-sm text-neutral-400">Nie udostępniłeś jeszcze swojej osi czasu.</li>
      </ul>

      <form class="mt-4 flex gap-2" @submit.prevent="shareTimeline">
        <input
          v-model="shareEmail"
          type="email"
          required
          placeholder="e-mail znajomego"
          class="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
        <button type="submit" class="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
          Udostępnij
        </button>
      </form>

      <div v-if="sharesStore.received.length" class="mt-6">
        <h3 class="text-sm font-medium text-neutral-700">Osie czasu udostępnione Tobie</h3>
        <ul class="mt-2 space-y-2">
          <li
            v-for="share in sharesStore.received"
            :key="share.id"
            class="flex items-center justify-between rounded border border-neutral-200 px-4 py-2"
          >
            <span class="text-sm text-neutral-700">{{ share.owner?.name }}</span>
            <router-link :to="`/timeline/${share.owner_id}`" class="text-sm text-neutral-900 underline">Zobacz</router-link>
          </li>
        </ul>
      </div>
    </section>

    <p v-if="message" class="text-sm text-neutral-600">{{ message }}</p>
  </div>
</template>
