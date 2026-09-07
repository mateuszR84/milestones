<script setup lang="ts">
import { computed } from 'vue'
import type { ScaleTime } from 'd3-scale'
import type { MilestoneEvent } from '../../types'

const props = defineProps<{
  scale: ScaleTime<number, number>
  events: MilestoneEvent[]
  axisY: number
}>()

const emit = defineEmits<{ select: [id: number] }>()

const markers = computed(() => {
  const [domainStart, domainEnd] = props.scale.domain()
  return props.events
    .filter((event) => {
      const date = new Date(event.event_date)
      return date >= domainStart && date <= domainEnd
    })
    .map((event) => ({
      id: event.id,
      x: props.scale(new Date(event.event_date)),
    }))
})
</script>

<template>
  <g>
    <g v-for="marker in markers" :key="marker.id" class="cursor-pointer" @click="emit('select', marker.id)">
      <line
        :x1="marker.x"
        :y1="0"
        :x2="marker.x"
        :y2="axisY"
        stroke="currentColor"
        class="text-neutral-400"
        stroke-width="1.5"
        stroke-dasharray="4 4"
        opacity="0.6"
      />
      <circle :cx="marker.x" :cy="axisY" r="3" class="fill-neutral-900" />
    </g>
  </g>
</template>
