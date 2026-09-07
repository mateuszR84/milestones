<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ScaleTime } from 'd3-scale'
import { measureTextWidth } from '../../composables/measureText'

const props = defineProps<{
  scale: ScaleTime<number, number>
  axisY: number
  width: number
}>()

const { locale } = useI18n()

const MAX_DAY_TICK_SPAN_MS = 46 * 86_400_000

const intlLocale = computed(() => (locale.value === 'pl' ? 'pl-PL' : 'en-US'))

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function eachDay(start: Date, end: Date): Date[] {
  const days: Date[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  while (cursor <= last) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

/** Mimics d3's default multi-resolution tick format (year / month / month+day), locale-aware. */
function formatCoarseTick(date: Date, monthFormat: Intl.DateTimeFormat, yearFormat: Intl.DateTimeFormat): string {
  if (date.getMonth() === 0 && date.getDate() === 1) return yearFormat.format(date)
  if (date.getDate() === 1) return monthFormat.format(date)
  return `${monthFormat.format(date)} ${date.getDate()}`
}

const ticks = computed(() => {
  const [start, end] = props.scale.domain()
  const today = new Date()
  const weekdayFormat = new Intl.DateTimeFormat(intlLocale.value, { weekday: 'short' })

  if (end.getTime() - start.getTime() <= MAX_DAY_TICK_SPAN_MS) {
    return eachDay(start, end).map((date) => {
      const today_ = isSameDay(date, today)
      const label = today_ ? `${weekdayFormat.format(date)}, ${date.getDate()}` : String(date.getDate())
      return {
        x: props.scale(date),
        label,
        isToday: today_,
      }
    })
  }

  const monthFormat = new Intl.DateTimeFormat(intlLocale.value, { month: 'short' })
  const yearFormat = new Intl.DateTimeFormat(intlLocale.value, { year: 'numeric' })
  return props.scale.ticks(8).map((date) => ({
    x: props.scale(date),
    label: formatCoarseTick(date, monthFormat, yearFormat),
    isToday: false,
  }))
})
</script>

<template>
  <g>
    <line :x1="0" :y1="axisY" :x2="width" :y2="axisY" stroke="currentColor" class="text-neutral-300" stroke-width="1" />
    <g v-for="tick in ticks" :key="tick.x" :transform="`translate(${tick.x}, ${axisY})`">
      <template v-if="tick.isToday">
        <rect
          :x="-(measureTextWidth(tick.label, '600 12px system-ui, sans-serif') / 2 + 10)"
          y="8"
          :width="measureTextWidth(tick.label, '600 12px system-ui, sans-serif') + 20"
          height="22"
          rx="11"
          class="fill-violet-600"
        />
        <text y="23" text-anchor="middle" class="fill-white text-[12px] font-semibold">{{ tick.label }}</text>
      </template>
      <text v-else y="24" text-anchor="middle" class="fill-neutral-400 text-[11px]">{{ tick.label }}</text>
    </g>
  </g>
</template>
