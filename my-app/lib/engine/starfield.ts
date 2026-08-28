import { pickStarColor } from "./palette"
import type { PointerState } from "./pointer"
import type { Size } from "./types"

const TAU = Math.PI * 2
const FORCE_RADIUS = 160
const REPEL = 0.18
const SWIRL = 0.35
const SPRING = 0.02
const DAMPING = 0.9
const WIND = 0.02
const GLINT_FRAMES = 26

type Star = {
  /** home position */
  hx: number
  hy: number
  /** displacement from home (pointer forces act here) */
  ox: number
  oy: number
  vx: number
  vy: number
  /** depth 0..1, biased far; near stars are bigger, brighter, more reactive */
  z: number
  size: number
  baseAlpha: number
  twinklePhase: number
  twinkleSpeed: number
  color: string
  /** frames remaining of a bright glint */
  glint: number
}

export type Starfield = {
  regenerate(): void
  update(dt: number, elapsed: number, ptr: PointerState, twinkleBoost: number): void
  render(ctx: CanvasRenderingContext2D): void
}

export function createStarfield(getSize: () => Size, getDensityMult: () => number): Starfield {
  let stars: Star[] = []
  let lastElapsed = 0
  let boost = 1

  const regenerate = () => {
    const { w, h } = getSize()
    const count = Math.round(
      Math.min(Math.max((w * h) / 3800, 120), 420) * getDensityMult()
    )
    stars = []
    for (let i = 0; i < count; i++) {
      const z = Math.random() ** 1.5
      stars.push({
        hx: Math.random() * w,
        hy: Math.random() * h,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
        z,
        size: 0.4 + z * 1.2,
        baseAlpha: 0.25 + z * 0.65,
        twinklePhase: Math.random() * TAU,
        twinkleSpeed: 0.5 + Math.random() * 1.3,
        color: pickStarColor(),
        glint: 0,
      })
    }
  }

  return {
    regenerate,

    update(dt, elapsed, ptr, twinkleBoost) {
      lastElapsed = elapsed
      boost = twinkleBoost
      const { w } = getSize()
      const damp = Math.pow(DAMPING, dt)
      const speedBoost = 1 + Math.min(ptr.speed / 20, 1.5)
      const r2 = FORCE_RADIUS * FORCE_RADIUS

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]

        // ambient wind, faster for near stars (parallax), wrapping at the edges
        s.hx += WIND * s.z * dt
        if (s.hx > w + 4) s.hx -= w + 8

        // pointer force: repulsion + tangential swirl, smooth falloff to the radius
        if (ptr.active) {
          const dx = s.hx + s.ox - ptr.x
          const dy = s.hy + s.oy - ptr.y
          const d2 = dx * dx + dy * dy
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = (1 - d / FORCE_RADIUS) ** 2 * s.z * speedBoost * dt
            const rx = dx / d
            const ry = dy / d
            s.vx += (rx * REPEL - ry * SWIRL) * f
            s.vy += (ry * REPEL + rx * SWIRL) * f
          }
        }

        // spring home + damping
        s.vx += -s.ox * SPRING * dt
        s.vy += -s.oy * SPRING * dt
        s.vx *= damp
        s.vy *= damp
        s.ox += s.vx * dt
        s.oy += s.vy * dt

        if (s.glint > 0) s.glint -= dt
        else if (s.z > 0.75 && Math.random() < 0.0004 * dt) s.glint = GLINT_FRAMES
      }
    },

    render(ctx) {
      const t = lastElapsed / 1000
      const amp = 0.25 * boost
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        let alpha = s.baseAlpha * (1 - amp + amp * Math.sin(t * s.twinkleSpeed + s.twinklePhase))
        let size = s.size
        if (s.glint > 0) {
          alpha = 1
          size = s.size * (1 + (0.8 * s.glint) / GLINT_FRAMES)
        }
        if (alpha <= 0) continue
        ctx.globalAlpha = alpha > 1 ? 1 : alpha
        ctx.fillStyle = s.color
        const x = s.hx + s.ox
        const y = s.hy + s.oy + Math.sin(t * 0.3 + s.twinklePhase * 3) * 1.2
        if (size < 0.9) {
          ctx.fillRect(x, y, size, size)
        } else {
          ctx.beginPath()
          ctx.arc(x, y, size, 0, TAU)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    },
  }
}
