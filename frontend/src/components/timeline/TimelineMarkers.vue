<script setup lang="ts">
import { computed } from 'vue'
import type { ScaleTime } from 'd3-scale'
import type { MilestoneEvent } from '../../types'
import { stackLabels } from '../../composables/useLabelStacking'
import { measureTextWidth } from '../../composables/measureText'

const props = defineProps<{
  scale: ScaleTime<number, number>
  events: MilestoneEvent[]
  axisY: number
}>()

const emit = defineEmits<{ select: [id: number] }>()

const LANE_HEIGHT = 34
const LABEL_BASELINE_OFFSET = 26

const markers = computed(() => {
  const [domainStart, domainEnd] = props.scale.domain()
  const visible = props.events.filter((e) => {
    const d = new Date(e.event_date)
    return d >= domainStart && d <= domainEnd
  })

  const items = visible.map((event) => ({
    id: event.id,
    x: props.scale(new Date(event.event_date)),
    width: measureTextWidth(event.title) + 8,
    label: event.title,
  }))

  const stacked = stackLabels(items, { maxLanes: 4, gap: 14 })

  return stacked.map((s) => ({
    ...s,
    displayLabel: s.extraCount > 0 ? `${s.label} +${s.extraCount}` : s.label,
    labelY: props.axisY - LABEL_BASELINE_OFFSET - s.lane * LANE_HEIGHT,
  }))
})
</script>

<template>
  <g>
    <g v-for="marker in markers" :key="marker.id" class="cursor-pointer" @click="emit('select', marker.id)">
      <line
        :x1="marker.x"
        :y1="axisY"
        :x2="marker.x"
        :y2="marker.labelY + 4"
        stroke="currentColor"
        class="text-neutral-300"
        stroke-width="1"
      />
      <circle :cx="marker.x" :cy="axisY" r="3" class="fill-neutral-900" />
      <text
        :x="marker.x"
        :y="marker.labelY"
        class="fill-neutral-800 text-[13px] font-medium hover:fill-neutral-500"
      >{{ marker.displayLabel }}</text>
      <line
        :x1="marker.x"
        :y1="marker.labelY + 4"
        :x2="marker.x + marker.width - 8"
        :y2="marker.labelY + 4"
        stroke="currentColor"
        class="text-neutral-300"
        stroke-width="1"
      />
    </g>
  </g>
</template>
