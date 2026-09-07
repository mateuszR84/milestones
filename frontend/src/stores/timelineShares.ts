import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as sharesApi from '../api/timelineShares'
import type { TimelineShare } from '../types'

export const useTimelineSharesStore = defineStore('timelineShares', () => {
  const given = ref<TimelineShare[]>([])
  const received = ref<TimelineShare[]>([])

  async function load(): Promise<void> {
    const data = await sharesApi.fetchTimelineShares()
    given.value = data.given
    received.value = data.received
  }

  async function shareWith(email: string): Promise<void> {
    await sharesApi.shareTimelineWith(email)
    await load()
  }

  async function revoke(id: number): Promise<void> {
    await sharesApi.revokeTimelineShare(id)
    await load()
  }

  return { given, received, load, shareWith, revoke }
})
