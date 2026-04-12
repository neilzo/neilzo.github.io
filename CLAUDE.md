# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at localhost:4321
npm run build     # static build to dist/
npm run preview   # preview the built site
```

No linter or test runner is configured.

## Stack

- **Astro v5** — static output (`output: 'static'`), MDX via `@astrojs/mdx`
- **Tailwind CSS v4** — CSS-first config via `@theme` in `src/styles/global.css`; no `tailwind.config.js`. Use `@tailwindcss/vite` plugin, not the Astro integration.
- **Deployment** — GitHub Actions on push to `site-remake` or `main`, deploys to GitHub Pages at `neildaftary.com`

## Content Collections

Defined in `src/content.config.ts`. Four collections:

### `posts`
Discriminated union on `template`:
- `text` — standard blog post with MDX body
- `photos` — requires `images[]` array (with `src`, `alt`, optional `caption`/`plateLabel`), optional `camera` and `location`
- `review` — **no MDX body, no individual page**. Requires `rating` (0–5) and `excerpt` (used as the full review text). Excluded from `getStaticPaths` in `src/pages/posts/[slug].astro`.

Shared fields: `title`, `date`, `tags` (from the 14-tag enum), `draft`, optional `excerpt`, optional `entryNumber`.

### `setup`
Single file at `src/content/setup/index.mdx`. Schema: `title`, `subtitle`. Rendered by `src/pages/setup.astro` using `getEntry('setup', 'index')`.

### `pages-special`
MDX files for Favorites and Currently pages. Schema: `title`, `subtitle`, `sectionLabel`, `pageKey` (enum: `favorites | currently | setup`), optional `updatedDate`.

### `about`
Single MDX at `src/content/about/index.mdx`. Schema: `tagline`, optional `links[]`, optional `updatedDate`.

## Entry Numbers

Entry numbers are auto-generated — do **not** set `entryNumber` in frontmatter unless you want to override. `src/utils/computeEntryNumbers.ts` sorts all posts oldest-first and assigns `001`, `002`, `003`… by date. The number is passed from pages → card components → `PostMeta`.

Post sort order in the feed is newest-first (handled in `src/utils/getAllPosts.ts`).

## Design System

**"The Ordered Archive"** — geometric minimalism.

- **Colors** (defined as CSS vars in `src/styles/global.css`): primary `#173124`, secondary `#A65D46`, surface `#fbf9f4`
- **Fonts**: `--font-headline` → Manrope (loaded via Google Fonts in `BaseLayout`), `--font-body` → Newsreader serif, `--font-label` → Manrope
- **Border radius**: globally `0px` — all `--radius-*` vars are `0px` (except `--radius-full: 9999px`)
- **Font sizes**: all `font-size` values must resolve to whole-number pixels (rem × 16 = integer). Common values: `0.625rem` (10px), `0.75rem` (12px), `0.875rem` (14px), `1rem` (16px), `1.25rem` (20px), `1.5rem` (24px), `2rem` (32px).

## Footnote Syntax

In MDX post bodies, use `^(footnote text)` to render an inline hover tooltip. Implemented as a remark plugin at `src/plugins/remark-footnote-tooltip.mjs`. Escape with `\^(...)` to render literal text.

## Component Patterns

- **PostCard / PostCardPhoto / PostCardReview** — feed card components. All accept `post` and `entryNum?: string`; pass `entryNum` down to `PostMeta`.
- **SpecialPageLayout** — used by About, Favorites, Currently, and Setup pages. Takes `title`, `subtitle`, `sectionLabel`, `updatedDate`, `activeNav`.
- **SetupCategory / SetupItem** — used directly in `src/content/setup/index.mdx` as JSX components. `SetupItem` props: `name`, `url?`, `description?`, `acquired?`.
- **Tag routing** — 14 tags defined in `src/utils/getPostsByTag.ts` as `ALL_TAGS`. Tags use slug format in URLs (e.g. `Tech Industry` → `/tags/tech-industry`).
