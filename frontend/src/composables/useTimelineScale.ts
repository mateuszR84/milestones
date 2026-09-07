import { scaleTime, type ScaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom'
import { computed, onMounted, onUnmounted, ref, shallowRef, watch, type Ref } from 'vue'

export type ZoomLevel = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'multi-year'
export type ViewPreset = 'week' | 'month' | 'quarter' | 'year'

function levelForSpanMs(spanMs: number): ZoomLevel {
  const day = 86_400_000
  if (spanMs <= day * 3) return 'day'
  if (spanMs <= day * 21) return 'week'
  if (spanMs <= day * 120) return 'month'
  if (spanMs <= day * 500) return 'quarter'
  if (spanMs <= day * 365 * 6) return 'year'
  return 'multi-year'
}

/** Calendar range (start/end, inclusive) containing `date` for the given preset. */
function rangeForPreset(preset: ViewPreset, date: Date): [Date, Date] {
  const year = date.getFullYear()
  const month = date.getMonth()

  switch (preset) {
    case 'week': {
      const day = date.getDay()
      const mondayOffset = day === 0 ? -6 : 1 - day
      const monday = new Date(year, month, date.getDate() + mondayOffset)
      const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6)
      return [monday, sunday]
    }
    case 'month':
      return [new Date(year, month, 1), new Date(year, month + 1, 0)]
    case 'quarter': {
      const quarterStartMonth = Math.floor(month / 3) * 3
      return [new Date(year, quarterStartMonth, 1), new Date(year, quarterStartMonth + 3, 0)]
    }
    case 'year':
      return [new Date(year, 0, 1), new Date(year, 11, 31)]
  }
}

export function useTimelineScale(containerRef: Ref<HTMLElement | null>, width: Ref<number>) {
  const domainStart = new Date(new Date().getFullYear() - 60, 0, 1)
  const domainEnd = new Date(new Date().getFullYear() + 1, 0, 1)

  const baseScale = scaleTime().domain([domainStart, domainEnd])
  const currentScale = shallowRef<ScaleTime<number, number>>(baseScale.copy())
  const transform = ref<ZoomTransform>(zoomIdentity)
  const hasWandered = ref(false)

  let zoomBehavior: ZoomBehavior<HTMLElement, unknown> | null = null

  function applyRange() {
    baseScale.range([0, width.value])
    currentScale.value = transform.value.rescaleX(baseScale)
  }

  /** Instantly frames the given calendar range, with a small pixel margin on each side. */
  function focusRange(start: Date, end: Date) {
    if (!containerRef.value || !zoomBehavior) return

    const selection = select(containerRef.value)
    const x0 = baseScale(start)
    const x1 = baseScale(end)
    const margin = 28
    const k = (width.value - margin * 2) / (x1 - x0)
    const nextTransform = zoomIdentity.scale(k).translate(margin / k - x0, 0)
    zoomBehavior.transform(selection, nextTransform)
    hasWandered.value = false
  }

  function viewPreset(preset: ViewPreset) {
    focusRange(...rangeForPreset(preset, new Date()))
  }

  onMounted(() => {
    applyRange()

    zoomBehavior = d3zoom<HTMLElement, unknown>()
      .scaleExtent([1, 20000])
      .translateExtent([[0, 0], [width.value, 0]])
      .on('zoom', (event) => {
        transform.value = event.transform
        currentScale.value = event.transform.rescaleX(baseScale)
        // event.sourceEvent is null for programmatic transforms (our own
        // focusRange calls) and set for real user gestures (wheel/drag/touch).
        if (event.sourceEvent) hasWandered.value = true
      })

    if (containerRef.value) {
      select(containerRef.value).call(zoomBehavior)
      viewPreset('month')
    }
  })

  watch(width, () => {
    applyRange()
    zoomBehavior?.translateExtent([[0, 0], [width.value, 0]])
  })

  onUnmounted(() => {
    if (containerRef.value && zoomBehavior) {
      select(containerRef.value).on('.zoom', null)
    }
  })

  const level = computed<ZoomLevel>(() => {
    const [start, end] = currentScale.value.domain()
    return levelForSpanMs(end.getTime() - start.getTime())
  })

  return { currentScale, level, viewPreset, hasWandered }
}
