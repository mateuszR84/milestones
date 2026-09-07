import { apiClient } from './client'
import type { MilestoneEvent } from '../types'

export async function fetchEventsForUser(
  userId: number,
  range?: { from?: string; to?: string },
): Promise<MilestoneEvent[]> {
  const { data } = await apiClient.get<MilestoneEvent[]>(`/api/timelines/${userId}/events`, {
    params: range,
  })
  return data
}

export interface CreateEventPayload {
  title: string
  description?: string
  event_date: string
  external_link?: string
  photos?: File[]
  participant_ids?: number[]
}

export async function createEvent(payload: CreateEventPayload): Promise<MilestoneEvent> {
  const form = new FormData()
  form.append('title', payload.title)
  if (payload.description) form.append('description', payload.description)
  form.append('event_date', payload.event_date)
  if (payload.external_link) form.append('external_link', payload.external_link)
  payload.photos?.forEach((photo) => form.append('photos[]', photo))
  payload.participant_ids?.forEach((id) => form.append('participant_ids[]', String(id)))

  const { data } = await apiClient.post<MilestoneEvent>('/api/events', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function fetchEvent(id: number): Promise<MilestoneEvent> {
  const { data } = await apiClient.get<MilestoneEvent>(`/api/events/${id}`)
  return data
}

export async function updateEvent(
  id: number,
  payload: Partial<Pick<MilestoneEvent, 'title' | 'description' | 'event_date' | 'external_link'>> & {
    participant_ids?: number[]
  },
): Promise<MilestoneEvent> {
  const { data } = await apiClient.put<MilestoneEvent>(`/api/events/${id}`, payload)
  return data
}

export async function deleteEvent(id: number): Promise<void> {
  await apiClient.delete(`/api/events/${id}`)
}

export async function addEventPhoto(eventId: number, photo: File) {
  const form = new FormData()
  form.append('photo', photo)
  const { data } = await apiClient.post(`/api/events/${eventId}/photos`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteEventPhoto(eventId: number, photoId: number): Promise<void> {
  await apiClient.delete(`/api/events/${eventId}/photos/${photoId}`)
}
