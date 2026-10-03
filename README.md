# Rhinos — Built for the last rep.

Marketing site for **Rhinos**, a fictional strength & conditioning club in the Arts District, Los Angeles. It's a single page:

- **Hero**: a live WebGL "thermal camera" athlete.
- **Sections**: discipline marquee, pinned horizontal facilities gallery, filterable classes, scroll-scrubbed manifesto with counters, flip-card coaches, weekly timetable, membership plans with a price roll, and a free-week CTA.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4**.
- **GSAP**: ScrollTrigger and SplitText for scroll and text motion. It's lazy-loaded after hydration, so it never sits on the critical path.
- **Web Animations API**: the time-critical motion (hero intro, mobile menu, list staggers). These play instantly without a library.
- **Lenis**: smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. Also lazy-loaded.
- **Raw WebGL** (no Three.js): one ~4 KB shader powers the hero and every image on the site.
- **`next/font/local`**: self-hosted, subsetted Archivo + JetBrains Mono.
- **`next/image`**: everything is served as AVIF/WebP.

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build (includes type-check)
npm run start      # serve the production build
npm run lint       # ESLint (zero warnings expected)
npm run typecheck  # tsc --noEmit
npm run art        # re-render public/art/*.webp from the thermal scenes
npm run og         # re-render the OG/Twitter card and app icons
npm run fonts      # rebuild the subsetted fonts (needs: pip install fonttools brotli)
```

`npm run art` and `npm run og` need Playwright with Chromium (`npm i -g playwright && npx playwright install chromium`). WebGL runs through SwiftShader, so no GPU is required.

## Project layout

```
src/
  app/                 layout, page, metadata routes (sitemap, robots, manifest, OG image, icons)
  components/
    sections/          one file per page section (+ *Fx.tsx motion islands)
    fx/                site-wide behaviour: smooth scroll, scroll reveals, cursor, magnetic, thermal canvas
    ui/                brand mark, icons, section heading
  content/site.ts      all copy and data (classes, coaches, timetable, plans)
  lib/
    motion.ts          motion tokens (one easing family, one duration scale), WAAPI helpers, lazy GSAP loader
    gsap.ts            GSAP + ScrollTrigger + SplitText registration (only ever imported dynamically)
    fx-queue.ts        loads GSAP after hydration, then runs effect setup in idle time, one section per task
    thermal/           shader, poses and offline scenes for the thermal art
  fonts/               subsetted variable fonts + OFL licences
scripts/               art, OG and font build scripts
```

## Design system

Tokens live in `src/app/globals.css` (`@theme`):

- **Colour**: ink, chalk and ember, each pair checked for WCAG AA.
- **Type**: a fluid type scale using `clamp()`.
- **Spacing**: a gutter and section rhythm on top of Tailwind's 4 px scale.
- **Shape and motion**: radii, shadows, and one easing family with a four-step duration scale.

## Performance

Lighthouse (mobile, local production build) scores 97/100/100/100, with LCP about 2.0 s, TBT about 120 ms and CLS 0. Desktop scores 99/100/100/100.

- **First-paint JS:** only the React/Next runtime plus small islands ship before first paint. GSAP and Lenis arrive after hydration.
- **Effect setup:** it's queued into idle time, so no single task grows long.
- **Preloads:** only the main font and the hero image are preloaded (high priority). Everything below the fold is lazy.
- **Fonts:** subsetted from 128 KB to 79 KB.

## Motion & accessibility principles

- **No-JS safe:** every animated element renders in its final state without JS. Initial states are only ever set by GSAP.
- **Preloader:** pure CSS, shown once per session and gone in about 1.4 s even if scripts never load. The hero intro syncs to its CSS clock.
- **Reduced motion:** `prefers-reduced-motion` turns off Lenis, pinning, reveals, the preloader and the live canvas. The facilities gallery becomes a native swipe carousel.
- **Pointer:** the custom cursor and magnetic buttons only exist on fine-pointer, hover-capable devices. Touch keeps native behaviour.
- **Live canvas:** it boots after idle, renders at low resolution, and pauses off-screen or in background tabs. It falls back to the poster on software-only GPUs or slow frames.
- **Navigation:** the nav adapts its glass to the section underneath it, which keeps AA contrast on light and dark surfaces. It hides on scroll down and returns on scroll up.

## Credits

See [CREDITS.md](./CREDITS.md). All imagery is original. Unsplash/Pexels were blocked in the build environment, and the art pipeline makes swapping photos in a one-line change per slot.
