import { getGithubUser } from "@/lib/integrations/github"
import { Astronaut } from "./components/Astronaut"
import { Scene } from "./components/Scene"
import { LINKS } from "./links"

// the pinned avatar URL keeps working even when the API call can't
const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/90404673?v=4"

export default async function Home() {
  let avatarUrl = FALLBACK_AVATAR
  try {
    avatarUrl = (await getGithubUser()).avatar_url
  } catch {
    // GitHub unreachable or unauthorized at build time — use the fallback
  }

  return (
    <div className="stage">
      <div className="static-sky" aria-hidden />

      <Scene />

      <main className="hud">
        <h1 className="sr-only">Bernardo Rohlfs — software engineer</h1>
        <Astronaut avatarUrl={avatarUrl} />
        <noscript>
          <div className="noscript-card">
            <p>Bernardo Rohlfs — software engineer</p>
            <nav aria-label="Profiles">
              {LINKS.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </noscript>
      </main>

      <footer className="colophon">
        © {new Date().getFullYear()} bernardo cruz rohlfs
      </footer>
    </div>
  )
}
