export interface LabelInput {
  id: number
  x: number
  width: number
  label: string
}

export interface StackedLabel {
  id: number
  x: number
  width: number
  label: string
  lane: number
  /** Number of additional events collapsed into this label because lanes ran out nearby. */
  extraCount: number
}

export interface StackingOptions {
  /** Minimum horizontal gap (px) required between two labels sharing a lane. */
  gap?: number
  /** Maximum number of vertical lanes before extra events collapse into the nearest label. */
  maxLanes?: number
}

/**
 * Greedy "insert into first free lane" label placement.
 *
 * Events are sorted by x. Each lane remembers the right edge of the last label
 * placed in it; a new label goes into the first lane whose last label doesn't
 * overlap it. If every lane up to maxLanes collides, the event is folded into
 * the nearest already-placed label as an "+N" overflow instead of adding a new lane.
 */
export function stackLabels(items: LabelInput[], options: StackingOptions = {}): StackedLabel[] {
  const gap = options.gap ?? 12
  const maxLanes = options.maxLanes ?? 4

  const sorted = [...items].sort((a, b) => a.x - b.x)

  // Right edge of the last label placed in each lane, and a reference to that label.
  const laneRightEdge: number[] = []
  const laneLastLabel: (StackedLabel | undefined)[] = []
  const placed: StackedLabel[] = []

  for (const item of sorted) {
    const left = item.x
    const right = item.x + item.width

    let laneIndex = -1
    for (let lane = 0; lane < maxLanes; lane++) {
      const edge = laneRightEdge[lane]
      if (edge === undefined || left > edge + gap) {
        laneIndex = lane
        break
      }
    }

    if (laneIndex === -1) {
      // No free lane: fold into whichever lane's last label sits closest to this event.
      let closestLane = 0
      let closestDistance = Infinity
      for (let lane = 0; lane < maxLanes; lane++) {
        const label = laneLastLabel[lane]
        if (!label) continue
        const distance = Math.abs(label.x - item.x)
        if (distance < closestDistance) {
          closestDistance = distance
          closestLane = lane
        }
      }
      const target = laneLastLabel[closestLane]
      if (target) target.extraCount += 1
      continue
    }

    const stacked: StackedLabel = { ...item, lane: laneIndex, extraCount: 0 }
    placed.push(stacked)
    laneRightEdge[laneIndex] = right
    laneLastLabel[laneIndex] = stacked
  }

  return placed
}
