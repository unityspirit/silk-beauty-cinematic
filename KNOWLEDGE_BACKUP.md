# UnitySpirit — Knowledge Backup for Agent Transfer

> **Purpose:** This document is a complete, self-sufficient technical knowledge transfer for the `unityspirit` project. A new agent reading this document should be able to fully understand the project from scratch and replicate the same approach for any similar premium single-page website.

---

## 1. Project Overview

**UnitySpirit** is a **premium architectural restoration portfolio** website.
- **GitHub Repository:** https://github.com/bmwecker/webmaker1
- **Clone command:** `git clone https://github.com/bmwecker/webmaker1.git`
- **Type:** Single-page application (SPA), full-screen, scroll-driven cinematic experience.
- **Key UX concept:** The entire "scrolling" is fake — the page never actually scrolls. Instead, a canvas element animates through 200 pre-generated WebP frames driven by wheel/touch events, creating a cinematic video-scroll effect. Page content fades in/out on top of the canvas.

---

## 2. Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI framework |
| **TypeScript** | ~6.0 | Type safety |
| **Vite** | 8 | Build tool & dev server |
| **TailwindCSS** | 3 | Styling |
| **Framer Motion** | 12 | Micro-animations (whileInView) |
| **Lenis** | 1 | (installed but not used for scroll; canvas does it) |
| **clsx + tailwind-merge** | latest | Conditional class composition |
| **Python + Pillow** | any | Offline frame generation script |

**Google Fonts loaded in `index.html`:**
- `Noto Serif` — headline/serif font (class `font-headline`, `font-serif`, `.serif-display`)
- `Inter` — body/label font (class `font-body`, `font-label`)
- `Material Symbols Outlined` — icon font (used in Header hamburger menu)

---

## 3. Project File Structure

```
unityspirit/
├── index.html               ← Root HTML. Loads Google Fonts. Body has class="bg-background"
├── vite.config.ts           ← Minimal Vite config with React plugin
├── tailwind.config.js       ← Full Material Design 3 dark palette + custom fonts
├── tsconfig.json            ← TypeScript config
├── render.yaml              ← Render.com deployment: buildCommand=npm run build, staticPublishPath=dist
├── generate_frames.py       ← Python script to generate 200 WebP frames from 1 panoramic image
│
├── public/
│   ├── hero.png             ← Hero background image (big panoramic)
│   ├── port1.png            ← Portfolio project image 1
│   ├── port2.png            ← Portfolio project image 2
│   ├── port3.png            ← Portfolio project image 3
│   ├── icons.svg            ← Icon sprite (SVG)
│   └── frames-webp/         ← 200 frames: frame_000001.webp ... frame_000200.webp
│
└── src/
    ├── main.tsx             ← React entry point (wraps App in LanguageProvider)
    ├── App.tsx              ← Root layout: wraps in ScrollProvider, renders ScrollCanvas + 5 PageContainers
    ├── index.css            ← Tailwind directives + base styles + .serif-display, .text-glow utilities
    ├── App.css              ← (minimal, mostly unused)
    │
    ├── context/
    │   ├── ScrollContext.tsx    ← Provides: progress (0–1), activeIndex (0–4)
    │   └── LanguageContext.tsx  ← Provides: language, setLanguage, t (translations object)
    │
    ├── data/
    │   └── mockData.ts         ← All text content in both EN and RU. Single source of truth.
    │
    └── components/
        ├── ScrollCanvas.tsx    ← THE CORE ENGINE. Canvas animation + scroll input detection.
        ├── PageContainer.tsx   ← Per-page wrapper that shows/hides based on activeIndex
        ├── Header.tsx          ← Fixed nav with logo, language toggle, mobile menu
        ├── Hero.tsx            ← Page 0 — Large title + CTA button
        ├── TheAssembly.tsx     ← Page 1 — About section with image + staggered text
        ├── Portfolio.tsx       ← Page 2 — 3 alternating project cards
        ├── Journal.tsx         ← Page 3 — Email newsletter signup
        └── Footer.tsx          ← Page 4 — 4-column footer with contact info
```

---

## 4. Core Architecture: The Canvas Scroll System

This is the most unique and important part of the project. Understand this thoroughly.

### 4.1 Concept

- The browser's native scroll is **completely disabled** (`overflow-hidden` on the root `div`, `touch-none`).
- A `<canvas>` element covers the full screen (`fixed inset-0 z-0`).
- 200 WebP frames are pre-loaded into memory as `HTMLImageElement` objects.
- On wheel/touch events, a `targetFrame` number is updated.
- A `requestAnimationFrame` loop linearly-interpolates `currentFrame` towards `targetFrame` (LERP at 0.08 speed).
- Each frame tick, the canvas draws the corresponding image using `ctx.drawImage`.
- A vignette (`radial-gradient`) div sits above the canvas (`z-1`) for readability.
- A scroll progress bar sits at the very bottom of the screen.

### 4.2 Key Constants in `ScrollCanvas.tsx`

```ts
const TOTAL_FRAMES = 200;      // Must match generate_frames.py num_frames
const FRAME_DIR = '/frames-webp'; // Must match public/ subdirectory name
const LERP_SPEED = 0.08;       // Smoothness: lower = smoother but slower
const PAGE_COUNT = 5;          // Number of pages (Hero, Assembly, Portfolio, Journal, Footer)
const SCROLL_SPEED_WHEEL = 0.03; // Frame advance per wheel delta unit (lower = slower)
const TOUCH_COOLDOWN = 800;    // ms between touch snap actions
```

### 4.3 Frame Loading

- Done with a **concurrency-limited async loader** (48 parallel workers).
- Shows a fullscreen loading overlay with a `% counter` until all 200 frames are loaded.
- Uses `img.decode()` to ensure frames are GPU-decoded before marking as ready.

### 4.4 Input Handling

| Input | Behavior |
|---|---|
| **Mouse Wheel** | Continuous — adds `deltaY * SCROLL_SPEED_WHEEL` to `targetFrame`. No snapping. |
| **Touch Swipe** | Snap-page — swipe >50px triggers `changePage(±1)`, jumps to the exact frame for that page. |

### 4.5 `ScrollContext` — The State Bridge

```ts
// Provides to all children:
progress: number;      // 0.0 to 1.0 — where in the animation we are
activeIndex: number;   // 0 to 4 — which page is currently "active"
```

- `Header` uses `progress` to apply `backdrop-blur` and `bg-background/80` when `progress > 0.02`.
- `PageContainer` uses `activeIndex` to show/hide its content with CSS transitions.

---

## 5. Page System: `PageContainer.tsx`

Each page section is wrapped in `<PageContainer index={N}>`. There are 5 pages (index 0–4).

- All pages are rendered in the DOM simultaneously, **absolutely positioned** (`absolute inset-0`).
- Only the active page is visible (`opacity-100 visible`); others are `opacity-0 invisible`.
- The inner content animates in with `translate-y-0 scale-100` when active, and slides out with `translate-y-12 scale-[0.98]`.
- Transition duration: `1000ms` with `cubic-bezier(0.16,1,0.3,1)` — a fast-out-slow-in spring easing.

---

## 6. Internationalization (i18n) System

### 6.1 How it works

- All UI text lives in `src/data/mockData.ts` inside the `translations` object.
- Two languages are supported: `'en'` and `'ru'`.
- The `LanguageContext` provides:
  - `language` — current language code
  - `setLanguage(lang)` — switch language
  - `t` — the translations object for the current language (e.g. `t.hero.titleLines`)
- Every component calls `const { t } = useLanguage()` and renders purely from `t`.
- The `Header` has an EN/RU toggle button.

### 6.2 Translation Object Shape

```ts
translations.en = {
  nav: string[],              // ['Portfolio', 'The Assembly', 'Journal']
  hero: {
    titleLines: string[],     // Multi-line title, each line rendered as <span className="block">
    subtitle: string,
    cta: string,
    bgImage: string           // (not used in current Hero component)
  },
  assembly: {
    sectionNum: string,       // e.g '01'
    headlineMain: string,
    headlineSub: string,
    paragraphs: string[],
    image: string,            // path to image in /public
    imageCaption: string
  },
  portfolio: {
    title: string,
    subtitle: string,
    projects: Array<{
      id: number,
      title: string,
      description: string,
      image: string,
      alignment: 'left' | 'right'
    }>,
    cta: string               // "View Project"
  },
  journal: {
    title: string,
    description: string,
    placeholder: string,
    subscribe: string
  },
  footer: {
    brand: string,
    description: string,
    labels: { directory, network, headquarters },
    socials: string[],
    nav: string[],
    address: string,          // use \n for line breaks
    contact: string,
    copyright: string,
    links: string[]
  }
}
```

---

## 7. Design System (Tailwind)

### 7.1 Color Palette

The palette is a **Material Design 3 dark theme**, warm/neutral toned:
- Background: `#141314` (near black, warm)
- Surface: `#141314`
- `on-surface`: `#e6e1e2` (light warm grey — main text)
- `surface-tint`: `#ccc6ba` (muted text)
- `primary`: `#ffffff`
- `secondary`: `#7b5136` (warm brown — accent, used for numbered labels)
- `outline-variant`: `#4a463f`

### 7.2 Typography

```js
fontFamily: {
  "headline": ["Noto Serif", "serif"],   // Titles, .font-serif
  "body":     ["Inter", "sans-serif"],   // Body text
  "label":    ["Inter", "sans-serif"]    // Labels, buttons
}
```

Custom utility class: `.serif-display` = `font-family: "Noto Serif", serif` (defined in `index.css`).

### 7.3 Border Radius

All radii set to **0px by default** (sharp corners for brutalist aesthetic).  
`full` is kept at `9999px` for pill-shaped buttons.

### 7.4 Glassmorphism Pattern

Repeated pattern across components:
```tsx
className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl"
```

### 7.5 Animations

- Framer Motion `whileInView` for scroll-triggered reveals (used in `TheAssembly` and `Portfolio`).
- Standard CSS transitions for page fade-in/out.
- Interactive hover micro-animations:
  - Images: `group-hover:scale-105 transition-transform duration-1000`  
  - Buttons: animated underline `h-[1px] w-8 group-hover:w-16 transition-all duration-300`

---

## 8. Python Frame Generator (`generate_frames.py`)

This script pre-processes images into the 200-frame sequence BEFORE building the site.

### How it works

1. Opens a single **panoramic/wide source image** with Pillow.
2. Extracts 200 progressive crops that:
   - Pan **left-to-right** using **smoothstep easing** (`progress * progress * (3 - 2 * progress)`)
   - Zoom in by **15%** over the course (`start_zoom=1.0`, `end_zoom=1.15`)
3. Each crop is resized to `1920×1080` (LANCZOS resampling).
4. Saved as `frame_000001.webp` through `frame_000200.webp` in `public/frames-webp/`.
5. WebP quality = 85 (good balance of quality vs file size).

### Requirements

```bash
pip install Pillow
```

### Running

```bash
# 1. Place your source image next to the script (or set a full path)
# 2. Open generate_frames.py and update line: img_path = 'your_image.png'
# 3. Run:
python generate_frames.py
```

> **NOTE:** `img_path` in the script is already cleaned — just set it to your own image filename. The image should ideally be **very wide** (panoramic, landscape) to allow meaningful panning.

### Generating Source Images

The source panoramic image was generated by the AI agent using `generate_image` tool. For a new site:
1. Generate a wide atmospheric image using `generate_image` (e.g., prompt: "brutalist stone architecture, panoramic atmosphere, cinematic, dark mood, 16:9 ultra-wide")
2. Update `img_path` in the script.
3. Run the script to produce 200 frames.
4. Ensure `public/frames-webp/` is committed to Git (or served as static files).

---

## 9. Deployment

**Platform:** Render.com (static site)

**`render.yaml`:**
```yaml
services:
  - type: web
    name: unityspirit
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
```

**Build process:**
1. `npm install` installs all dependencies.
2. `npm run build` (= `tsc -b && vite build`) compiles TypeScript and bundles to `dist/`.
3. Render serves `dist/` as a static site.

> **CRITICAL:** The `public/frames-webp/` folder with all 200 `.webp` files **must be committed to Git** before deploying. They total ~30MB and are essential — the site is broken without them. In this project they are already committed in the GitHub repo.

---

## 10. Step-by-Step: How to Build a Similar Site From Scratch

Follow these steps to replicate the UnitySpirit approach for a new client/niche:

### Step 1: Scaffold the project

```bash
npx -y create-vite@latest ./ --template react-ts
npm install framer-motion tailwindcss postcss autoprefixer clsx tailwind-merge
npx tailwindcss init -p
```

### Step 2: Configure Tailwind

In `tailwind.config.js`, define:
- Custom color palette (use Material Design 3 tokens or any curated dark palette)
- Custom `fontFamily` with `headline` (serif) and `body` (sans-serif)
- Set border radius defaults as needed

### Step 3: Set up `index.html`

Load Google Fonts in `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet"/>
```

### Step 4: Create the i18n data layer

In `src/data/mockData.ts`, define your `translations` object with all text for each language. All components should consume ONLY this data, never hardcode strings.

### Step 5: Build Context providers

**`ScrollContext`**: Provides `progress` (0–1) and `activeIndex` (0 to PAGE_COUNT-1).  
**`LanguageContext`**: Provides `language`, `setLanguage`, `t` (current translations).

### Step 6: Generate frames

1. Find or generate a panoramic atmospheric image relevant to the site's theme.
2. Update `generate_frames.py` with the new `img_path`, `num_frames`, and zoom settings.
3. Run the script: `python generate_frames.py`
4. Verify that `public/frames-webp/` contains the expected number of `.webp` files.

### Step 7: Build `ScrollCanvas.tsx`

Copy the component and update:
- `TOTAL_FRAMES` to match your frame count (default 200)
- `PAGE_COUNT` to match your number of pages
- `SCROLL_SPEED_WHEEL` — lower for slower scroll (default 0.03)
- `LERP_SPEED` — lower for smoother/slower interpolation (default 0.08)

### Step 8: Build page components

For each page (Hero, About, Portfolio, etc.):
- Create a component that consumes `useLanguage()` and renders from `t.pageName.*`
- Wrap it in `<PageContainer index={N}>` in `App.tsx`
- Use the glass card pattern (`bg-black/40 backdrop-blur-md border border-white/10`)
- Use Framer Motion `whileInView` for scroll-triggered animations within each page

### Step 9: Build `App.tsx`

```tsx
<ScrollProvider>
  <div className="bg-black text-white w-full h-screen overflow-hidden touch-none">
    <ScrollCanvas />    {/* Canvas background */}
    <Header />          {/* Fixed nav */}
    <main className="relative z-10 w-full h-full">
      <PageContainer index={0}><Hero /></PageContainer>
      <PageContainer index={1}><About /></PageContainer>
      {/* ... etc */}
    </main>
  </div>
</ScrollProvider>
```

### Step 10: Deploy to Render

1. Fork or clone https://github.com/bmwecker/webmaker1 as the starting point.
2. Push everything to your own GitHub repo (including `public/frames-webp/`).
3. Connect the repo to Render.com.
4. Add `render.yaml` with the static site config (already present in this repo).
5. Render auto-deploys on every push to `main`.

---

## 11. Common Pitfalls & Tips

| Issue | Solution |
|---|---|
| Frames not showing | Ensure `FRAME_DIR` matches the exact folder name in `public/`. Filenames must be zero-padded with 6 digits: `frame_000001.webp`. |
| Site broken on deploy | Check that `public/frames-webp/` is committed and not in `.gitignore`. |
| Touch not scrolling on mobile | Ensure `touch-action: none` (`touch-none` Tailwind class) is on the root div. Also, the touch handler uses `e.changedTouches[0]` on `touchend` event. |
| Pages not fading correctly | `PageContainer` uses `delay-300` on the hiding transition. Keep the page z-ordering consistent. |
| Canvas looks blurry on HiDPI | `resize()` function multiplies canvas size by `devicePixelRatio` and applies `ctx.setTransform(dpr, ...)`. Never skip this. |
| Frame loading too slow | Increase the concurrency limit from 48 if on a fast connection. For a smaller site, reduce to 100 frames. |
| Adding more languages | Add a new key to the `translations` object in `mockData.ts`. Update `LanguageContext` type. Update the toggle button logic in `Header.tsx`. |

---

## 12. Key Code Patterns to Reuse

### Glassmorphism card
```tsx
<div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8">
```

### Animated underline button
```tsx
<button className="flex items-center gap-2 group text-sm uppercase tracking-widest">
  <span className="h-[1px] w-8 bg-current group-hover:w-16 transition-all duration-300" />
  Label Text
</button>
```

### Framer Motion stagger reveal
```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{ visible: { transition: { staggerChildren: 0.2 } }, hidden: {} }}
>
  {items.map((p, i) => (
    <motion.p
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
      }}
    >
      {p}
    </motion.p>
  ))}
</motion.div>
```

### Header blur on scroll
```tsx
const { progress } = useScrollProgress();
const scrolled = progress > 0.02;
// Apply to header:
className={`${scrolled ? 'bg-background/80 backdrop-blur-xl' : 'bg-transparent'}`}
```

### Alternating portfolio layout
```tsx
const isEven = index % 2 === 0;
<div className={`flex ${isEven ? '' : 'lg:flex-row-reverse'}`}>
```

---

*End of knowledge backup. This document captures 100% of the UnitySpirit codebase as of 2026-04-23. Source code: https://github.com/bmwecker/webmaker1*
