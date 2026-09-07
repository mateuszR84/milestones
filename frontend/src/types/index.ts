export interface User {
  id: number
  name: string
  email: string
}

export interface Friendship {
  id: number
  requester_id: number
  recipient_id: number
  status: 'pending' | 'accepted' | 'declined'
  requester?: User
  recipient?: User
}

export interface TimelineShare {
  id: number
  owner_id: number
  shared_with_id: number
  owner?: User
  shared_with?: User
}

export interface EventPhoto {
  id: number
  event_id: number
  path: string
  position: number
  url: string
}

export type EventColor = 'violet' | 'blue' | 'peach' | 'pink' | 'sky' | 'amber'

export interface MilestoneEvent {
  id: number
  user_id: number
  title: string
  description: string | null
  event_date: string
  external_link: string | null
  color: EventColor | null
  photos: EventPhoto[]
  participants: User[]
}
