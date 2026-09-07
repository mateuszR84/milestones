<script setup lang="ts">
import { computed } from 'vue'
import type { ScaleTime } from 'd3-scale'

const props = defineProps<{
  scale: ScaleTime<number, number>
  axisY: number
  width: number
}>()

const ticks = computed(() => {
  const format = props.scale.tickFormat()
  return props.scale.ticks(8).map((date) => ({
    x: props.scale(date),
    label: format(date),
  }))
})
</script>

<template>
  <g>
    <line :x1="0" :y1="axisY" :x2="width" :y2="axisY" stroke="currentColor" class="text-neutral-300" stroke-width="1" />
    <g v-for="tick in ticks" :key="tick.x" :transform="`translate(${tick.x}, ${axisY})`">
      <line y1="0" y2="8" stroke="currentColor" class="text-neutral-300" stroke-width="1" />
      <text y="22" text-anchor="middle" class="fill-neutral-500 text-[11px]">{{ tick.label }}</text>
    </g>
  </g>
</template>
