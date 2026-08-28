import { Fragment } from "react"
import { Scene } from "./components/Scene"

const NAME = "Bernardo Rohlfs"

const LINKS = [
  { label: "github", href: "https://github.com/Berohlfs" },
  { label: "linkedin", href: "https://linkedin.com/in/bernardorohlfs" },
  { label: "medium", href: "https://medium.com/@berohlfs" },
  { label: "email", href: "mailto:berohlfs@gmail.com" },
]

export default function Home() {
  let letterIndex = 0

  return (
    <div className="stage">
      <div className="static-sky" aria-hidden />

      <Scene />

      <main className="hud">
        <h1 className="name" aria-label={NAME}>
          {NAME.split(" ").map((word, wi) => (
            <Fragment key={wi}>
              {wi > 0 && " "}
              <span className="word" aria-hidden>
                {word.split("").map((ch) => (
                  <span
                    className="letter"
                    key={letterIndex}
                    style={{ "--i": letterIndex++ } as React.CSSProperties}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
        </h1>

        <p className="tagline">
          software engineer — building precise, playful things for the web
        </p>

        <nav className="links" aria-label="Profiles">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-spark
              {...(link.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </main>

      <footer className="colophon">
        © {new Date().getFullYear()} bernardo cruz rohlfs
      </footer>
    </div>
  )
}
