import { createFireworks } from "./fireworks"
import { Pool } from "./particles"
import { createPointer } from "./pointer"
import { createShootingStar } from "./shootingstar"
import { createStarfield } from "./starfield"
import type { Engine, EngineEvent, EngineOptions, Quality, Size } from "./types"

const FRAME_MS = 1000 / 60
const DENSITY_MULT: Record<Quality, number> = { 0: 0.5, 1: 0.7, 2: 1 }
const SLOW_FRAME_MS = 19
const CALM_FRAME_MS = 14
const STEP_UP_AFTER_MS = 30_000

/**
 * The night-constellation scene: an ambient starfield with cursor physics on
 * one canvas, fireworks/shooting-star trails on a second. Hand-rolled Canvas
 * 2D — no dependencies. All logic runs in CSS px (contexts are DPR-scaled).
 */
export function createEngine(opts: EngineOptions): Engine {
  const starsCanvas = opts.stars
  const fxCanvas = opts.fx
  const starsCtx = starsCanvas.getContext("2d")
  const fxCtx = fxCanvas.getContext("2d")
  if (!starsCtx || !fxCtx) throw new Error("2d canvas context unavailable")

  const emit = (e: EngineEvent) => opts.onEvent?.(e)

  const size: Size = { w: 0, h: 0, dpr: 1 }

  let quality: Quality = (() => {
    const cores = navigator.hardwareConcurrency ?? 8
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const small = Math.min(window.innerWidth, window.innerHeight) < 500
    return cores <= 4 || (coarse && small) ? 1 : 2
  })()

  let rafId = 0
  let running = false
  let destroyed = false
  let elapsed = 0
  let last = 0
  let resizeTimer: number | null = null

  // quality governor state
  let frameAccum = 0
  let frameCount = 0
  let slowWindows = 0
  let calmMs = 0
  let steppedUp = false

  const pool = new Pool(2048)
  const starfield = createStarfield(
    () => size,
    () => DENSITY_MULT[quality]
  )
  const fireworks = createFireworks(
    pool,
    () => size,
    () => quality,
    () => emit({ type: "first-burst" })
  )
  const shooting = createShootingStar(pool, () => size, (count) =>
    emit({ type: "star-caught", count })
  )

  const pointer = createPointer({
    onTap: (x, y) => fireworks.requestLaunch(x, y, elapsed),
    onHoldRelease: (x, y, heldMs) => fireworks.chargedBurst(x, y, heldMs),
    onPress: (x, y) => {
      if (shooting.tryCatch(x, y, elapsed)) pointer.suppressNextTap()
    },
  })

  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const dprCap = quality === 0 ? 1.5 : 2
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap)
    size.w = w
    size.h = h
    size.dpr = dpr
    for (const [canvas, ctx] of [
      [starsCanvas, starsCtx],
      [fxCanvas, fxCtx],
    ] as const) {
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    starfield.regenerate()
  }

  const governorSample = (dtMs: number) => {
    frameAccum += dtMs
    frameCount++
    if (frameCount < 60) return
    const mean = frameAccum / frameCount
    frameAccum = 0
    frameCount = 0
    if (mean > SLOW_FRAME_MS) {
      slowWindows++
      calmMs = 0
      if (slowWindows >= 2 && quality > 0) {
        quality = (quality - 1) as Quality
        slowWindows = 0
        resize()
      }
    } else {
      slowWindows = 0
      if (mean < CALM_FRAME_MS && !steppedUp && quality < 2) {
        calmMs += mean * 60
        if (calmMs >= STEP_UP_AFTER_MS) {
          quality = (quality + 1) as Quality
          steppedUp = true
          resize()
        }
      } else {
        calmMs = 0
      }
    }
  }

  const frame = (now: number) => {
    if (!running) return
    const dtMs = Math.min(now - last, 50) // clamp: no physics explosion after a stall
    last = now
    const dt = dtMs / FRAME_MS
    elapsed += dtMs

    pointer.step()
    starfield.update(dt, elapsed, pointer.state, fireworks.isFinale(elapsed) ? 2 : 1)
    fireworks.update(dt, elapsed)
    shooting.update(dt, elapsed)
    pool.update(dt, size.h + 20)

    starsCtx.clearRect(0, 0, size.w, size.h)
    starfield.render(starsCtx)

    // fully cleared every frame — motion comes from per-particle velocity
    // streaks, so nothing ever accumulates or ghosts on the canvas
    fxCtx.clearRect(0, 0, size.w, size.h)
    fxCtx.globalCompositeOperation = "lighter"
    pool.render(fxCtx)
    fireworks.render(fxCtx, pointer.state)
    shooting.render(fxCtx)
    fxCtx.globalCompositeOperation = "source-over"

    governorSample(dtMs)
    rafId = requestAnimationFrame(frame)
  }

  const start = () => {
    if (destroyed || running) return
    running = true
    last = performance.now()
    rafId = requestAnimationFrame(frame)
  }

  const stop = () => {
    if (!running) return
    running = false
    cancelAnimationFrame(rafId)
  }

  const onWindowResize = () => {
    if (resizeTimer !== null) window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      resizeTimer = null
      if (!destroyed) resize()
    }, 150)
  }

  const onVisibility = () => {
    if (document.hidden) stop()
    else start()
  }

  window.addEventListener("resize", onWindowResize)
  document.addEventListener("visibilitychange", onVisibility)
  resize()

  return {
    start,
    stop,

    destroy() {
      if (destroyed) return
      destroyed = true
      stop()
      pointer.destroy()
      window.removeEventListener("resize", onWindowResize)
      document.removeEventListener("visibilitychange", onVisibility)
      if (resizeTimer !== null) window.clearTimeout(resizeTimer)
    },

    finale() {
      fireworks.finale(elapsed)
    },

    sprinkle(x, y) {
      fireworks.sprinkle(x, y)
    },
  }
}
