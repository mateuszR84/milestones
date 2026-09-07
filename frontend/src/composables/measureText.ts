let canvas: HTMLCanvasElement | null = null

/** Measures rendered text width in pixels using an offscreen canvas (matches CSS font shorthand). */
export function measureTextWidth(text: string, font = '500 13px system-ui, sans-serif'): number {
  if (!canvas) canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return text.length * 7
  ctx.font = font
  return ctx.measureText(text).width
}
