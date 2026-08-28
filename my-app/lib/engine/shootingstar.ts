import { getGlowSprite } from "./palette"
import type { Pool } from "./particles"
import type { Size } from "./types"

const TAU = Math.PI * 2
const CATCH_RADIUS = 36
const MIN_DELAY_MS = 20_000
const MAX_DELAY_MS = 45_000

export type ShootingStar = {
  update(dt: number, elapsed: number): void
  render(ctx: CanvasRenderingContext2D): void
  /** returns true when (x, y) catches a live star */
  tryCatch(x: number, y: number, elapsed: number): boolean
}

export function createShootingStar(
  pool: Pool,
  getSize: () => Size,
  onCaught: (count: number) => void
): ShootingStar {
  let alive = false
  let x = 0
  let y = 0
  let vx = 0
  let vy = 0
  let glitterTick = 0
  let nextAt = Infinity
  let caught = 0

  const schedule = (elapsed: number) => {
    nextAt = elapsed + MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
  }

  const spawn = () => {
    const { w, h } = getSize()
    const fromLeft = Math.random() < 0.5
    const angle = ((15 + Math.random() * 20) * Math.PI) / 180
    const speed = 9 + Math.random() * 5
    x = fromLeft ? -20 : w + 20
    y = (0.05 + Math.random() * 0.35) * h
    vx = Math.cos(angle) * speed * (fromLeft ? 1 : -1)
    vy = Math.sin(angle) * speed
    glitterTick = 0
    alive = true
  }

  const shed = () => {
    const p = pool.spawn()
    if (!p) return
    p.x = x + (Math.random() * 4 - 2)
    p.y = y + (Math.random() * 4 - 2)
    p.vx = -vx * 0.04 + (Math.random() - 0.5) * 0.2
    p.vy = -vy * 0.04 + (Math.random() - 0.5) * 0.2
    p.gravity = 0.005
    p.drag = 0.99
    p.ttl = 14 + Math.random() * 10
    p.life = p.ttl
    p.size = 0.7
    p.color = "rgb(220, 235, 255)"
    p.flicker = false
  }

  return {
    update(dt, elapsed) {
      if (!alive) {
        if (nextAt === Infinity) schedule(elapsed)
        else if (elapsed >= nextAt) spawn()
        return
      }
      const { w, h } = getSize()
      x += vx * dt
      y += vy * dt
      glitterTick += dt
      while (glitterTick >= 2) {
        glitterTick -= 2
        shed()
      }
      if (x < -40 || x > w + 40 || y > h + 40) {
        alive = false
        schedule(elapsed)
      }
    },

    render(ctx) {
      if (!alive) return
      const glow = getGlowSprite()
      ctx.globalAlpha = 0.4
      ctx.drawImage(glow, x - 14, y - 14, 28, 28)
      ctx.globalAlpha = 1
      ctx.fillStyle = "rgb(255, 255, 255)"
      ctx.beginPath()
      ctx.arc(x, y, 1.6, 0, TAU)
      ctx.fill()
    },

    tryCatch(px, py, elapsed) {
      if (!alive || Math.hypot(px - x, py - y) > CATCH_RADIUS) return false
      alive = false
      caught++
      // micro-firework where the star was caught
      for (let i = 0; i < 24; i++) {
        const p = pool.spawn()
        if (!p) break
        const angle = Math.random() * TAU
        const speed = 3 * (0.3 + Math.random() * 0.7)
        p.x = x
        p.y = y
        p.vx = Math.cos(angle) * speed
        p.vy = Math.sin(angle) * speed
        p.gravity = 0.03
        p.drag = 0.98
        p.ttl = 30 + Math.random() * 20
        p.life = p.ttl
        p.size = 1 + Math.random() * 0.8
        p.color = Math.random() < 0.8 ? "hsl(45, 100%, 94%)" : "hsl(158, 72%, 62%)"
        p.flicker = Math.random() < 0.3
      }
      schedule(elapsed)
      onCaught(caught)
      return true
    },
  }
}
