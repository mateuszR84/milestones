import type { EventColor } from '../types'

export const EVENT_CARD_COLORS: Record<EventColor, string> = {
  violet: 'bg-violet-100/80 border-violet-200/70',
  blue: 'bg-blue-100/80 border-blue-200/70',
  peach: 'bg-orange-100/80 border-orange-200/70',
  pink: 'bg-pink-100/80 border-pink-200/70',
  sky: 'bg-sky-100/80 border-sky-200/70',
  amber: 'bg-amber-100/80 border-amber-200/70',
}

export const DEFAULT_EVENT_CARD_COLOR = 'bg-white/85 border-white/60'
