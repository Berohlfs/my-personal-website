export type EngineEvent =
  | { type: "first-burst" }
  | { type: "star-caught"; count: number }

export type EngineOptions = {
  stars: HTMLCanvasElement
  fx: HTMLCanvasElement
  onEvent?: (e: EngineEvent) => void
}

export type Engine = {
  start(): void
  stop(): void
  destroy(): void
  finale(): void
  sprinkle(x: number, y: number): void
}

/** 0 = LOW, 1 = MED, 2 = HIGH */
export type Quality = 0 | 1 | 2

export type Size = {
  w: number
  h: number
  dpr: number
}
