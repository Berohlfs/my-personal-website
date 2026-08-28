'use client'

import { useEffect, useRef, useState } from "react"
import { createEngine } from "@/lib/engine/engine"
import type { Engine } from "@/lib/engine/types"

const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
]

// module-level so React StrictMode's double-mount greets only once
let greeted = false

export function Scene() {
  const starsRef = useRef<HTMLCanvasElement | null>(null)
  const fxRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<Engine | null>(null)
  const toastTimer = useRef<number | null>(null)
  const [live, setLive] = useState(false)
  const [played, setPlayed] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const stars = starsRef.current
    const fx = fxRef.current
    if (!stars || !fx) return

    const showToast = (message: string) => {
      setToast(message)
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
      toastTimer.current = window.setTimeout(() => setToast(null), 4000)
    }

    const boot = () => {
      if (engineRef.current) return
      try {
        engineRef.current = createEngine({
          stars,
          fx,
          onEvent: (e) => {
            if (e.type === "first-burst") setPlayed(true)
            if (e.type === "star-caught") {
              showToast(
                e.count >= 3
                  ? "three wishes. use them well."
                  : "you caught one. make a wish."
              )
            }
          },
        })
        engineRef.current.start()
        setLive(true)
      } catch {
        // no canvas support — the static sky stands on its own
      }
    }

    const teardown = () => {
      engineRef.current?.destroy()
      engineRef.current = null
      setLive(false)
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!reduced.matches) boot()
    const onReducedChange = () => {
      if (reduced.matches) teardown()
      else boot()
    }
    reduced.addEventListener("change", onReducedChange)

    if (!greeted) {
      greeted = true
      console.log(
        "%c☾ bernardo rohlfs",
        "font: 600 20px Georgia, serif; color: #3fd9a1; text-shadow: 0 0 12px rgba(63, 217, 161, 0.5)"
      )
      console.log(
        "%cnice of you to look under the hood.\ntry: ↑ ↑ ↓ ↓ ← → ← → b a",
        "font: 12px monospace; color: #8b93a7"
      )
      console.log("%chttps://github.com/Berohlfs", "font: 12px monospace; color: #8b93a7")
    }

    let konamiBuffer: string[] = []
    const onKeyDown = (e: KeyboardEvent) => {
      konamiBuffer.push(e.key.toLowerCase())
      if (konamiBuffer.length > KONAMI.length) konamiBuffer.shift()
      if (KONAMI.every((key, i) => konamiBuffer[i] === key)) {
        konamiBuffer = []
        engineRef.current?.finale()
      }
    }
    window.addEventListener("keydown", onKeyDown)

    const sparkCleanups: (() => void)[] = []
    document.querySelectorAll<HTMLElement>("[data-spark]").forEach((el) => {
      let lastAt = 0
      const onEnter = () => {
        const now = performance.now()
        if (now - lastAt < 300) return
        lastAt = now
        const rect = el.getBoundingClientRect()
        engineRef.current?.sprinkle(rect.left + rect.width / 2, rect.top)
      }
      el.addEventListener("pointerenter", onEnter)
      sparkCleanups.push(() => el.removeEventListener("pointerenter", onEnter))
    })

    return () => {
      reduced.removeEventListener("change", onReducedChange)
      window.removeEventListener("keydown", onKeyDown)
      sparkCleanups.forEach((fn) => fn())
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
      teardown()
    }
  }, [])

  return (
    <>
      <canvas ref={starsRef} className={`layer stars${live ? " on" : ""}`} aria-hidden />
      <canvas ref={fxRef} className={`layer fx${live ? " on" : ""}`} aria-hidden />
      {live && (
        <p className={`hint${played ? " done" : ""}`} aria-hidden>
          <span className="fine">click the sky</span>
          <span className="coarse">tap the sky</span>
        </p>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  )
}
