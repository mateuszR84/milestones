export interface LaneItem {
  x: number
}

/**
 * Greedy "first free lane from the top" placement across a fixed number of
 * lanes. Events are sorted by x; each one takes the first lane (starting
 * from lane 0) whose last-placed card doesn't overlap it horizontally. If
 * every lane already collides, it falls back to the last lane (accepting
 * overlap) rather than growing indefinitely.
 */
export function assignCardLanes<T extends LaneItem>(
  items: T[],
  options: { laneCount: number; cardWidth: number; gap?: number },
): (T & { lane: number })[] {
  const { laneCount, cardWidth, gap = 16 } = options
  const sorted = [...items].sort((a, b) => a.x - b.x)
  const laneRightEdge: number[] = new Array(laneCount).fill(-Infinity)

  return sorted.map((item) => {
    let chosen = laneCount - 1
    for (let lane = 0; lane < laneCount; lane++) {
      if (item.x > laneRightEdge[lane] + gap) {
        chosen = lane
        break
      }
    }
    laneRightEdge[chosen] = item.x + cardWidth
    return { ...item, lane: chosen }
  })
}
