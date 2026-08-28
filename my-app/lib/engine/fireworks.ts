import {
  ACCENT_HSL,
  getGlowSprite,
  pickScheme,
  SCHEME_CLASSIC,
  SCHEME_EMERALD,
  schemeSparkColor,
} from "./palette"
import type { Pool } from "./particles"
import type { PointerState } from "./pointer"
import type { Quality, Size } from "./types"

const TAU = Math.PI * 2
const ROCKET_GRAVITY = 0.16
const SPARK_GRAVITY = 0.045
const LAUNCH_MIN_GAP_MS = 120
const MAX_ROCKETS = 3
const MAX_QUEUE = 2
const HOLD_MIN_MS = 400
const HOLD_FULL_MS = 2000
const BURST_COUNTS: Record<Quality, number> = { 0: 44, 1: 64, 2: 90 }

type Rocket = {
  x: number
  y: number
  vx: number
  vy: number
  burstAtY: number
  scheme: number
  crown: boolean
}

type FinaleShot = {
  at: number
  xFrac: number
  yFrac: number
  crown: boolean
  scheme: number
}

export type Fireworks = {
  requestLaunch(x: number, y: number, elapsed: number): void
  chargedBurst(x: number, y: number, heldMs: number): void
  sprinkle(x: number, y: number): void
  finale(elapsed: number): void
  isFinale(elapsed: number): boolean
  update(dt: number, elapsed: number): void
  render(ctx: CanvasRenderingContext2D, ptr: PointerState): void
}

export function createFireworks(
  pool: Pool,
  getSize: () => Size,
  getQuality: () => Quality,
  onFirstBurst: () => void
): Fireworks {
  const rockets: Rocket[] = []
  const queue: { x: number; y: number }[] = []
  let finaleSchedule: FinaleShot[] = []
  let finaleUntil = -Infinity
  let lastLaunchAt = -Infinity
  let burstedOnce = false

  /** burst radius scale for the viewport */
  const scaleS = () => {
    const { w, h } = getSize()
    return Math.min(Math.max(Math.min(w, h) / 900, 0.7), 1.3)
  }

  const spawnRocket = (targetX: number, targetY: number, scheme: number, crown: boolean) => {
    const { h } = getSize()
    const burstAtY = Math.min(Math.max(targetY, h * 0.12), h * 0.85)
    const startY = h + 10
    rockets.push({
      x: targetX + (Math.random() * 12 - 6),
      y: startY,
      vx: Math.random() * 0.7 - 0.35,
      vy: -Math.sqrt(2 * ROCKET_GRAVITY * (startY - burstAtY)) * (1 + Math.random() * 0.04),
      burstAtY,
      scheme,
      crown,
    })
  }

  const burst = (x: number, y: number, scheme: number, count: number, maxSpeed: number) => {
    for (let i = 0; i < count; i++) {
      const p = pool.spawn()
      if (!p) break
      const angle = Math.random() * TAU
      const shell = Math.random() < 0.7
      const speed = maxSpeed * (shell ? 0.75 + Math.random() * 0.25 : 0.1 + Math.random() * 0.65)
      p.x = x
      p.y = y
      p.vx = Math.cos(angle) * speed
      p.vy = Math.sin(angle) * speed
      p.gravity = SPARK_GRAVITY
      p.drag = 0.985
      p.ttl = 55 + Math.random() * 40
      p.life = p.ttl
      p.size = 1.4 + Math.random() * 1.4
      p.color = schemeSparkColor(scheme)
      p.flicker = Math.random() < 0.2
    }
    if (!burstedOnce) {
      burstedOnce = true
      onFirstBurst()
    }
  }

  const shedTail = (r: Rocket) => {
    const p = pool.spawn()
    if (!p) return
    p.x = r.x + (Math.random() * 2 - 1)
    p.y = r.y + Math.random() * 3
    p.vx = (Math.random() - 0.5) * 0.3
    p.vy = 0.2 + Math.random() * 0.3
    p.gravity = 0.01
    p.drag = 0.98
    p.ttl = 12 + Math.random() * 8
    p.life = p.ttl
    p.size = 0.8
    p.color = "hsl(45, 90%, 78%)"
    p.flicker = false
  }

  return {
    requestLaunch(x, y, elapsed) {
      if (elapsed - lastLaunchAt < LAUNCH_MIN_GAP_MS || rockets.length >= MAX_ROCKETS) {
        if (queue.length < MAX_QUEUE) queue.push({ x, y })
        return
      }
      lastLaunchAt = elapsed
      spawnRocket(x, y, pickScheme(), false)
    },

    chargedBurst(x, y, heldMs) {
      const t = Math.min(Math.max((heldMs - HOLD_MIN_MS) / (HOLD_FULL_MS - HOLD_MIN_MS), 0), 1)
      const tierScale = BURST_COUNTS[getQuality()] / BURST_COUNTS[2]
      const s = scaleS()
      burst(
        x,
        y,
        pickScheme(),
        Math.round((90 + 130 * t) * tierScale),
        (6.5 + 2.5 * t) * s
      )
    },

    sprinkle(x, y) {
      for (let i = 0; i < 6; i++) {
        const p = pool.spawn()
        if (!p) break
        const angle = -Math.PI / 2 + (Math.random() * 2 - 1) * 0.9
        const speed = 0.8 + Math.random() * 1.2
        p.x = x + (Math.random() * 16 - 8)
        p.y = y
        p.vx = Math.cos(angle) * speed
        p.vy = Math.sin(angle) * speed
        p.gravity = 0.02
        p.drag = 0.97
        p.ttl = 30 + Math.random() * 20
        p.life = p.ttl
        p.size = 1 + Math.random() * 0.8
        p.color = `hsl(${ACCENT_HSL.h}, ${ACCENT_HSL.s}%, ${ACCENT_HSL.l}%)`
        p.flicker = false
      }
    },

    finale(elapsed) {
      if (finaleSchedule.length || elapsed < finaleUntil) return
      const fracs: number[] = []
      for (let i = 0; i < 14; i++) {
        fracs.push(0.15 + (0.7 * i) / 13 + (Math.random() * 0.06 - 0.03))
      }
      for (let i = fracs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[fracs[i], fracs[j]] = [fracs[j], fracs[i]]
      }
      const shots: FinaleShot[] = []
      let at = elapsed + 200
      for (let i = 0; i < 14; i++) {
        const crown = i >= 12
        at += 140 + Math.random() * 240
        shots.push({
          at,
          xFrac: Math.min(Math.max(fracs[i], 0.1), 0.9),
          yFrac: 0.18 + Math.random() * (crown ? 0.12 : 0.27),
          crown,
          scheme: crown ? (i === 12 ? SCHEME_CLASSIC : SCHEME_EMERALD) : pickScheme(),
        })
      }
      finaleSchedule = shots
      finaleUntil = at + 8000
    },

    isFinale(elapsed) {
      return elapsed < finaleUntil
    },

    update(dt, elapsed) {
      const { w, h } = getSize()

      // finale rockets bypass the rate limits (but still respect the pool)
      while (finaleSchedule.length && elapsed >= finaleSchedule[0].at) {
        const shot = finaleSchedule.shift() as FinaleShot
        spawnRocket(shot.xFrac * w, shot.yFrac * h, shot.scheme, shot.crown)
      }

      if (
        queue.length &&
        elapsed - lastLaunchAt >= LAUNCH_MIN_GAP_MS &&
        rockets.length < MAX_ROCKETS
      ) {
        const q = queue.shift() as { x: number; y: number }
        lastLaunchAt = elapsed
        spawnRocket(q.x, q.y, pickScheme(), false)
      }

      const quality = getQuality()
      const s = scaleS()
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        if (quality >= 1) {
          shedTail(r)
          shedTail(r)
        }
        r.vy += ROCKET_GRAVITY * dt
        r.x += r.vx * dt
        r.y += r.vy * dt
        // apex: stalled, or reached the requested altitude
        if (r.vy >= -0.5 || r.y <= r.burstAtY) {
          rockets.splice(i, 1)
          if (r.crown) burst(r.x, r.y, r.scheme, 170, 8.2 * s)
          else burst(r.x, r.y, r.scheme, BURST_COUNTS[quality], 6.5 * s)
        }
      }
    },

    render(ctx, ptr) {
      const glow = getGlowSprite()

      for (let i = 0; i < rockets.length; i++) {
        const r = rockets[i]
        ctx.globalAlpha = 0.35
        ctx.drawImage(glow, r.x - 12, r.y - 12, 24, 24)
        ctx.globalAlpha = 1
        ctx.fillStyle = "rgb(255, 250, 235)"
        ctx.fillRect(r.x - 1, r.y - 1, 2, 2)
      }

      // charging ring while a hold is building up
      if (ptr.charging) {
        const radius = 8 + 26 * ptr.chargeT
        ctx.globalAlpha = 1
        ctx.strokeStyle = `hsla(${ACCENT_HSL.h}, ${ACCENT_HSL.s}%, ${ACCENT_HSL.l}%, ${0.25 + 0.2 * ptr.chargeT})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(ptr.x, ptr.y, radius, 0, TAU)
        ctx.stroke()
      }
    },
  }
}
