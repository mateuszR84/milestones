<script setup lang="ts">
import { onMounted } from 'vue'
import { useFriendsStore } from '../../stores/friends'

const modelValue = defineModel<number[]>({ default: () => [] })
const friendsStore = useFriendsStore()

onMounted(() => {
  if (!friendsStore.friends.length) friendsStore.loadAll()
})

function toggle(id: number) {
  modelValue.value = modelValue.value.includes(id)
    ? modelValue.value.filter((existing) => existing !== id)
    : [...modelValue.value, id]
}
</script>

<template>
  <div>
    <p v-if="!friendsStore.friends.length" class="text-sm text-neutral-400">Nie masz jeszcze znajomych do otagowania.</p>
    <div v-else class="flex flex-wrap gap-2">
      <button
        v-for="friend in friendsStore.friends"
        :key="friend.id"
        type="button"
        class="rounded-full border px-3 py-1 text-sm"
        :class="modelValue.includes(friend.id) ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'"
        @click="toggle(friend.id)"
      >
        {{ friend.name }}
      </button>
    </div>
  </div>
</template>
