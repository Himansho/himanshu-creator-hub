# PRD — Himanshu's Creator Hub

**Product:** Personal "Dual-Mode Creator Hub" (public portfolio + private admin dashboard)
**Owner:** Himanshu Bartwal
**Author:** Claude (drafted from planning conversation)
**Date:** 2026-07-31
**Version:** 1.1 (revised after multi-agent review — see Revision History at the end)
**Project folder:** `D:\CLAUDE PROJECTS\himanshu-creator-hub`

> **How to read this document:** Sections 1–8 and 13–19 are written for you, Himanshu. Sections 9–12 are technical instructions for the AI that builds the code — you can safely skip them. Any word you don't know is probably in the Glossary (§19).

---

## 1. Vision

One website. One URL. Two faces.

- To the **world** (recruiters, visitors, collaborators): a polished portfolio that shows only Himanshu's finished, published projects — proof that he is a serious creator who ships real things.
- To **Himanshu** (after login): a private command center where every project lives — drafts, half-built experiments, notes, and published work — all manageable with buttons, never with code.

The bridge between the two worlds is a single **Publish / Unpublish** toggle. Click it, and a project appears on (or disappears from) the public site within seconds. No redeploying, no editing files, no coding.

## 2. Background & Context

Himanshu is a beginner who does not write code. He builds using AI tools (Claude, other models) and no-code/AI-assisted workflows. This project must therefore satisfy two hard constraints:

1. **Zero coding for day-to-day use.** After the site is deployed once, every routine action (add project, publish, change avatar, edit bio) happens through the website's own dashboard.
2. **AI-buildable.** The codebase must use mainstream, well-documented technologies that AI assistants generate reliably, so Himanshu can extend the site later by asking an AI for help.

Cost constraint: **$0 to launch and run** at personal-portfolio scale.

## 3. Goals & Success Criteria

| # | Goal | How we measure it |
|---|------|-------------------|
| G1 | Site is live on the internet | Reachable at a `*.vercel.app` URL (custom domain optional later) |
| G2 | Public site shows only published work | A visitor can never see drafts, notes, or admin controls |
| G3 | Himanshu manages everything without code | He can add a project, upload a screenshot, and publish it in under 5 minutes using only the dashboard |
| G4 | Profile is self-editable | Avatar, name, tagline, bio, and social links are all changeable from Settings |
| G5 | Free to run | $0/month on Vercel Hobby + Supabase Free + GitHub Free |
| G6 | Feels professional | Dark, sleek design; smooth animations; works well on phone and desktop; Lighthouse performance/accessibility scores ≥ 90 on the public pages (Lighthouse = Google's free report card for websites — see Glossary) |

## 4. Non-Goals (for Version 1)

These are explicitly **out of scope** for the first version. They can come later (see §15 Future Ideas):

- Blog / writing section
- Resume/CV download
- Testimonials
- Contact **form** with a backend (v1 uses a simple email link)
- Multiple languages (English only)
- Multiple admin users (this is a single-user system: only Himanshu)
- Custom domain (works on the free `.vercel.app` domain first; custom domain is a later, optional step)
- Analytics dashboards built into the site (v1 does enable Vercel's built-in free analytics — see M6 — but we don't build any custom analytics UI)
- Manual drag-and-drop reordering of projects (v1 orders by Featured flag, then newest first; a reorder UI is v2)
- PWA/offline install

## 5. Users & Personas

### Persona A — "The Visitor" (recruiter, collaborator, curious stranger)
- Arrives via a link Himanshu shared.
- Wants to quickly answer: *Who is this person? What have they built? Is it real? How do I contact them?*
- Spends 1–3 minutes. Mostly on a phone or laptop.
- Must **never** see: login buttons (beyond a subtle icon), drafts, private notes, or any admin UI.

### Persona B — "The Admin" (Himanshu)
- Visits his own site to manage projects and profile.
- Not a coder; expects the dashboard to feel like a simple app (forms, buttons, toggles).
- Common jobs: add a new project as a draft, finish it later, publish it, swap a screenshot, change avatar, unpublish something old.

## 6. User Stories

### Public site
- **US-1:** As a visitor, I see Himanshu's name, tagline, and animated avatar immediately on the landing page, so I know whose site this is.
- **US-2:** As a visitor, I can browse a grid of published projects, each showing an image, title, short description, and tech-stack tags.
- **US-3:** As a visitor, I can open a project's **Live Demo** link and **View Code** link (when provided) in a new tab.
- **US-4:** As a visitor, I can read a short About section and find Himanshu's email and social links.
- **US-5:** As a visitor on a phone, everything is readable and tappable without zooming.
- **US-6:** As a visitor when zero projects are published yet, I still see a complete, polished page — the work section shows a tasteful "New projects coming soon ✨" card instead of an empty hole.

### Authentication
- **US-7:** As the admin, I can log in through a login page reached via a subtle lock icon (or by typing `/login` directly).
- **US-8:** As the admin, I stay logged in across visits; my session refreshes automatically until I log out.
- **US-9:** As anyone who is *not* logged in, visiting any `/dashboard` URL redirects me to the login page.
- **US-10:** Nobody can create a new account. Sign-ups are disabled; the single admin account is created once, manually, in Supabase.
- **US-11:** As the admin, if I forget my password, I can click "Forgot password?" on the login page, receive a reset email, and set a new password on the site.

### Dashboard — projects
- **US-12:** As the admin, I see a stats bar: total projects, drafts, in progress, published.
- **US-13:** As the admin, I see ALL projects (any status) with a clear status badge (🟡 Draft / 🔵 In Progress / 🟢 Published). If I have zero projects, I see a big friendly "Add your first project" button.
- **US-14:** As the admin, I can create a project with: title, short summary, longer description, tech-stack tags, cover image upload, live-demo URL, code URL, private notes, and progress %.
- **US-15:** As the admin, I can edit any field of any project and save.
- **US-16:** As the admin, I can toggle Publish/Unpublish with one click, and the public site reflects it within seconds (the app refreshes the public pages automatically on publish — see §12).
- **US-17:** As the admin, I can delete a project (with an "Are you sure?" confirmation).
- **US-18:** As the admin, I can keep messy, unfinished ideas as drafts forever; they are never visible publicly.
- **US-19:** As the admin, I can mark projects as **Featured** so the best ones appear first publicly (ordering: featured first, then newest published first).

### Dashboard — profile settings
- **US-20:** As the admin, I can upload/change my avatar image (PNG/JPG/WebP/GIF — animated GIF supported) at any time.
- **US-21:** As the admin, I can edit my display name, tagline, bio, display email, and social links.
- **US-22:** As the admin, changes to my profile appear on the public site within seconds of saving.

## 7. Functional Requirements

### 7.1 Public site (no login required)

| ID | Requirement |
|----|-------------|
| F-1 | Landing page: name, headline ("Creator"), tagline, animated avatar, primary call-to-action ("See my work"), subtle entrance animations. |
| F-2 | Work/Projects section: responsive card grid of projects where `status = published`, ordered by **featured first, then newest `published_at` first**. Each card: cover image (or a styled placeholder if none was uploaded), title, summary, tech tags, demo + code links (links hidden if not provided). |
| F-3 | Empty state: with zero published projects, the work section renders a designed "New projects coming soon ✨" card; hero, About, and Contact still render fully. |
| F-4 | About section: bio text, avatar, skill/tech tags, social links. |
| F-5 | Contact section: display email as a clickable email link (`mailto:`) + social icons (icons appear only for links that are filled in). |
| F-6 | Navigation: Work · About · Contact, plus a small, subtle lock icon linking to `/login`. No "Dashboard" link visible when logged out. |
| F-7 | The public pages must never query or render: draft/in-progress projects, `private_notes`, or progress %. (Enforced structurally — see §9 views and §10.) |
| F-8 | SEO basics: page titles, meta description, Open Graph tags (so the link previews nicely on WhatsApp/LinkedIn), favicon. |
| F-9 | If the database is temporarily unreachable (e.g., Supabase paused), the public site serves the last cached version of the pages instead of an error, wherever possible. |

### 7.2 Authentication

| ID | Requirement |
|----|-------------|
| F-10 | Email + password login via Supabase Auth. |
| F-11 | Public sign-up is disabled in Supabase settings; the admin account is created manually once in the Supabase dashboard. |
| F-12 | All `/dashboard/*` routes are protected: unauthenticated users are redirected to `/login`. Protection is enforced both in middleware (for redirect UX) and again next to the data (see §12 — middleware alone is not trusted). |
| F-13 | "Forgot password?" link on `/login` → Supabase sends a reset email → `/reset-password` page lets the admin set a new password. |
| F-14 | Sessions auto-refresh via middleware. If a save ever fails because the session expired, the dashboard shows a plain-language "Please log in again" message and **keeps the form content on screen** — typed work is never silently lost. |
| F-15 | Logout button in the dashboard nav. |
| F-16 | Friendly error message on wrong password (no technical jargon). |

### 7.3 Dashboard

| ID | Requirement |
|----|-------------|
| F-17 | Dashboard home: stats (total / drafts / in-progress / published) + full project list with status badges + empty state ("Add your first project") when there are none. |
| F-18 | Full project CRUD (Create, Read, Update, Delete) via forms — no code editing ever required. |
| F-19 | Image upload for project covers (Supabase Storage) with preview before saving. Every upload goes to a **new unique file path** (timestamped name) and the old file is deleted — this guarantees the new image shows immediately instead of a stale cached one. |
| F-20 | One-click status toggle: Draft ↔ Published (In Progress selectable in the edit form). First publish sets `published_at`. Publishing immediately refreshes the public pages (see §12). |
| F-21 | Delete requires a confirmation dialog. |
| F-22 | "Preview" link on each project opens the public view so Himanshu sees exactly what a visitor sees. |
| F-23 | Settings page: edit profile fields + avatar upload with instant preview (same unique-path upload rule as F-19). |
| F-24 | All dashboard actions show clear success/error feedback (toast messages in plain language). Database errors are translated to friendly text — raw error codes are never shown. |

### 7.4 Form validation rules

| Field | Rule |
|-------|------|
| Title | Required, max 80 characters |
| Summary | Optional, max 160 characters (card text) |
| Description | Optional, long text |
| Demo / Code URLs | Optional; must be valid links (`https://` auto-added if missing) |
| Tech-stack tags | Entered as chips (type + Enter or comma); each tag max 20 chars |
| Progress | 0–100 only (slider or number input, clamped) |
| Avatar image | PNG/JPG/WebP/GIF, max 2 MB |
| Cover image | PNG/JPG/WebP/GIF, max 5 MB, recommended ~1200×630 px |
| Publishing | Allowed even without image/links (placeholder cover is rendered); the UI gently notes what's missing before publish |

Oversized, unsupported, or failed uploads show a clear plain-language error (e.g., "This image is too big — please use one under 5 MB") and never leave the form in a broken state.

### 7.5 The animated avatar

| ID | Requirement |
|----|-------------|
| F-25 | Ships with a default cool animated avatar (an animated SVG/CSS illustration with a subtle floating/glow animation) so the site looks good on day one. |
| F-26 | Admin can replace it anytime from Settings by uploading an image (animated GIF allowed for animation). |
| F-27 | Avatar renders on: landing page, About section, and dashboard header. |

## 8. Page Map

```
PUBLIC (anyone)
├── /                Landing: hero (name, tagline, avatar) + featured work + about + contact
│                    (v1 is a polished single-page scroll; sections have anchor links)
├── /work            Full project grid (all published projects)
├── /login           Admin login (reached via subtle lock icon or direct URL)
└── /reset-password  Set a new password (landing page for the reset email)

PRIVATE (login required)
├── /dashboard                     Stats + all-projects list
├── /dashboard/projects/new        Create project form
├── /dashboard/projects/[id]/edit  Edit project form
└── /dashboard/settings            Profile + avatar management
```

Note: v1 keeps the public site as one elegant scrolling page plus a dedicated `/work` grid. Individual project detail pages (`/work/[slug]`) are a v1.1 candidate.

---

> **Sections 9–12 are technical build instructions for the AI.** Himanshu: feel free to skip to §13.

## 9. Data Model (Supabase / Postgres)

### Table: `profiles` (single row — the admin's profile)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid, PK | References `auth.users.id` |
| `full_name` | text | "Himanshu Bartwal" |
| `headline` | text | "Creator" |
| `tagline` | text | "I build things which solve real problems" |
| `bio` | text | About-section text |
| `display_email` | text | "Himanshubartwal2022@gmail.com" |
| `avatar_url` | text | Points to Supabase Storage |
| `social_links` | jsonb | `{ "github": "...", "linkedin": "...", "twitter": "..." }` |
| `updated_at` | timestamptz | Auto-updated by trigger |

**Profile row creation:** a database trigger on `auth.users` INSERT auto-creates the `profiles` row pre-filled with Himanshu's defaults (name, headline, tagline, email). This makes setup order-proof: the SQL script runs first, then creating the admin user automatically creates his profile. Public pages must also tolerate a missing profile row (render defaults, never crash on `.single()`).

### Table: `projects`
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid, PK | `gen_random_uuid()` |
| `title` | text NOT NULL | Max length enforced in UI |
| `slug` | text UNIQUE NOT NULL | Slugified from title at creation; on collision append `-2`, `-3`, …; **frozen after creation** (title edits don't change it) |
| `summary` | text | Short card description |
| `description` | text | Longer write-up |
| `tech_stack` | text[] | e.g. `{Next.js, Tailwind, Supabase}` |
| `status` | text NOT NULL DEFAULT 'draft' | `CHECK (status IN ('draft','in_progress','published'))` |
| `cover_image_url` | text | Supabase Storage URL |
| `demo_url` / `repo_url` | text | |
| `private_notes` | text | **Never rendered publicly** |
| `progress` | int DEFAULT 0 | `CHECK (progress BETWEEN 0 AND 100)` |
| `featured` | boolean DEFAULT false | Featured projects appear first |
| `sort_order` | int DEFAULT 0 | Kept in schema for a future reorder UI (no UI in v1) |
| `created_at` / `updated_at` | timestamptz | `updated_at` maintained by trigger |
| `published_at` | timestamptz | Trigger sets it only when NULL on transition to `published` (so republishing keeps the original date) |

### Public read views
- **`public_projects`** — exposes only public-safe columns (`id, title, slug, summary, description, tech_stack, cover_image_url, demo_url, repo_url, featured, published_at`) filtered to `status = 'published'`.
- **`public_profile`** — exposes only public-safe profile columns (`full_name, headline, tagline, bio, display_email, avatar_url, social_links`).

The public site queries **only these views**, making it structurally impossible to leak `private_notes`, `progress`, or drafts. (RLS is row-level, not column-level — the views are what give us column-level control.)

### Storage buckets
| Bucket | Access | Purpose |
|--------|--------|---------|
| `avatars` | Public read; write/delete admin-only | Profile pictures |
| `project-images` | Public read; write/delete admin-only | Project cover images |

Uploads always use a fresh unique object path (e.g., `cover-{timestamp}.webp`) and delete the replaced object — Supabase Storage's CDN caches aggressively, so overwriting a path in place would show stale images.

## 10. Security & Privacy Requirements

| ID | Requirement |
|----|-------------|
| S-1 | **RLS enabled on all tables with NO anon policies at all.** Anonymous read access exists *only* through the `public_projects` / `public_profile` views: the views are created with default (owner-rights) semantics and `GRANT SELECT` to `anon`; the base tables have no anon grant. Note: Supabase's linter will flag these as "security definer views" — this is expected and acceptable here; document it in the SQL script comments. |
| S-2 | **All write policies check the admin's identity explicitly** — `auth.uid() = (SELECT id FROM profiles LIMIT 1)` — not merely "any authenticated user". This way, even if an auth provider were ever accidentally enabled, strangers still could not write. The same check applies to Storage write/delete policies. |
| S-3 | Sign-ups disabled in Supabase Auth settings (Authentication → Sign In/Providers → "Allow new users to sign up" off) → only the manually-created admin account can ever log in. |
| S-4 | Secrets (`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) live in Vercel Environment Variables (and `.env.local` for local dev) — never committed to GitHub. `.gitignore` ships pre-configured to exclude `.env*`. The repo may be public without risk because the **publishable key** (`sb_publishable_…` — Supabase's current name for what older docs call the "anon key"; legacy anon JWT keys are deprecated end of 2026) is designed to be public-safe *when RLS is on* (which S-1 guarantees). |
| S-5 | The Supabase `secret`/`service_role` key is **never** used in this project (not needed; it bypasses RLS). |
| S-6 | Authenticated pages are never CDN-cached: middleware applies the no-cache headers Supabase's SSR helper provides, and the middleware matcher skips static assets. |
| S-7 | No passwords, keys, or credentials are ever shared with AI assistants. AI writes code; Himanshu handles all logins himself. |

## 11. Design Requirements

**Vibe (default, pending Himanshu's final confirmation):** Dark & sleek — "Apple's website had a baby with a developer's terminal" *(meaning: premium and minimal, with a dark, techy feel)*.

| Aspect | Specification |
|--------|---------------|
| Theme | Dark mode default. Deep charcoal/navy background (not pure black), e.g. `#0B0F14` family. |
| Accent | **One** signature color. Default: warm amber/gold. (Open question — see §14.) |
| Cards | Subtle glassmorphism (slightly see-through "frosted glass" look): translucent fill, soft border, gentle lift on hover. |
| Typography | Clean modern sans-serif (Inter or Geist). Large confident headings, comfortable reading sizes. |
| Animation | Medium level: fade/slide-in on scroll, hover lifts, smooth page transitions, gently animated avatar. No heavy 3D/particles in v1. Respect `prefers-reduced-motion`. |
| Responsive | Mobile-first. Grid collapses 3 → 2 → 1 columns. Nav becomes a mobile menu. |
| Accessibility | WCAG AA color contrast, keyboard navigable, alt text on images, visible focus states. |
| Feel | Fast. No loading spinners on the public site (content is server-rendered). |

## 12. Technical Architecture

### Stack (all free)
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16 (App Router, React)** — current stable | One codebase serves both the public site and the dashboard; server components keep the public site fast; best-in-class Vercel support; AI assistants generate it reliably. |
| Styling | **Tailwind CSS** | Fast to build, easy for AI to write, easy for Himanshu to tweak. |
| Animation | **Framer Motion** (or CSS transitions where enough) | Simple declarative animations. |
| Backend | **Supabase** (Free plan) | Postgres + Auth + Storage in one dashboard. Free tier: 500 MB database, 1 GB file storage, 50,000 monthly auth users (as of July 2026). |
| Auth integration | **`@supabase/ssr`** | The officially recommended package (the old `auth-helpers` packages are deprecated). |
| Hosting | **Vercel** (Hobby plan) | Free for personal, non-commercial use; auto-deploys from GitHub; 100 GB bandwidth/month. |
| Code storage | **GitHub** (free) | Vercel watches the repo; every push auto-deploys. |
| Analytics | **Vercel Web Analytics** (free tier, 50k events/mo) | One toggle + one component; no custom UI built. |

### Auth implementation notes (per current Supabase docs)
- Two clients: `lib/supabase/client.ts` (`createBrowserClient`, Client Components) and `lib/supabase/server.ts` (`createServerClient`, created fresh per request — never stored in a global).
- Middleware refreshes session tokens and handles the redirect-to-`/login` UX; the matcher skips `_next`/static assets.
- **Middleware is not trusted for security** (cookies can be spoofed): every `/dashboard` server component / server action re-verifies auth next to the data using `getClaims()` (or `getUser()`); **never** `getSession()` in server code.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

### Publish-is-instant: the caching contract
Next.js would otherwise statically prerender the public pages at build time and never show new projects without a redeploy. To make Publish work as promised:
- Public pages (`/`, `/work`) set `export const revalidate = 3600` (hourly background refresh as a safety net, and F-9's stale-if-down behavior).
- Every dashboard server action that changes public content (publish/unpublish/save project, save profile) calls `revalidatePath('/')` and `revalidatePath('/work')` — this is what makes changes appear within seconds.
- After toggling, the dashboard calls `router.refresh()` so the admin's own view updates too.

### How data flows
```
Visitor ──▶ Vercel (server components) ──▶ views public_projects / public_profile ──▶ published content only
Admin ──▶ /login (Supabase Auth, cookie session) ──▶ /dashboard ──▶ CRUD via server actions (RLS + admin-check)
Publish toggle ──▶ status update ──▶ revalidatePath('/', '/work') ──▶ public site updates in seconds
```

---

## 13. Setup & Deployment Plan (Division of Labor)

A core agreement from planning: **AI cannot access Himanshu's accounts, browser, or passwords.** AI writes 100% of the code and instructions; Himanshu performs the account steps himself.

**Good news: there is nothing to install on your PC.** Every step below happens in the web browser. (You do *not* need to run the code on your own computer — Vercel builds and runs it for you.)

| Step | What happens | Who | Est. time |
|------|--------------|-----|-----------|
| 1 | Generate the complete codebase in `D:\CLAUDE PROJECTS\himanshu-creator-hub` | Claude | — |
| 2 | Create free GitHub account → create a repository → upload the project using GitHub's web **"upload files"** page (drag-and-drop the folder contents — no Git software needed) | Himanshu (guided) | 15 min |
| 3 | Create free Supabase account + new project | Himanshu | 5 min |
| 4 | Copy-paste the provided `supabase-setup.sql` into Supabase's SQL Editor and click Run (creates tables, triggers, views, security policies, storage buckets) | Himanshu | 5 min |
| 5 | In Supabase: Authentication → turn OFF "Allow new users to sign up"; then Authentication → Users → **Add user** (your email + a password you choose). This automatically creates your profile too. | Himanshu (guided clicks) | 3 min |
| 6 | Copy 2 values from Supabase (Project URL + **publishable key** — Settings → API Keys) | Himanshu | 2 min |
| 7 | Create free Vercel account (Hobby) → "Add New Project" → Import your GitHub repo → paste the 2 values as Environment Variables → Deploy | Himanshu | 10 min |
| 8 | Open your live URL → log in → upload avatar → add your first project → hit **Publish** 🎉 | Himanshu | 5 min |

> **About the time estimates:** they assume everything goes smoothly. Your first time, expect it to take 2–3× longer — that is completely normal, not a sign that anything is wrong. You can stop after any step and continue later. If anything looks stuck, copy the error message (or a screenshot) to Claude and we'll fix it together.

Deliverables shipped with the code to make this foolproof:
- `README.md` — numbered step-by-step setup checklist with exact links and exact click paths (screenshots described)
- `supabase-setup.sql` — one copy-paste script for the entire database (with comments explaining each part)
- `.env.local.example` — for AI/local development only; **Himanshu can ignore it** (the keys go straight into Vercel in step 7)
- `.github/workflows/keep-alive.yml` — a free scheduled GitHub Action that pings the site every 3 days so the Supabase free project never pauses from inactivity
- Troubleshooting section — the most likely beginner mistakes and their fixes

## 14. Open Questions (defaults will be used unless Himanshu decides otherwise)

| # | Question | Default if unanswered |
|---|----------|----------------------|
| Q1 | Accent color? | Warm amber/gold on dark |
| Q2 | Animation level — subtle / medium / heavy? | Medium |
| Q3 | Existing projects to load at launch? | 3 tasteful placeholder projects marked as drafts, easy to edit/delete (public site shows the designed "coming soon" state until something is published) |
| Q4 | Social links (GitHub, LinkedIn, X, others)? | Icons hidden until links are added in Settings |
| Q5 | Show location publicly? | Not shown |
| Q6 | Skills section as its own block? | Skills shown as tags inside About |

## 15. Future Ideas (v2 backlog — explicitly not in v1)

- Project detail pages (`/work/[slug]`) with galleries and long write-ups
- Blog / digital-garden section
- Resume PDF upload + download button
- Contact form with spam protection
- Custom domain (e.g., `himanshu.dev`)
- Manual drag-and-drop project reordering (schema is already prepared via `sort_order`)
- Tags/categories and filtering on the work grid
- PWA install support
- Testimonials
- Light-mode toggle

## 16. Milestones

Deployment happens **early** (M2), not at the end — so every later milestone is verifiable at a live URL, and the riskiest part (account setup) is de-risked in week one instead of launch day.

| Phase | Deliverable | Definition of done |
|-------|-------------|--------------------|
| **M0 — PRD sign-off** | This document reviewed by Himanshu | He says "build it" (and answers any open questions he wants to) |
| **M1 — Skeleton** | Next.js + Tailwind app with all public pages using placeholder data | Claude verifies it builds and looks 80% designed |
| **M2 — Go live early** | Accounts created (GitHub, Vercel) + skeleton deployed | Himanshu completes setup steps 2 and 7 (without Supabase yet); the placeholder site is live at his `.vercel.app` URL |
| **M3 — Database & auth** | Supabase project + SQL script + login flow + protected routes (setup steps 3–6) | Login works at the live URL; `/dashboard` redirects when logged out; sign-up impossible; forgot-password works |
| **M4 — Dashboard** | Full project CRUD + publish toggle + image uploads + validation + empty states | Himanshu can manage projects end-to-end with zero code; publish appears publicly within seconds |
| **M5 — Profile & avatar** | Settings page + avatar upload + default animated avatar | Avatar/profile changes propagate to the public site |
| **M6 — Polish** | Animations, SEO/OG tags, responsive QA, accessibility pass, Vercel Analytics toggle, keep-alive Action | Lighthouse ≥ 90; looks great on a phone |
| **M7 — Launch** | Real content in, placeholders out | First real project published; URL shared |

## 17. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase free project **pauses after ~1 week of low activity** (warning email sent first; no auto-resume — paused projects stay restorable for up to 1 year) | Public site loses its data source exactly when a surprise visitor arrives | **v1 ships a scheduled GitHub Actions keep-alive ping (every 3 days, free)** so this shouldn't happen at all; public pages also serve their last cached version if the DB is briefly down (F-9); README documents the 2-click manual resume as last resort |
| Vercel Hobby plan is for **non-commercial personal use only** | Account issues if the site becomes commercial | A personal portfolio showcasing work is explicitly fine. If the site later sells services, runs ads, or is built for paying clients, upgrade to Pro ($20/month). Documented in README. |
| Beginner setup friction (accounts, keys) | Project stalls before launch | Nothing to install (browser-only path, GitHub web upload); deploy moved early to M2; ultra-detailed README; each step independently verifiable; Claude troubleshoots from screenshots/error messages |
| Secrets accidentally committed | Key exposure | `.gitignore` ships pre-configured; README warns explicitly; only the public-safe publishable key is used anyway (RLS enforced) |
| Free-tier limits change over time | Unexpected cost pressure | All limits stated in docs marked "as of July 2026 — check current pricing pages"; architecture has no hard dependency on any specific limit |
| Scope creep before launch | Never ships | §4 Non-Goals is the contract; v2 ideas go to §15 backlog |

## 18. Acceptance Criteria (v1 is "done" when all pass — each with a non-coder way to verify)

| # | Criterion | How Himanshu verifies it |
|---|-----------|--------------------------|
| 1 | Public site shows hero (name/tagline/animated avatar), published projects (or the "coming soon" state), about, contact — and no admin UI or draft content | Open the live URL in a private/incognito window and look |
| 2 | `/dashboard` requires login | In incognito, type `/dashboard` after the URL → lands on the login page |
| 3 | Login works; wrong password shows a friendly error | Try both on the login page |
| 4 | Creating a new account is impossible | Supabase dashboard → Authentication → Sign In/Providers shows "Allow new users to sign up" is OFF (and the site has no sign-up page) |
| 5 | A draft project with an uploaded image does NOT appear publicly | Create one, then check the public site in incognito |
| 6 | Publish makes it appear publicly within seconds; Unpublish removes it | Toggle and refresh the public page |
| 7 | Edit and delete work; delete asks for confirmation | Try them |
| 8 | Avatar and tagline changes in Settings show on the public site | Change them, refresh the public page |
| 9 | Forgot-password flow delivers an email and lets you set a new password | Click "Forgot password?" and follow it |
| 10 | Fully usable on a phone | Open the URL on your phone |
| 11 | $0/month | GitHub plan page shows Free; Vercel shows Hobby; Supabase shows Free |
| 12 | Lighthouse ≥ 90 on public pages | Paste the URL into pagespeed.web.dev and read the scores |

## 19. Glossary (plain-language)

| Term | Meaning |
|------|---------|
| **Repo(sitory)** | A folder for your code stored on GitHub |
| **Push / Upload** | Sending your code folder to GitHub (we use GitHub's drag-and-drop upload page) |
| **Deploy** | Putting your website live on the internet |
| **Environment variable** | A secret setting (like a key) stored outside the code |
| **Database** | Organized storage for your data (your projects list) |
| **SQL / SQL script** | The language databases speak; the script is a ready-made text you paste once to set everything up |
| **Auth** | The login system |
| **RLS (Row Level Security)** | Database rules deciding who may read/write which rows |
| **CRUD** | Create, Read, Update, Delete — the four basic data actions |
| **Middleware** | Code that runs before a page loads — like a security guard at a club door checking who may enter |
| **Publishable key** | Supabase's public-safe key your website uses to talk to the database (older name: "anon key") |
| **View (database)** | A saved, filtered "window" onto a table — here, the published-only window |
| **Slug** | The short web-address version of a title (e.g., "My Cool App" → `my-cool-app`) |
| **Open Graph tags** | Hidden info that makes your link show a nice title + image when shared on WhatsApp/LinkedIn |
| **Lighthouse** | Google's free report card that scores how fast and accessible a website is (out of 100) |
| **Glassmorphism** | A design style where cards look like frosted glass — slightly see-through with soft blur |
| **mailto: link** | An email address link that opens the visitor's mail app when clicked |
| **GitHub Action** | A small robot task GitHub runs for you on a schedule (here: pinging the site so it never sleeps) |

## 20. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-31 | First draft from planning conversation |
| 1.1 | 2026-07-31 | Revised after a 6-agent review (fact-checkers + 4 critics). Key changes: corrected Supabase free storage (1 GB) and key naming (publishable key); added Vercel non-commercial note; defined empty states, form validation, image limits, forgot-password flow, and session-expiry behavior; specified profile auto-creation trigger, view security semantics, admin-scoped write policies, unique-path uploads, and the publish→revalidatePath caching contract; moved deployment early (M2) with a browser-only, nothing-to-install setup path; added keep-alive GitHub Action and Vercel Analytics to v1; cut manual reordering to v2; made every acceptance criterion verifiable by a non-coder; expanded glossary. |
