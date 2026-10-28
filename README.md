# Birthdayyy ♡

A personal, scrapbook-inspired birthday surprise website for **Shwetaaa** — warm cream paper, handwritten notes, film-strip video cards, polaroid frames and the official Spotify player, all in one single-page experience.

Built with **Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide icons**.

---

## 1. What is on the page

1. **Opening letter** — full-screen "A little something for you..." with a button: *Open your surprise ✨*
2. **Birthday reveal** — big greeting, gentle entrance animation and a short confetti burst
3. **A little note** — handwritten letter card with a heart "stamp" and washi tape
4. **Video memories** — 15 clips in a mixed polaroid / film-strip / cinematic grid, with filter chips and a polished lightbox player
5. **Pretty Little Memories** — 3 photos in large polaroid frames with a lightbox
6. **Music** — the official Spotify embed for *Thinkin Bout You* that **starts playing by itself** on the first interaction, plus an "Open in Spotify" link and a floating "Soundtrack" shortcut while scrolling
7. **Little Things That Deserve Appreciation ♡** — five small editable appreciation cards
8. **Before You Go... ♡** — the final letter with drifting petals and a *"Replay the surprise ↻"* button
9. **Footer** — quiet and small

Reduced motion is respected everywhere: confetti, floating hearts, petals and CSS loops all switch off for visitors with `prefers-reduced-motion`.

---

## 2. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production build:

```bash
npm run build
npm run start
```

---

## 3. Personalise it

### 3.1 The main switchboard — `src/data/birthday-config.ts`

Everything text-based lives here:

| Field | What it controls |
| --- | --- |
| `recipientName` | Her name, used across the whole site |
| `birthdayDate` | Real birthday (e.g. `"2026-05-14"`). Leave `""` and no date logic is rendered |
| `intro*` | Opening screen copy (title, subtitle, button, note) |
| `birthday*` | Reveal heading + supporting text + handwritten tagline |
| `note*` | The introduction note + signature |
| `video*`, `photo*` | Gallery headings/subtitles |
| `spotifyTrackId`, `spotifyTrackTitle` | The soundtrack |
| `music*` | Music section heading + supporting text |
| `finalLetterParagraphs` | Every paragraph of the final letter (each string = one paragraph) |
| `finalLetterSignature` | Closing line of the letter |
| `showSenderName` / `senderName` | Only shown if you explicitly set `showSenderName: true` |
| `replayButtonText`, `footerText` | Final button + footer line |
| `animations` | `confetti`, `floatingHearts`, `filmGrain` toggles |

### 3.2 Videos — `src/data/videos.ts` + `public/media/videos/`

Each object maps to one file:

```ts
{
  id: "moment-16",                      // unique
  title: "Moment 16",
  caption: "Your caption here.",
  src: "/media/videos/video-16.mp4",    // file that must exist
  poster: "/media/videos/poster-16.jpg",// optional thumbnail
  category: "favorites",                // or "little-things", or omit
  variant: "polaroid",                  // "polaroid" | "film" | "cinematic"
  featured: false,                      // true = taller card in the grid
  tilt: 1,                              // small rotation in degrees
  width: 360, height: 636,              // intrinsic dimensions
  duration: "0:12",                     // friendly label
}
```

To add a 16th video: drop `video-16.mp4` into `public/media/videos/`, make a poster with

```bash
ffmpeg -y -ss 0.3 -i video-16.mp4 -frames:v 1 -vf "scale=480:-2" -q:v 3 poster-16.jpg
```

then copy an object in `src/data/videos.ts` and edit the fields. The gallery, filters and lightbox pick it up automatically.

Filter chips are generated from the data: a chip is only shown when at least one video carries that `category`. Videos without a category still appear under **All Moments**.

If a video file (or poster) is missing, the card shows an elegant *"memory on the way"* placeholder instead of a broken player — nothing crashes.

### 3.3 Photos — `src/data/photos.ts` + `public/media/photos/`

Three entries (`photo-01.jpg` … `photo-03.jpg`) with `caption`, `alt`, and intrinsic `width`/`height` (used to render exact aspect ratios, no cropping surprises). JPEG, PNG and WebP all work — just keep `src` consistent with the real file/extension.

### 3.4 Little things — `src/data/little-things.ts`

Five cards with a `text`, a small handwritten `note`, an `icon` (`sparkles` | `flower` | `star` | `heart` | `music`) and a `tilt`. Edit freely.

### 3.5 Captions, dates, letter

Captions are the `caption` fields in the data files — swap the neutral placeholders for anything personal. The final letter is fully rewritten in `birthdayConfig.finalLetterParagraphs`.

---

## 4. Media notes

- The 15 clips are H.264 MP4 (widely compatible) and the 3 photos are JPEG, all self-hosted under `public/media/`. Total payload ≈ 4 MB, so no external hosting is needed.
- If you ever add heavier files: Vercel is fine for assets up to a few tens of MB, but for long/large videos consider hosting them externally (Cloudflare R2, Backblaze B2 + CDN, etc.) and pointing the `src` fields at those URLs. Nothing else changes.
- Recommended compression for future clips (keeps quality friendly for 9:16 phone videos):
  `ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -vf "scale=720:-2" -c:a aac -b:a 128k output.mp4`
- The page never downloads a video until you actually open it in the lightbox (`preload` is only used when the lightbox mounts; gallery cards show static posters, lazy-loaded).

---

## 5. Spotify

The music section embeds the official Spotify player:

```
https://open.spotify.com/embed/track/7DfFc7a6Rwfi3YQMRbDMau
```

- **The song starts by itself.** The page uses Spotify's official [Embed iFrame API](https://open.spotify.com/embed/iframe-api/v1) (loaded from `open.spotify.com`, wrapped in `src/lib/spotify-iframe-api.ts`) and sends a `play` command on the visitor's very first interaction — the click on "Open your surprise". This is a *user-permitted* start so it complies with browser autoplay policies: nothing ever plays sounds before the visitor touches the page.
- The embed **preloads eagerly** while the opening letter is still on screen (Spotify's API lazy-loads by default; `SpotifySection` upgrades its iframe to `loading="eager"` before handing it the track), so the song is ready the second the visitor arrives. Until playback is live, the section also listens for the visitor's first tap or keypress as a backup; attempts stay throttled (one per 1.2s, lifetime-capped) so a shy browser is never hammered with restart loops.
- `playback_update` events (Spotify sends `isPaused`) drive the status line and the little pulsing dot next to "Playing: …". If the visitor pauses manually, the page never auto-restarts.
- **iOS reality check:** iOS Safari does not pass a tap's permission into a cross-origin iframe, so there the song needs one tap on the green play button inside the embed itself. The page detects the missed start after a few seconds and shows a gentle hint. Desktop Chrome/Edge/Firefox and Android Chrome start on the first click.
- No audio is scraped or re-hosted; the official embed (the only audio surface) plus an "Open in Spotify" link, and the track is never downloaded. If playback needs a Spotify account, the official player stays intact.
- The floating "Soundtrack" pill simply scrolls back to this section — there is intentionally **no second competing audio player**.
- To swap the song: change `spotifyTrackId` / `spotifyTrackTitle` in `src/data/birthday-config.ts`. Everything else (embed, links, status copy) follows automatically.

---

## 6. Deploy to Vercel

Option A — dashboard:
1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add -A
   git commit -m "A little surprise for Shwetaaa"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Import the repo at vercel.com.
3. Framework preset: **Next.js** (auto-detected). Build command `next build`, output auto.
4. Deploy.

Option B — CLI:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

Note: a public Vercel URL is reachable by anyone who has the link — do not treat it as private. There is no tracking, analytics, camera/mic/location access, or account requirement; it is a plain static gift page.

---

## 7. Project structure

```
scripts/
  verify.cjs           # dev-only QA script (puppeteer-core: opens the site,
                       # tests lightbox, filters, Escape, replay). Adjust the
                       # URL/port inside before running.
  verify-mobile.cjs    # dev-only mobile-width check (lightbox + overflow).
  verify-music.cjs     # dev-only soundtrack check in a real headful window:
                       # asserts nothing plays before the first click and the
                       # song starts right after it.
src/
  app/
    layout.tsx          # fonts (Playfair Display, Caveat, Inter) + metadata
    page.tsx            # single-page experience + intro/replay state
    globals.css         # design tokens, grain, washi tape, film perforations
  components/
    IntroScreen.tsx     # opening letter
    BirthdayReveal.tsx  # warm reveal + confetti
    IntroNote.tsx       # scrapbook note
    VideoGallery.tsx    # heading, filter chips, grid, lightbox wiring
    VideoCard.tsx       # polaroid / film / cinematic card variants
    VideoLightbox.tsx   # single-video player dialog
    PhotoGallery.tsx    # polaroid album
    PhotoLightbox.tsx   # photo dialog
    SpotifySection.tsx  # official embed (iFrame API auto-start) + open-in-Spotify
    MusicShortcut.tsx   # floating scroll-to-music pill
    LittleThings.tsx    # appreciation cards
    FinalLetter.tsx     # closing letter + replay
    Footer.tsx
    Confetti.tsx        # one-shot confetti (reduced-motion aware)
    FloatingDecorations.tsx
  data/
    birthday-config.ts  # ALL copy + toggles
    videos.ts           # 15 video entries + chip definitions
    photos.ts           # 3 photo entries
    little-things.ts    # 5 cards
  lib/
    media-utils.ts      # numbering, durations, Spotify URLs, seeded random
    spotify-iframe-api.ts # typed wrapper for Spotify's Embed iFrame API (auto-start)
    lightbox-utils.ts   # scroll lock + keyboard/focus plumbing for dialogs
  types/media.ts        # VideoMemory / PhotoMemory types
public/
  media/videos/         # video-01..15.mp4 + poster-01..15.jpg
  media/photos/         # photo-01..03.jpg
  images/placeholders/  # media-coming-soon.svg
```

---

## 8. Known limitations

- Captions, categories ("Favorite Moments", "Little Things") and card tilts are neutral placeholders — they are reasonable defaults, not personal memories. Replace them in the data files as you personalise.
- `birthdayDate` is intentionally empty, so no countdown/date copy renders until you set a real date.
- The WhatsApp originals in the project root were copied into `public/media/` with clean names (`video-01.mp4` … `photo-03.jpg`); the originals were left untouched and can be deleted whenever.
- The lightbox relies on native HTML5 video controls (chosen for reliability across phones).
- The soundtrack's automatic start needs one interaction first (browser autoplay rules); after the "Open your surprise" click it begins on its own in desktop Chrome/Edge/Firefox and Android Chrome. On iOS Safari the visitor taps play in the embed once (the page shows a hint when its start attempt was refused).
