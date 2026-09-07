import { scaleTime, type ScaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom'
import { computed, onMounted, onUnmounted, ref, shallowRef, watch, type Ref } from 'vue'

export type ZoomLevel = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'multi-year'

function levelForSpanMs(spanMs: number): ZoomLevel {
  const day = 86_400_000
  if (spanMs <= day * 3) return 'day'
  if (spanMs <= day * 21) return 'week'
  if (spanMs <= day * 120) return 'month'
  if (spanMs <= day * 500) return 'quarter'
  if (spanMs <= day * 365 * 6) return 'year'
  return 'multi-year'
}

export function useTimelineScale(containerRef: Ref<HTMLElement | null>, width: Ref<number>) {
  const now = new Date()
  const domainStart = new Date(now.getFullYear() - 60, 0, 1)
  const domainEnd = new Date(now.getFullYear() + 1, 0, 1)

  const baseScale = scaleTime().domain([domainStart, domainEnd])
  const currentScale = shallowRef<ScaleTime<number, number>>(baseScale.copy())
  const transform = ref<ZoomTransform>(zoomIdentity)

  let zoomBehavior: ZoomBehavior<HTMLElement, unknown> | null = null

  function applyRange() {
    baseScale.range([0, width.value])
    currentScale.value = transform.value.rescaleX(baseScale)
  }

  onMounted(() => {
    applyRange()

    zoomBehavior = d3zoom<HTMLElement, unknown>()
      .scaleExtent([1, 20000])
      .translateExtent([[0, 0], [width.value, 0]])
      .on('zoom', (event) => {
        transform.value = event.transform
        currentScale.value = event.transform.rescaleX(baseScale)
      })

    if (containerRef.value) {
      select(containerRef.value).call(zoomBehavior)
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

  function zoomBy(factor: number) {
    if (!containerRef.value || !zoomBehavior) return
    zoomBehavior.scaleBy(select(containerRef.value), factor)
  }

  const zoomIn = () => zoomBy(1.6)
  const zoomOut = () => zoomBy(1 / 1.6)

  const level = computed<ZoomLevel>(() => {
    const [start, end] = currentScale.value.domain()
    return levelForSpanMs(end.getTime() - start.getTime())
  })

  return { currentScale, level, zoomIn, zoomOut }
}
