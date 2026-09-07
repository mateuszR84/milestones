import { apiClient } from './client'
import type { TimelineShare } from '../types'

export async function fetchTimelineShares(): Promise<{ given: TimelineShare[]; received: TimelineShare[] }> {
  const { data } = await apiClient.get('/api/timeline-shares')
  return data
}

export async function shareTimelineWith(email: string): Promise<TimelineShare> {
  const { data } = await apiClient.post<TimelineShare>('/api/timeline-shares', { email })
  return data
}

export async function revokeTimelineShare(id: number): Promise<void> {
  await apiClient.delete(`/api/timeline-shares/${id}`)
}
