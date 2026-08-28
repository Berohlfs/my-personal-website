const TAP_MAX_MS = 400
const HOLD_MIN_MS = 400
const HOLD_FULL_MS = 2000
const MOVE_CANCEL_PX = 10
const COARSE_RELAX_MS = 300

export type PointerState = {
  x: number
  y: number
  /** the starfield should feel this pointer */
  active: boolean
  /** EMA of movement per frame, in px */
  speed: number
  /** held in place past the hold threshold */
  charging: boolean
  /** 0..1 charge of the pending burst */
  chargeT: number
}

export type GestureHandlers = {
  onTap(x: number, y: number): void
  onHoldRelease(x: number, y: number, heldMs: number): void
  /** fires on pointerdown — used for shooting-star catches */
  onPress(x: number, y: number): void
}

export type Pointer = {
  state: PointerState
  step(): void
  /** swallow the tap/hold that would fire on the next pointerup */
  suppressNextTap(): void
  destroy(): void
}

/**
 * Window-level pointer tracking + gesture classification (tap / hold / drag).
 * Events originating on links or [data-no-fx] elements never become gestures,
 * so clicking a link can't double as a firework.
 */
export function createPointer(handlers: GestureHandlers): Pointer {
  const state: PointerState = {
    x: -9999,
    y: -9999,
    active: false,
    speed: 0,
    charging: false,
    chargeT: 0,
  }

  const coarse =
    typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches

  let down = false
  let ignoring = false
  let moved = false
  let suppressed = false
  let downX = 0
  let downY = 0
  let downAt = 0
  let frameDist = 0
  let relaxTimer: number | null = null

  const clearRelax = () => {
    if (relaxTimer !== null) {
      window.clearTimeout(relaxTimer)
      relaxTimer = null
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!e.isPrimary) return
    frameDist += Math.hypot(e.clientX - state.x, e.clientY - state.y)
    state.x = e.clientX
    state.y = e.clientY
    state.active = true
    clearRelax()
    if (down && !moved && Math.hypot(e.clientX - downX, e.clientY - downY) > MOVE_CANCEL_PX) {
      moved = true
    }
  }

  const onPointerDown = (e: PointerEvent) => {
    if (!e.isPrimary) return
    state.x = e.clientX
    state.y = e.clientY
    state.active = true
    clearRelax()
    const target = e.target as Element | null
    ignoring = !!target?.closest?.("a, button, [data-no-fx]")
    if (ignoring) return
    down = true
    moved = false
    downX = e.clientX
    downY = e.clientY
    downAt = performance.now()
    handlers.onPress(e.clientX, e.clientY)
  }

  const endPress = (e: PointerEvent, cancelled: boolean) => {
    if (!e.isPrimary) return
    if (coarse) {
      clearRelax()
      relaxTimer = window.setTimeout(() => {
        state.active = false
        state.speed = 0
      }, COARSE_RELAX_MS)
    }
    if (ignoring || !down) {
      ignoring = false
      return
    }
    down = false
    const wasSuppressed = suppressed
    suppressed = false
    if (cancelled || moved || wasSuppressed) return
    const heldMs = performance.now() - downAt
    if (heldMs < TAP_MAX_MS) {
      handlers.onTap(e.clientX, e.clientY)
    } else if (heldMs >= HOLD_MIN_MS) {
      handlers.onHoldRelease(e.clientX, e.clientY, heldMs)
    }
  }

  const onPointerUp = (e: PointerEvent) => endPress(e, false)
  const onPointerCancel = (e: PointerEvent) => endPress(e, true)

  window.addEventListener("pointermove", onPointerMove, { passive: true })
  window.addEventListener("pointerdown", onPointerDown, { passive: true })
  window.addEventListener("pointerup", onPointerUp, { passive: true })
  window.addEventListener("pointercancel", onPointerCancel, { passive: true })

  return {
    state,

    step() {
      state.speed = state.speed * 0.7 + frameDist * 0.3
      frameDist = 0
      if (down && !moved) {
        const heldMs = performance.now() - downAt
        state.charging = heldMs >= HOLD_MIN_MS
        state.chargeT = Math.min(Math.max((heldMs - HOLD_MIN_MS) / (HOLD_FULL_MS - HOLD_MIN_MS), 0), 1)
      } else {
        state.charging = false
        state.chargeT = 0
      }
    },

    suppressNextTap() {
      if (down) suppressed = true
    },

    destroy() {
      clearRelax()
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerCancel)
    },
  }
}
