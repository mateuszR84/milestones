import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as friendsApi from '../api/friends'
import type { Friendship, User } from '../types'

export const useFriendsStore = defineStore('friends', () => {
  const friends = ref<User[]>([])
  const incomingRequests = ref<Friendship[]>([])

  async function loadAll(): Promise<void> {
    ;[friends.value, incomingRequests.value] = await Promise.all([
      friendsApi.fetchFriends(),
      friendsApi.fetchFriendRequests(),
    ])
  }

  async function sendRequest(email: string): Promise<void> {
    await friendsApi.sendFriendRequest(email)
  }

  async function accept(id: number): Promise<void> {
    await friendsApi.acceptFriendRequest(id)
    await loadAll()
  }

  async function decline(id: number): Promise<void> {
    await friendsApi.declineFriendRequest(id)
    await loadAll()
  }

  async function remove(id: number): Promise<void> {
    await friendsApi.removeFriend(id)
    await loadAll()
  }

  return { friends, incomingRequests, loadAll, sendRequest, accept, decline, remove }
})
