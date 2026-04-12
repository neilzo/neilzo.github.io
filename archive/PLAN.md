# Plan: Personal Site Remake with Astro — "The Ordered Archive"

## Context
Neil's personal site at neildaftary.com is currently a static HTML page (single index.html, Bebas Neue font, minimal layout). The goal is a full remake using Astro v5 as a blog/photo feed with editorial "architectural monograph" styling. Designs exist in `/stitch_personal_photo_blog/` as complete HTML/CSS mockups. The site lives on GitHub Pages on branch `site-remake`.

---

## Tech Stack
- **Astro v5** (static output for GitHub Pages)
- **Tailwind CSS v4** (Vite plugin, CSS-first @theme config — no tailwind.config.js)
- **@astrojs/mdx** for content
- **@astrojs/sitemap**
- Custom **remark plugin** for `^(...)` footnote tooltips

---

## Repository Layout
The Astro project initializes at the repo root. Existing stitch files, CNAME, keybase.txt remain untouched during dev. A `public/` dir handles static passthrough (CNAME, keybase.txt, images).

```
/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── CNAME
│   └── keybase.txt
├── src/
│   ├── content/
│   │   ├── config.ts               ← collection schemas
│   │   ├── posts/                  ← .mdx files for all posts
│   │   ├── pages-special/          ← favorites.mdx, currently.mdx, setup.mdx
│   │   └── about/
│   │       └── index.mdx
│   ├── layouts/
│   │   ├── BaseLayout.astro        ← <html>, fonts, SEO, GrainOverlay
│   │   ├── SiteLayout.astro        ← BaseLayout + TopNav + SideNav + Footer
│   │   ├── PostLayout.astro        ← SiteLayout + editorial header; picks template
│   │   └── SpecialPageLayout.astro ← SiteLayout + section header (Favorites/Setup/Currently)
│   ├── pages/
│   │   ├── index.astro             ← home feed, page 1
│   │   ├── about.astro
│   │   ├── favorites.astro
│   │   ├── currently.astro
│   │   ├── setup.astro
│   │   ├── page/[page].astro       ← /page/2, /page/3 ... (paginate, 8/page)
│   │   ├── posts/[slug].astro      ← individual post
│   │   └── tags/[tag].astro        ← filtered tag listing
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.astro
│   │   │   ├── SideNav.astro       ← fixed desktop sidebar w/ tag links
│   │   │   ├── MobileBottomNav.astro
│   │   │   └── Footer.astro
│   │   ├── posts/
│   │   │   ├── PostCard.astro      ← text post feed card
│   │   │   ├── PostCardPhoto.astro ← photo post feed card
│   │   │   ├── PostMeta.astro      ← entry#, date, metadata sidebar column
│   │   │   └── PostImageFrame.astro ← monograph-framed image with plate label
│   │   ├── ui/
│   │   │   ├── TagBadge.astro
│   │   │   ├── TagList.astro
│   │   │   ├── Pagination.astro
│   │   │   ├── GrainOverlay.astro  ← fixed overlay, opacity 0.03
│   │   │   └── HairlineRule.astro
│   │   ├── favorites/
│   │   │   ├── FavoritesSection.astro
│   │   │   └── FavoritesEntry.astro
│   │   └── setup/
│   │       ├── SetupCategory.astro
│   │       └── SetupItem.astro
│   ├── plugins/
│   │   └── remark-footnote-tooltip.mjs
│   ├── styles/
│   │   ├── global.css              ← @import "tailwindcss" + @theme tokens
│   │   └── prose.css               ← MDX body typography + footnote CSS
│   └── utils/
│       ├── getAllPosts.ts
│       ├── getPostsByTag.ts        ← tagToSlug / slugToTag helpers
│       └── formatDate.ts
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Design System (from stitch mockups)

**Colors** (defined as Tailwind v4 `@theme` tokens):
- `primary`: `#173124` — ink/text/structure
- `secondary`: `#944925` — rust accent, CTAs, active states
- `surface`: `#fbf9f4` — warm paper background
- `surface-container-high`: `#eae8e3` — sidebar, recessed blocks
- `outline-variant`: `#c2c8c2` — hairlines

**Typography:**
- `font-headline` → Manrope (700–800), all navigation/labels uppercase tracking-widest 10px
- `font-body` → Newsreader (400–500 regular + italic), all reading content

**Key rules:**
- `border-radius: 0px` everywhere (override Tailwind default)
- No drop shadows; depth via tonal surface layering
- 1px hairline borders (`outline-variant`) separate sections
- 40px architectural grid bg (5% opacity) on some pages
- Grain overlay: fixed position, SVG feTurbulence, opacity 0.03

---

## Content Collection Schema (`src/content/config.ts`)

### `posts` collection (Zod discriminated union)
```ts
const sharedFields = {
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.enum([...14 tags...])),
  draft: z.boolean().default(false),
  excerpt: z.string().optional(),
  entryNumber: z.string().optional(),
};

schema: z.discriminatedUnion('template', [
  z.object({ template: z.literal('text'), ...sharedFields }),
  z.object({
    template: z.literal('photos'),
    images: z.array(z.object({ src, alt, caption?, plateLabel? })),
    camera: z.string().optional(),
    location: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    ...sharedFields,
  }),
])
```

### `pages-special` — `{ title, subtitle?, updatedDate?, sectionLabel?, pageKey }`
### `about` — `{ tagline, links: [{label, url, description}][], updatedDate? }`

---

## Pagination (`src/pages/page/[page].astro`)
- Uses Astro's `paginate()` helper in `getStaticPaths`
- `pageSize: 8`
- Generates `/page/2`, `/page/3` … `/page/N`
- `index.astro` renders page 1 content directly (same logic, no redirect needed)

## Tag Filtering (`src/pages/tags/[tag].astro`)
- `getStaticPaths` iterates all 14 tags, slugifies (lowercase, spaces→hyphens)
- Filters posts by tag, passes as props
- `tagToSlug` / `slugToTag` helpers in `utils/getPostsByTag.ts` used everywhere for consistency

---

## Footnote Remark Plugin (`src/plugins/remark-footnote-tooltip.mjs`)

**Syntax:** `^(footnote text)` → inline hover tooltip

**Implementation approach:**
1. Visit `paragraph` nodes (not `text` — so we can splice children)
2. For each `text` child, use regex `/\^\(([^)]+)\)/g` to find matches
3. Split the text into segments; for each match insert an `html` node:
   ```html
   <sup class="fn-marker" tabindex="0" aria-describedby="fn-1" data-fn="1">1</sup>
   <span id="fn-1" role="tooltip" class="fn-tooltip">footnote text</span>
   ```
4. Replace the original text node in `parent.children` with the expanded array
5. Counter resets per document (module-scoped in transformer)

**CSS in `prose.css`:**
```css
.fn-marker { position: relative; color: var(--color-secondary); ... }
.fn-tooltip { display: none; position: absolute; bottom: calc(100% + 6px); ... }
.fn-marker:hover .fn-tooltip,
.fn-marker:focus .fn-tooltip { display: block; }
```
- `role="tooltip"` + `aria-describedby` on the `<sup>` = correct ARIA pattern
- `tabindex="0"` enables keyboard access

---

## GitHub Pages Deployment (`.github/workflows/deploy.yml`)
- Trigger: push to `site-remake` branch
- Steps: checkout → Node 20 → `npm ci` → `npm run build` → upload `dist/` → deploy pages
- Source: set to "GitHub Actions" in repo settings (not legacy branch deploy)
- `public/CNAME` is copied to `dist/` by Astro automatically

---

## Astro Config (`astro.config.mjs`)
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import remarkFootnoteTooltip from './src/plugins/remark-footnote-tooltip.mjs';

export default defineConfig({
  site: 'https://neildaftary.com',
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  markdown: { remarkPlugins: [remarkFootnoteTooltip] },
});
```

---

## Milestones

### Milestone 1 — Project Scaffolding
**Goal:** Astro project boots locally with correct config, fonts, and design tokens.

- [ ] `npm create astro@latest` (blank template at repo root)
- [ ] Install deps: `@astrojs/mdx`, `@astrojs/sitemap`, `@tailwindcss/vite`, `tailwindcss`, `unist-util-visit`
- [ ] Write `astro.config.mjs` (static output, MDX, Tailwind vite plugin, sitemap)
- [ ] Write `src/styles/global.css` — `@import "tailwindcss"` + full `@theme` token block (all colors, fonts, 0px border-radius override)
- [ ] Write `BaseLayout.astro` — `<html>` shell, Google Fonts `<link>` tags, `GrainOverlay`, SEO meta
- [ ] Move CNAME + keybase.txt into `public/`
- **Verify:** `npm run dev` → blank page loads at localhost:4321 with correct background color (#fbf9f4) and fonts

---

### Milestone 2 — Content Collections & Schema
**Goal:** Content layer is wired up; sample posts are parseable.

- [ ] Write `src/content/config.ts` with all three collections (`posts`, `pages-special`, `about`)
- [ ] Create 3–5 sample `.mdx` posts in `src/content/posts/` (mix of `template: 'text'` and `template: 'photos'`)
- [ ] Create `src/content/about/index.mdx`
- [ ] Create `src/content/pages-special/favorites.mdx`, `currently.mdx`, `setup.mdx`
- [ ] Write `src/utils/getAllPosts.ts`, `getPostsByTag.ts` (with `tagToSlug`/`slugToTag`), `formatDate.ts`
- **Verify:** `getCollection('posts')` returns typed entries without schema errors

---

### Milestone 3 — Chrome & Navigation
**Goal:** Every page has consistent nav/sidebar; site feels navigable.

- [ ] `SiteLayout.astro` — wraps `BaseLayout`, renders `TopNav`, `SideNav`, `MobileBottomNav`, `Footer`
- [ ] `TopNav.astro` — fixed header, "The Ordered Archive" wordmark, nav links, active state via secondary underline
- [ ] `SideNav.astro` — fixed desktop sidebar (w-64), all 14 tag links → `/tags/[slug]`, active highlight
- [ ] `MobileBottomNav.astro` — icon-only bottom bar, `md:hidden`
- [ ] `Footer.astro` — colophon line
- [ ] Stub pages: `about.astro`, `favorites.astro`, `currently.astro`, `setup.astro` (empty SiteLayout shells)
- **Verify:** Nav renders correctly on all stub pages; sidebar tag links are all present; mobile bottom nav visible at <768px

---

### Milestone 4 — Home Feed
**Goal:** Paginated home feed renders post cards matching the stitch mockup.

- [ ] `PostMeta.astro` — entry number, date, hairline, category metadata sidebar column
- [ ] `PostCard.astro` — 12-col grid: PostMeta left + title/excerpt/CTA right
- [ ] `PostCardPhoto.astro` — same grid + `PostImageFrame` for first image
- [ ] `PostImageFrame.astro` — monograph frame (padding, outline-variant border, plate label)
- [ ] `TagBadge.astro`, `TagList.astro` — hairline border pills linking to `/tags/[slug]`
- [ ] `Pagination.astro` — prev/next + page number buttons
- [ ] `HairlineRule.astro`
- [ ] `index.astro` — renders page 1 of feed (8 posts), shows PostCard/PostCardPhoto per template
- [ ] `page/[page].astro` — `getStaticPaths` with `paginate()`, renders same feed for pages 2+
- **Verify:** Home matches `home_geometric_final_v3/screen.png`; `/page/2` exists if >8 sample posts

---

### Milestone 5 — Post Pages
**Goal:** Individual post URLs render full editorial layouts.

- [ ] `PostLayout.astro` — extends SiteLayout; editorial header (category label, h1, date); dispatches to text vs. photo template
- [ ] `posts/[slug].astro` — `getEntry` + `post.render()`, passes to PostLayout
- [ ] `SpecialPageLayout.astro` — extends SiteLayout; section header with secondary accent bar
- [ ] Text post body: Newsreader prose, justified, 3rem text-indent, `prose.css` typography
- [ ] Photo post body: lead image in monograph frame, plate-labeled image flow
- [ ] `src/styles/prose.css` — all body typography styles
- **Verify:** Text post and photo post both render at `/posts/[slug]`; typography matches `post_text_only` and `post_refined_imagery_text` stitch designs

---

### Milestone 6 — Footnote Plugin
**Goal:** `^(...)` syntax in MDX renders as accessible hover tooltips.

- [ ] Write `src/plugins/remark-footnote-tooltip.mjs`
  - Visit `paragraph` nodes; regex `/\^\(([^)]+)\)/g`
  - Splice `text` nodes into `text` + `html` (tooltip markup) segments
  - Numbered markers, sequential per document
- [ ] Register plugin in `astro.config.mjs` `markdown.remarkPlugins`
- [ ] Add footnote CSS to `prose.css`: `.fn-marker`, `.fn-tooltip`, hover/focus reveal
- **Verify:** Write `^(This is a footnote)` in a test post; numbered superscript appears; hover/focus shows tooltip; Tab navigation works

---

### Milestone 7 — Tag Pages
**Goal:** All 14 tag pages render filtered post lists.

- [ ] `tags/[tag].astro` — `getStaticPaths` generates all 14 tag slugs; filters + sorts posts; renders as feed list
- [ ] SideNav active state highlights current tag
- **Verify:** `/tags/writing`, `/tags/tech-industry`, `/tags/photos` all render correct filtered lists

---

### Milestone 8 — Special Pages
**Goal:** About, Favorites, Currently, Setup pages match stitch designs.

- [ ] `about.astro` — renders `about/index.mdx` content via SpecialPageLayout; 2-col bio grid, digital presence links
- [ ] `favorites.astro` + `FavoritesSection.astro` + `FavoritesEntry.astro` — categorized curated list; matches `favorites_refined_v4/screen.png`
- [ ] `currently.astro` — "what I'm up to" sections (games, watching, reading)
- [ ] `setup.astro` + `SetupCategory.astro` + `SetupItem.astro` — gear list; matches `setup_refined_v4/screen.png`
- **Verify:** All four pages render; compare to respective stitch screenshots

---

### Milestone 9 — Deployment
**Goal:** Site deploys to neildaftary.com via GitHub Actions.

- [ ] Write `.github/workflows/deploy.yml`
- [ ] Set GitHub Pages source to "GitHub Actions" in repo settings
- [ ] Confirm `public/CNAME` copies to `dist/CNAME`
- [ ] `npm run build` succeeds locally with no errors
- **Verify:** Push to `site-remake` triggers workflow; site is live at neildaftary.com

---

## Verification Checklist (End-to-End)
- [ ] Home feed matches stitch design; 8 posts per page; pagination links work
- [ ] All 14 tag pages render correct filtered posts
- [ ] Individual text post and photo post pages render correctly
- [ ] `^(footnote)` syntax renders inline hover tooltip; keyboard accessible
- [ ] About, Favorites, Currently, Setup pages match stitch designs
- [ ] `npm run build` produces `dist/` with `CNAME` file
- [ ] GitHub Actions deploys successfully to neildaftary.com
