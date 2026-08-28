'use client'

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import astronaut from "@/public/astronaut-transparent.png"
import { LINKS } from "../links"

const PHRASES = [
  "Hi! I'm Bernardo. I'm a software engineer.",
  "It's nice to see someone. It's usually so quiet up here...",
  "Ok — I know I said it's nice to see you. But if you could stop poking me, I'd appreciate it.",
  "Dude. Every time you poke me I have to compensate with the jetpack. You're wasting my fuel.",
  "Stop. Poking. Me.",
  "That is SO rude.",
  "You came all the way to space... just to poke a guy?",
  "That's sad.",
  "please stop.",
  "if you keep poking me,",
  "a dangerous time loop will begin and I'll be stuck here forever.",
  "oh shit.",
]

const VANISH_AFTER_MS = 1400
const REENTER_AFTER_MS = 1600

type Props = {
  avatarUrl: string
}

export function Astronaut({ avatarUrl }: Props) {
  // remounting the .astro wrapper replays the CSS entrance — the time loop
  const [cycle, setCycle] = useState(0)
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [pokes, setPokes] = useState(0)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const onOutside = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("pointerdown", onOutside)
    const pending = timers.current
    return () => {
      window.removeEventListener("pointerdown", onOutside)
      pending.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const poke = () => {
    if (leaving || step >= PHRASES.length) return
    const next = step + 1
    setStep(next)
    setOpen(true)
    setPokes((n) => n + 1)

    // the jetpack compensates (Scene turns this into sparks)
    const btn = btnRef.current
    if (btn) {
      const r = btn.getBoundingClientRect()
      window.dispatchEvent(
        new CustomEvent("astro-poke", {
          detail: { x: r.left + r.width / 2, y: r.bottom - 10 },
        })
      )
    }

    if (next === PHRASES.length) {
      timers.current.push(
        window.setTimeout(() => {
          setLeaving(true)
          setOpen(false)
          timers.current.push(
            window.setTimeout(() => {
              setCycle((c) => c + 1)
              setStep(0)
              setLeaving(false)
            }, REENTER_AFTER_MS)
          )
        }, VANISH_AFTER_MS)
      )
    }
  }

  return (
    <div className="astro" key={cycle}>
      <div className={`astro-fade${leaving ? " out" : ""}`} ref={wrapRef}>
        <div className="float-x">
          <div className="float-y">
            {open && step > 0 && (
              <div className="balloon" role="dialog" aria-label="Bernardo Rohlfs">
                <div className="balloon-head">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 26px avatar, optimization overkill */}
                  <img className="balloon-ava" src={avatarUrl} alt="" width={26} height={26} />
                  <span className="balloon-name">Bernardo Rohlfs</span>
                </div>
                <p className="balloon-text" aria-live="polite">
                  {PHRASES[step - 1]}
                </p>
                <nav className="balloon-links" aria-label="Profiles">
                  {LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      {...(link.href.startsWith("mailto:")
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}
            <button
              ref={btnRef}
              type="button"
              className="astronaut"
              data-no-fx
              data-spark
              aria-expanded={open}
              aria-label="the astronaut — poke him"
              onClick={poke}
            >
              <span className="astro-sprite" key={pokes} data-wiggle={pokes > 0 || undefined}>
                <Image src={astronaut} alt="" priority className="astro-img" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
