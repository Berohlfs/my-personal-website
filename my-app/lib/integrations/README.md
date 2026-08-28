# Integrations

External-API fetchers from the previous version of this site (the content-driven layout with
GitHub stats, Medium articles and YouTube channel data).

**In use:** `github.ts` — `getGithubUser()` supplies the astronaut balloon's avatar
(server-side, cached with daily revalidation). **Archived:** `medium.ts` and `youtube.ts`
are imported nowhere and ship in no bundle; they're kept inside the TypeScript project so
`tsc --noEmit`, `next build` and `eslint` keep them compiling. Re-wire anytime.

## Modules

| Module | Function | Source | Auth |
|---|---|---|---|
| `github.ts` | `getGithubUser()`, `getGithubRepos()` | GitHub REST API v3 | `GITHUB_TOKEN` |
| `medium.ts` | `getMediumPosts(username)` | Medium RSS feed (`medium.com/feed/@user`) | none |
| `youtube.ts` | `getYoutubeChannel()` | YouTube Data API v3 (`channels?part=snippet,statistics`) | `GOOGLE_YOUTUBE_KEY`, `GOOGLE_YOUTUBE_CHANNEL_ID` |

All fetchers use the Next.js data cache (`force-cache` + `revalidate`), throw on non-2xx
responses, and return the typed shapes in `types.ts` (sample values preserved as comments).

## Env vars

Names are documented in [`../../.env.example`](../../.env.example). Values live in the local
`.env` (gitignored) and, historically, in the Vercel project settings.

## Usage

They are server-side fetchers — call them from a Server Component or route handler:

```tsx
import { getGithubUser, getGithubRepos } from '@/lib/integrations/github'
import { getMediumPosts } from '@/lib/integrations/medium'
import { getYoutubeChannel } from '@/lib/integrations/youtube'

export default async function Page() {
    const user = await getGithubUser()
    const repos = await getGithubRepos()
    const articles = await getMediumPosts('berohlfs')
    const channel = await getYoutubeChannel()
    // ...
}
```

`medium.ts` depends on the `rss-parser` package — keep it in `package.json` while this
folder exists. The old UI that consumed these (Repos list, PlatformSpecs cards, article
grid) can be recovered from git history: `git show 53471a6 -- my-app/app/components`.
