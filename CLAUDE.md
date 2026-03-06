# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start dev server at localhost:3000
- `npm run build` - Production build
- `npm run lint` - ESLint check
- `npm run parity:homepage` - Homepage visual parity script
- No test framework is configured.

## What This Is

A 1:1 recreation of thefashionsessions.com (Tracy's WordPress fashion/lifestyle blog) as a static Next.js 14 site. The goal is pixel parity with the original WordPress + Astra + Elementor site. Deployed to Vercel at the-fashion-sessions.vercel.app.

Most pages are static and driven from local content data (`data/site-content.json`) with no CMS or database. Blog post URLs from the old WordPress site are caught by `app/[...slug]/page.tsx`, which renders full article pages from the local content snapshot.

## Architecture

**Next.js 14 App Router** with TypeScript and Tailwind CSS. Static-first architecture with local content helpers, feed/SEO routes, and a small contact API route. No server actions, CMS, or dynamic database-backed data fetching.

`app/layout.tsx` wraps all pages with Header, Footer, NewsletterPopup (2s delay, sessionStorage key `newsletter-popup-shown`), and ScrollToTop. Google Fonts (Roboto, Roboto Slab, Poppins) are loaded via `next/font/google` as CSS variables.

## Font System

Two self-hosted fonts declared via `@font-face` in `globals.css`:

- **Butler** (`font-butler`) - Serif display font for large headings. Weight 200 (extralight) maps to Butler-Light.woff2, weight 600 maps to Butler-Bold.woff2. Most headings use `font-extralight` (weight 200).
- **Moontime** (`font-moontime`) - Script/cursive accent font for decorative text ("About", "shop my favorites", "Hi!", "follow along").

Three Google Fonts loaded in layout.tsx as CSS variable classes:

- **Roboto** (`font-roboto`) - Body text default
- **Roboto Slab** (`font-roboto-slab`) - Occasional subheadings
- **Poppins** (`font-poppins`) - Nav links, labels, small-caps text, buttons

## Design Tokens (tailwind.config.ts)

Colors: `cream` (#F5F3ED), `tan` (#E6DDD9), `text-dark` (#282828), `heading-dark` (#282828), `accent-gold` (#BA9D95), `btn-cta` (#EADFD2).

Other key colors used inline: `#936740` (Moontime script headings), `#B98F67` (dividers), `#987B73` (Tracy signature).

## Key Conventions

- Nav links use `text-transform: uppercase` with `font-size: 11px` and `letter-spacing: 1.2px` (Poppins). The DOM text is Title Case but CSS uppercases it.
- Category archive pages (`/fashion`, `/beauty`, `/food`, `/travel`) have a hero section (cream bg, decorative heading, 50/50 image + white overlay) followed by a 73/27 post grid + Sidebar layout matching the WordPress category page style. The `CategoryArchivePage` component accepts optional hero props; the generic `/category/[slug]` route omits them and renders without a hero.
- The homepage blog section and shop-my-instagram page also use the 73/27 layout with the Sidebar component.
- Footer uses dark charcoal (#282828) background, not tan.
- All CTA buttons use `bg-[#EADFD2]` with `hover:bg-tan` transition.
- Link color throughout is #BA9D95, not blue. Links hover to #BA9D95 as well.
- Blog posts, categories, newsletter ids, and widget config are read from `data/site-content.json` through `lib/siteContent.ts`.
- `app/[...slug]/page.tsx` renders real article pages, including metadata/schema and HTML content hydration helpers for embedded scripts.
- Client components (`"use client"`) are used only where needed: Header, NewsletterPopup, ScrollToTop, ContactForm, AnimateOnScroll, ThirdPartyEmbeds, and HtmlContentScripts.
