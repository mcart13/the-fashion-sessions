# Repository Guidelines

## Project Structure & Module Organization
This repository is a static-first Next.js 14 App Router site aimed at pixel parity with the original Fashion Sessions blog. Route files live in `app/` and include the homepage, category pages, contact/about pages, feed and SEO routes (`feed`, `feed.xml`, `sitemap.ts`, `robots.ts`), the contact API route, and `app/[...slug]/page.tsx` for migrated blog posts rendered from local content data. Reusable UI lives in `components/` (`Header`, `Footer`, `Sidebar`, newsletter and scroll helpers, post/archive helpers, and embed wrappers). Content and metadata helpers live in `data/` and `lib/`. Static assets live in `public/images`, `public/fonts`, and `public/videos`. Root config files include `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`, `.eslintrc.json`, and `tsconfig.json`.

## Build, Test, and Development Commands
- `npm install`: install dependencies; keep `package-lock.json` in sync.
- `npm run dev`: start the local dev server on `http://localhost:3000`.
- `npm run build`: create a production build and catch routing/type issues.
- `npm run start`: serve the production build locally.
- `npm run lint`: run the Next.js ESLint ruleset.

There is no automated test script yet, so `lint` and `build` are the required pre-PR checks.

## Coding Style & Naming Conventions
Use TypeScript with functional React components. Match the existing style: 2-space indentation, double quotes, semicolons, and concise component files. Name components in PascalCase (`NewsletterPopup.tsx`); keep route folders lowercase and URL-shaped (`shop-my-instagram`, `about`, `travel`). Prefer `@/*` imports over long relative paths. Keep styling in Tailwind utilities and shared theme tokens from `tailwind.config.ts` and `app/globals.css`; avoid introducing new one-off design values unless the page truly needs them.

## Testing Guidelines
Because no test framework is configured, verify changes with `npm run lint` and `npm run build`. For visual changes, manually check the affected route on desktop and mobile. If you add tests, place them beside the source as `*.test.ts` or `*.test.tsx`, add the script to `package.json`, and document how to run it here.

## Commit & Pull Request Guidelines
Recent commits use short, imperative subjects and often scope the change, for example: `Pixel parity fixes: header layout, hero, typography, contact page`. Keep commits focused by route or component area. Pull requests should summarize changed pages/components, link the relevant issue when available, include before/after screenshots for UI updates, and note the results of `npm run lint` and `npm run build`. The repo currently targets `main` and does not include a PR template.

## Architecture Notes
Keep the app static unless the task explicitly adds a data layer. The site is driven by local JSON/content helpers, not a CMS or database. The current codebase includes a small API surface for the contact form, but no server actions, CMS integrations, or database dependencies.
