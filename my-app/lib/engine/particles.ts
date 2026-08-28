const TAU = Math.PI * 2

export type Particle = {
  active: boolean
  index: number
  x: number
  y: number
  vx: number
  vy: number
  /** added to vy each 60fps-normalized frame */
  gravity: number
  /** velocity multiplier per 60fps-normalized frame */
  drag: number
  /** frames remaining / initial frames; alpha = life / ttl */
  life: number
  ttl: number
  /** radius in CSS px */
  size: number
  color: string
  /** strobe during the last half of life */
  flicker: boolean
}

/**
 * Fixed-capacity particle pool: preallocated, free-list backed, zero allocation
 * during play. When exhausted, spawn() returns null and spawners emit fewer.
 */
export class Pool {
  private items: Particle[] = []
  private freeList: number[] = []
  private activeIdx: number[] = []

  constructor(capacity = 2048) {
    for (let i = 0; i < capacity; i++) {
      this.items.push({
        active: false,
        index: i,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        gravity: 0,
        drag: 1,
        life: 0,
        ttl: 1,
        size: 1,
        color: "#fff",
        flicker: false,
      })
      this.freeList.push(i)
    }
  }

  spawn(): Particle | null {
    const idx = this.freeList.pop()
    if (idx === undefined) return null
    const p = this.items[idx]
    p.active = true
    this.activeIdx.push(idx)
    return p
  }

  /** Uniform physics for every pooled particle; kills expired or fallen-out sparks. */
  update(dt: number, killBelowY: number) {
    for (let i = this.activeIdx.length - 1; i >= 0; i--) {
      const idx = this.activeIdx[i]
      const p = this.items[idx]
      const drag = Math.pow(p.drag, dt)
      p.vx *= drag
      p.vy = p.vy * drag + p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.life -= dt
      if (p.life <= 0 || p.y > killBelowY) {
        p.active = false
        this.activeIdx[i] = this.activeIdx[this.activeIdx.length - 1]
        this.activeIdx.pop()
        this.freeList.push(idx)
      }
    }
  }

  /** Caller sets composite mode (sparks look best on 'lighter'). */
  render(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.activeIdx.length; i++) {
      const p = this.items[this.activeIdx[i]]
      const t = p.life / p.ttl
      if (p.flicker && t < 0.5 && Math.random() < 0.4) continue
      // ease the fade: stay bright through mid-life, then drop away
      ctx.globalAlpha = Math.pow(t, 0.7)
      ctx.fillStyle = p.color
      if (p.size < 1) {
        ctx.fillRect(p.x, p.y, p.size, p.size)
      } else {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, TAU)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }

  get activeCount() {
    return this.activeIdx.length
  }
}
