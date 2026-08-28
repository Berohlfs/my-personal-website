# night constellation

The site is one screen: a dark sky rendered on two stacked `<canvas>` layers,
with the name, a tagline, and four links laid over it as server-rendered HTML.

- **Starfield** — hundreds of depth-biased stars that drift, twinkle, glint,
  and swirl away from the cursor (repulsion + tangential force, spring-back).
- **Fireworks** — click/tap the sky to launch a rocket that bursts where you
  aimed. Hold to charge a bigger burst. Rate-limited, pooled, additive-blended.
- **Easter eggs** — an occasional shooting star can be caught for a wish; the
  konami code (`↑ ↑ ↓ ↓ ← → ← → b a`) starts a finale; the console says hi.

## Stack

- [Next.js 15](https://nextjs.org) (App Router, static prerender) + React 19
- Tailwind CSS v4 (CSS-first config; design tokens in `app/globals.css`)
- Fraunces + IBM Plex Mono via `next/font`
- **No animation libraries** — the engine in [`lib/engine/`](lib/engine/) is
  hand-rolled Canvas 2D: preallocated particle pool, DPR-capped rendering,
  adaptive quality governor, `visibilitychange` pause. With
  `prefers-reduced-motion`, the engine never boots and a static CSS sky
  (`.static-sky`) stands in.

## Develop

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build   # production build (fully static)
pnpm lint
```

## Archived integrations

The previous version of this site rendered live GitHub, Medium, and YouTube
data. Those fetchers are preserved — typed, unimported, out of the bundle — in
[`lib/integrations/`](lib/integrations/), with env var names documented in
[`.env.example`](.env.example).
