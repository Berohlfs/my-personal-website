// Colors are plain strings/HSL numbers: canvas fillStyle can't read CSS custom
// properties, so the night palette from globals.css is mirrored here.

export const STAR_COLORS = [
  "rgb(234, 242, 255)", // white
  "rgb(207, 224, 255)", // blue-white
  "rgb(255, 239, 214)", // warm
  "rgb(191, 245, 223)", // green-tinted (brand)
]

const STAR_COLOR_WEIGHTS = [0.55, 0.25, 0.12, 0.08]

export function pickStarColor(): string {
  let r = Math.random()
  for (let i = 0; i < STAR_COLORS.length; i++) {
    r -= STAR_COLOR_WEIGHTS[i]
    if (r <= 0) return STAR_COLORS[i]
  }
  return STAR_COLORS[0]
}

/** ≈ oklch(0.78 0.15 160), the DOM accent color */
export const ACCENT_HSL = { h: 160, s: 70, l: 66 }

export type Scheme = {
  /** base hue, or a set of hues the burst picks from */
  hue: number | number[]
  spread: number
  sat: number
  light: number
  /** fraction of sparks forced white-hot */
  whiteMix: number
  weight: number
}

export const SCHEMES: Scheme[] = [
  { hue: 158, spread: 10, sat: 72, light: 62, whiteMix: 0.15, weight: 0.35 }, // emerald (brand)
  { hue: [150, 190], spread: 8, sat: 65, light: 66, whiteMix: 0.1, weight: 0.15 }, // aurora
  { hue: 46, spread: 8, sat: 90, light: 62, whiteMix: 0.25, weight: 0.15 }, // gold
  { hue: 212, spread: 10, sat: 85, light: 72, whiteMix: 0.15, weight: 0.15 }, // ice
  { hue: 280, spread: 12, sat: 70, light: 70, whiteMix: 0.12, weight: 0.1 }, // violet
  { hue: 46, spread: 6, sat: 80, light: 70, whiteMix: 0.8, weight: 0.1 }, // classic white-gold
]

export const SCHEME_EMERALD = 0
export const SCHEME_CLASSIC = SCHEMES.length - 1

export function pickScheme(): number {
  let r = Math.random()
  for (let i = 0; i < SCHEMES.length; i++) {
    r -= SCHEMES[i].weight
    if (r <= 0) return i
  }
  return 0
}

export function schemeSparkColor(schemeIndex: number): string {
  const s = SCHEMES[schemeIndex]
  if (Math.random() < s.whiteMix) {
    return "hsl(45, 100%, 94%)" // white-hot, faintly warm
  }
  const base = Array.isArray(s.hue) ? s.hue[Math.floor(Math.random() * s.hue.length)] : s.hue
  const hue = base + (Math.random() * 2 - 1) * s.spread
  return `hsl(${hue.toFixed(0)}, ${s.sat}%, ${s.light}%)`
}

let glowSprite: HTMLCanvasElement | null = null

/** Pre-rendered radial glow, drawn under rocket/shooting-star heads instead of shadowBlur. */
export function getGlowSprite(): HTMLCanvasElement {
  if (!glowSprite) {
    glowSprite = document.createElement("canvas")
    glowSprite.width = 64
    glowSprite.height = 64
    const ctx = glowSprite.getContext("2d")
    if (ctx) {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, "rgba(255, 255, 255, 0.8)")
      g.addColorStop(0.35, "rgba(255, 255, 255, 0.25)")
      g.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
    }
  }
  return glowSprite
}
