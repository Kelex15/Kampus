# Kampus

A Next.js 14 (App Router) web app for university course discovery + course rooms (real-time chat + resources) backed by Supabase.

## What’s in here

- **Marketing site**: landing page at `/`
- **Auth**: email/password + OAuth callback route
- **Discover (Dashboard)**: course directory (optionally filtered by the logged-in user’s school)
- **Rooms**: a room per course code with real-time chat + a resources feed (links + file uploads)
- **Profile**: basic account/profile page
- **Admin**: in-app data seeding tools for schools/faculties/departments/professors/courses

## Tech stack

- **Next.js 14** (App Router, Server Actions)
- **React 18**
- **Supabase**
  - Auth (cookie-based session via `@supabase/ssr`)
  - Postgres (tables like `profiles`, `schools`, `courses`, `rooms`, `messages`, etc.)
  - Storage (bucket used for room resource uploads)
- **Tailwind CSS**
- **Framer Motion**

## Local development

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (used by the signout route redirect)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3) Run the dev server

```bash
npm run dev
```

App will be available at `http://localhost:3000`.

## Supabase setup notes

This repo assumes you already have a Supabase project with the expected tables and policies.

### Required env vars

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Auth + sessions

- The app uses `@supabase/ssr`.
- Browser session is stored in **cookies** (not localStorage), so middleware can protect routes.
- Middleware refreshes the Supabase session on requests and protects:
  - `/rooms/*`
  - `/profile`
  - `/admin` (requires `profiles.role = 'admin'`)

### Storage bucket

File uploads in room resources use a Supabase Storage bucket named:

- `room-resources`

The app calls `getPublicUrl()` after upload, so ensure your bucket/policies match your desired privacy model (public bucket or appropriate read policies).

## App routes (high level)

- `/` — marketing landing page
- `/login` — login form
- `/signup` — signup form
- `/dashboard` — course discovery ("Discover")
- `/profile` — profile page
- `/professors` — professor list + reviews
- `/rooms/[courseCode]/chat` — course room chat
- `/rooms/[courseCode]/resources` — redirects to chat (resources UI is surfaced inside the room shell)
- `/admin` — data import/seed tools (admin-only)

Auth helpers:
- `/auth/callback` — OAuth callback (exchanges code for session)
- `/auth/signout` — server signout route

## Admin seeding

The `/admin` page lets you paste/upload JSON arrays to seed core data.

Order of operations (recommended):

1. **Schools**
2. **Faculties**
3. **Departments**
4. **Professors**
5. **Courses**
6. **Descriptions** (optional)

To access `/admin`, your user must have a `profiles` row with:

- `role = 'admin'`

(You can set this directly in Supabase SQL editor or table UI.)

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production server
npm run lint     # run Next lint
```

## Project structure

- `app/` — Next.js App Router routes + layouts
  - `app/(marketing)` — public landing page
  - `app/(auth)` — login/signup pages
  - `app/(app)` — authenticated app pages (dashboard, rooms, profile, admin)
  - `app/actions/` — shared server actions (e.g. profile fetch)
  - `app/auth/*` — route handlers for auth callback/signout
- `components/` — UI components (Navbar, shells, forms)
- `hooks/` — client hooks (auth, messages, resources, professors)
- `lib/supabase/` — Supabase client helpers (browser + server)
- `queries/` — query helpers/types
- `types/` — generated/shared TypeScript types (including Supabase Database types)

## Deployment

This is a standard Next.js app and deploys cleanly to Vercel.

Make sure you set the same env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and optionally `NEXT_PUBLIC_SITE_URL`) in your hosting provider.

## Troubleshooting

- **Stuck loading after login**: clear Next cache and restart dev server:

```bash
rm -rf .next
npm run dev
```

- **Supabase lock AbortError**: avoid calling `client.from(...)` inside `onAuthStateChange` callbacks. This project routes DB reads through server actions where possible.

---

If you want, I can also add:
- a `.env.example`
- a short “Supabase schema checklist” section for required tables/buckets
