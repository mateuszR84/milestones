import { apiClient } from './client'
import type { Friendship, User } from '../types'

export async function fetchFriends(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>('/api/friends')
  return data
}

export async function fetchFriendRequests(): Promise<Friendship[]> {
  const { data } = await apiClient.get<Friendship[]>('/api/friends/requests')
  return data
}

export async function sendFriendRequest(email: string): Promise<Friendship> {
  const { data } = await apiClient.post<Friendship>('/api/friends/requests', { email })
  return data
}

export async function acceptFriendRequest(id: number): Promise<Friendship> {
  const { data } = await apiClient.post<Friendship>(`/api/friends/requests/${id}/accept`)
  return data
}

export async function declineFriendRequest(id: number): Promise<Friendship> {
  const { data } = await apiClient.post<Friendship>(`/api/friends/requests/${id}/decline`)
  return data
}

export async function removeFriend(id: number): Promise<void> {
  await apiClient.delete(`/api/friends/${id}`)
}
