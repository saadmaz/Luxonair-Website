# Luxeonair Website

Marketing and lead-generation website for Luxeonair, a UK travel agency specialising in bespoke long-haul holidays, family escapes, and corporate travel.

- **Live domain:** www.luxeonair.co.uk
- **Stack:** TanStack Start · React 19 · Nitro · MySQL · Drizzle ORM
- **Deploy:** Hostinger VPS · PM2
- **Node:** 22 LTS

> **Note:** This README was reverse-engineered from the codebase. It supersedes the previous version which contained inaccuracies including a non-existent Vercel deployment, Formspree integrations never implemented, a missing `/about` route reference, and documentation of only 3 of 14 database tables.

---

## Overview

Luxeonair is a server-side rendered marketing site with an integrated admin CMS and lead management dashboard. The site has **no booking engine or payment processing** — all transactions happen offline. Its purpose is to capture leads through a quote wizard and contact form, present travel content (destinations, deals, blog, flight offers), and allow an admin team to manage that content and respond to enquiries.

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | `^5.8.3` |
| UI Framework | React | `^19.2.0` |
| Meta-framework | TanStack Start (SSR) | `^1.167.50` |
| File-based routing | TanStack Router | `^1.168.25` |
| Data fetching | TanStack Query | `^5.83.0` |
| Build tool | Vite | `^8.0.16` |
| SSR server | Nitro | `3.0.260603-beta` |
| CSS | Tailwind CSS v4 | `^4.2.1` |
| UI Primitives | Radix UI (40+ components) | `^1.x – ^2.x` |
| Rich text editor | Tiptap | `^3.27.1` |
| Charts | Recharts | `^2.15.4` |
| Animation | Framer Motion | `^12.42.0` |
| Forms | react-hook-form + Zod | `^7.71.2 / ^3.24.2` |
| Auth | jose (JWT) + bcryptjs | `^6.2.3 / ^3.0.3` |
| ORM | Drizzle ORM | `^0.45.2` |
| Database driver | mysql2 | `^3.11.0` |
| Database | MySQL 8 (dev via Docker), MariaDB (Hostinger prod) | — |
| Email | Resend | `^6.16.0` |
| Error monitoring | Sentry (Node + React) | `^10.62.0` |
| Process manager | PM2 | via `ecosystem.config.cjs` |

> **Warning:** Nitro is pinned to a beta build (`3.0.260603-beta`). Pin to a stable release when one becomes available.

---

## Architecture

The application is **server-side rendered on first request** (Nitro + TanStack Start), then client-navigated as a React SPA. API routes live alongside page routes in `src/routes/api/` and are handled by Nitro at runtime.

- **Request flow:** Browser → Nitro (SSR) → TanStack Router → React → MySQL via Drizzle ORM
- **Client navigation:** After hydration, TanStack Router handles navigation client-side. TanStack Query caches server data.
- **State management:** TanStack Query for all server state. No global client store. Theme and sidebar state in `localStorage`.
- **Security layer:** HTTP security headers set in `nitro.config.ts` via `routeRules`: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

The database is the authoritative source for all dynamic content. The `src/data/` directory contains legacy static TypeScript arrays (destinations, packages, flights) that are no longer consumed by public-facing pages — the live site reads exclusively from MySQL via `src/server/queries.ts`.

---

## Folder Structure

```
Luxonair-Website/
├── .env.example                  # environment variable template
├── .github/workflows/deploy.yml  # CI/CD: build + SSH deploy
├── .nvmrc                        # Node 22 pin
├── docker-compose.yml            # local MySQL 8 dev database
├── drizzle.config.ts             # Drizzle Kit config
├── ecosystem.config.cjs          # PM2 config
├── nitro.config.ts               # Nitro: security headers, routeRules
├── db/
│   ├── index.ts                  # mysql2 pool + Drizzle instance
│   ├── migrate.ts                # migration runner (--baseline flag)
│   ├── schema.ts                 # all table definitions
│   └── migrations/               # 9 SQL migration files
├── public/                       # static assets: logo, favicon
└── src/
    ├── router.tsx                # router factory + QueryClient
    ├── components/
    │   ├── admin/                # AirportPicker, GalleryUpload, RichTextEditor
    │   ├── layout/               # Header, Footer, ThemeToggle, WhatsAppFloat
    │   ├── shared/               # QuoteForm, DestinationCard, Newsletter, …
    │   └── ui/                   # 40+ Radix UI / shadcn primitives
    ├── config/
    │   └── site.ts               # brand constants (phone, email, address, socials)
    ├── data/                     # legacy static arrays — not used by live pages
    ├── features/home/            # home page section components
    ├── hooks/                    # useIsMobile, useInView
    ├── lib/                      # api.ts helpers, cn(), unsplash URL builder
    ├── routes/
    │   ├── __root.tsx            # global layout, JSON-LD, dark mode
    │   ├── *.tsx                 # public page routes
    │   ├── admin*.tsx            # admin pages
    │   └── api/                  # all API route handlers
    ├── server/
    │   ├── auth.ts               # JWT sign/verify, requireAuth, requireSuperAdmin
    │   ├── email.ts              # Resend email senders
    │   ├── queries.ts            # createServerFn loaders for SSR
    │   ├── rate-limit.ts         # DB-backed rate limiter
    │   └── validate.ts           # all Zod input schemas
    └── styles/globals.css        # Tailwind v4 entry + OKLCH brand tokens
```

---

## Getting Started

### Prerequisites

- **Node.js 22 LTS** — pinned in `.nvmrc` and CI
- **npm** — used in CI; Bun also supported locally (`bunfig.toml`)
- **Docker + Docker Compose** — required for local MySQL instance
- A **Resend** account with a verified sending domain (required for email notifications)

### Installation

```bash
# 1. Clone
git clone <repo-url>
cd Luxonair-Website

# 2. Install dependencies
npm install

# 3. Start local MySQL database
docker compose up -d
# Creates: luxonair_dev database, user luxonair_dev, password luxonair_dev_password, port 3306

# 4. Configure environment variables
cp .env.example .env
# Edit .env — see Environment Variables section

# 5. Run database migrations
npm run db:migrate

# 6. Start development server
npm run dev
# Site: http://localhost:3000
# Admin: http://localhost:3000/admin
```

---

## Environment Variables

| Variable | Required | Purpose | Example |
|---|---|---|---|
| `NODE_ENV` | Required | Controls cookie `Secure` flag and error verbosity | `production` |
| `PORT` | Optional | Server listen port | `3000` |
| `DATABASE_URL` | Required | Full MySQL/MariaDB connection URL | `mysql://user:pass@127.0.0.1:3306/dbname` |
| `DATABASE_SSL` | Optional | Set `true` to enable TLS on DB connection | `false` |
| `JWT_SECRET` | Required | Signs admin session JWTs. Minimum 32 characters. Rotate to invalidate all sessions. | `openssl rand -hex 32` |
| `ADMIN_USERNAME` | Required | Bootstrap superadmin username. No database row required. | `super_admin` |
| `ADMIN_PASSWORD_HASH` | Required | bcrypt hash of the bootstrap superadmin password. | `$2b$12$...` |
| `RESEND_API_KEY` | Required | Resend transactional email API key. Without this, no email alerts are sent. | `re_xxxxxxxxxxxx` |
| `RESEND_FROM` | Optional | Sender address. Must be a verified domain in Resend. | `Luxeonair <noreply@luxeonair.co.uk>` |
| `RESEND_TO` | Optional | Admin inbox for inbound notification emails. | `admin@luxeonair.co.uk` |
| `SENTRY_DSN` | Optional | Sentry project DSN for server + client error monitoring. | `https://xxx@yyy.ingest.sentry.io/zzz` |

**Generating the admin password hash:**

```bash
node -e "require('bcryptjs').hash('your-password-here', 12).then(console.log)"
```

> `ADMIN_EMAIL` is accepted as a legacy alias for `RESEND_TO` but is not documented in `.env.example`. Use `RESEND_TO` in new deployments.

---

## Database Setup

The project uses **Drizzle ORM** with a MySQL dialect. Migrations live in `db/migrations/`. There are currently 9 migration files covering the full schema.

```bash
# Apply all pending migrations
npm run db:migrate

# Browse the database via Drizzle Studio
npm run db:studio

# Generate a new migration after schema changes
npm run db:generate
# → Review the generated SQL before committing
```

### Production migration cutover

> **One-time action required:** The production database was initially created using `npm run db:push` (schema push without migration tracking). Before switching the deploy pipeline to use `npm run db:migrate`, run the baseline command once on production to register existing migrations without re-applying them:

```bash
npm run db:migrate -- --baseline
```

After this one-time step, all subsequent deploys use `npm run db:migrate` normally.

---

## Available Scripts

| Script | Command | Use when |
|---|---|---|
| `dev` | `vite dev` | Local development with HMR |
| `build` | `vite build && nitro build` | Full production build |
| `build:dev` | `vite build --mode development` | Vite-only dev build (no Nitro) |
| `preview` | `vite preview` | Preview Vite client build locally |
| `start` | `node .output/server/index.mjs` | Start production Nitro server directly |
| `lint` | `eslint .` | Check for lint errors |
| `format` | `prettier --write .` | Auto-format all source files |
| `db:generate` | `drizzle-kit generate` | Generate SQL migration from schema changes |
| `db:push` | `drizzle-kit push` | Push schema directly — dev only, not safe on live data |
| `db:studio` | `drizzle-kit studio` | Browse database via Drizzle Studio UI |
| `db:migrate` | `tsx db/migrate.ts` | Apply pending migrations. Add `-- --baseline` for one-time cutover. |

---

## Public Website

All public routes are SSR-rendered on first load from MySQL data. The hero search widget pre-populates the quote wizard via URL parameters (`destination`, `when`, `depart`, `tripType`, `travellers`, `cabin`).

| Route | Page |
|---|---|
| `/` | Home — hero, deals, destinations, holiday types, flight offers, blog, FAQ, newsletter |
| `/destinations` | Destinations listing — filterable by region, trip type, budget band |
| `/destinations/:slug` | Destination detail — gallery, itinerary, highlights, quote CTA |
| `/holiday` | Holiday types listing |
| `/holiday/:slug` | Holiday type detail with associated destinations |
| `/deals` | All current deals |
| `/flight-offers` | Flight offers with booking modal |
| `/flights` | Flights overview (static) |
| `/holidays` | Holidays overview (static) |
| `/blog` | Blog listing — featured article + grid |
| `/blog/:slug` | Blog post — full Tiptap-rendered rich text |
| `/reviews` | Customer testimonials from database |
| `/faq` | Accordion FAQ grouped by category from database |
| `/quote` | 4-step quote wizard — submits to `POST /api/enquiries` |
| `/contact` | Contact form — submits to `POST /api/contacts` |
| `/privacy` | Privacy policy (static) |
| `/terms` | Terms and conditions (static) |
| `/sitemap.xml` | Dynamically generated XML sitemap |

**UX features:**
- Dark mode toggle — persisted to `localStorage`, FOUC prevention via inline script in root layout
- Sticky mobile CTA bar and floating WhatsApp button (`wa.me/447448009739`)
- Animated page transitions via Framer Motion `AnimatePresence`
- Skip-to-content accessibility link in root layout
- Country flags via `flag-icons` CSS library
- Image carousels via Embla Carousel

---

## Admin Dashboard

Available at `/admin`. All routes are protected server-side via `requireAuth()`. User management is restricted to the `superadmin` role.

| Route | Section | Description |
|---|---|---|
| `/admin` | Dashboard | Stats cards, recent enquiries, activity feed. Notification counts poll every 60 seconds. |
| `/admin/enquiries` | Quote Enquiries | View, update status, edit notes, delete, reply by email |
| `/admin/flight-bookings` | Flight Bookings | CRUD for flight offer booking submissions |
| `/admin/messages` | Messages | Contact form submissions — mark read/unread, delete |
| `/admin/subscribers` | Subscribers | Newsletter subscribers — view and delete |
| `/admin/destination-highlights` | Destination Highlights | Image tiles for the home page "Featured Destinations" section |
| `/admin/destinations` | Destinations | Full CRUD — gallery upload, itinerary, highlights list |
| `/admin/deals` | Deals | Full CRUD — gallery upload, expiry date, is-favourite flag |
| `/admin/flight-offers` | Flight Offers | Full CRUD — route codes, airline, cabin class, price, featured flag |
| `/admin/holidays` | Holiday Types | Full CRUD — slug, bullets, associated destination slugs |
| `/admin/blog` | Blog | Full CRUD with Tiptap rich text editor; hero image upload |
| `/admin/testimonials` | Testimonials | Full CRUD |
| `/admin/faqs` | FAQs | CRUD for FAQ groups and items with sort order |
| `/admin/users` | Users | Superadmin only — invite, edit, delete admin users |

**Admin UI features:**
- Collapsible sidebar (state stored in `localStorage` as `lx_sidebar_collapsed`)
- Mobile drawer navigation
- Notification bell showing live counts: new enquiries, unread messages, new flight bookings (polled every 60 seconds via `GET /api/activity`)
- Command palette — Cmd/Ctrl+K to jump between sections
- Enquiry reply — send an email to the customer directly from the admin UI, automatically updating status to *responded*

---

## Authentication

Admin authentication uses **JWT sessions** stored in a `sessions` database table, delivered via an `HttpOnly` cookie named `lx_session`.

### Admin accounts

There are two auth paths:

- **Bootstrap account** — credentials from `ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH` environment variables. Requires no database row. Always has the `superadmin` role.
- **Database accounts** — stored in the `admin_users` table with roles `admin` or `superadmin`. Managed via `/admin/users` (superadmin only).

### Session security

- Sessions are revocable individually (`POST /api/auth/logout`) or all-at-once (`POST /api/auth/logout-all`)
- Cookie flags: `HttpOnly`, `SameSite=Lax`, `Secure` in production
- Login is rate-limited: 5 attempts per 15 minutes per IP and per account
- Rate limits enforced via the `rate_limits` database table (atomic upsert — safe under concurrent requests)

---

## Email

Outbound email is handled by **Resend** via `src/server/email.ts`. Four email types are implemented:

| Trigger | Recipients | Content |
|---|---|---|
| Quote enquiry submitted | Admin (`RESEND_TO`) | Full enquiry details |
| Contact form submitted | Admin (`RESEND_TO`) | Contact message details |
| Flight offer booking submitted | Admin (`RESEND_TO`) | Booking details and flight offer info |
| Admin replies to enquiry | Customer (their submitted email) | Custom reply composed in admin UI |

> No confirmation email is automatically sent to customers when they submit a quote or contact form. Only the admin reply sends an email to the customer.

---

## API Routes

All API routes are TanStack Start `createAPIFileRoute` handlers processed by Nitro. Server-side Zod validation runs on all mutation endpoints.

### Auth

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Rate-limited login. Sets `lx_session` cookie on success. |
| GET | `/api/auth/me` | Auth | Returns `{ ok: true }` if session is valid. |
| POST | `/api/auth/logout` | Auth | Revokes current session; clears cookie. |
| POST | `/api/auth/logout-all` | Auth | Revokes all sessions for the authenticated user. |

### Activity

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/activity` | Auth | Returns new enquiry count, unread contact count, new flight booking count, recent enquiries, unread contacts. Used by the sidebar notification bell. |

### Public endpoints (rate-limited)

| Method | Path | Limit | Description |
|---|---|---|---|
| POST | `/api/enquiries` | 5/10 min per IP | Submit quote wizard. Fires email alert to admin. |
| POST | `/api/contacts` | 5/10 min per IP | Contact form submission. Fires email alert. |
| POST | `/api/subscribers` | 10/10 min per IP | Newsletter signup. Upsert on duplicate email. |
| POST | `/api/flight-offer-bookings` | 5/10 min per IP | Flight offer booking. Fires email alert. |

### Enquiry management

| Method | Path | Description |
|---|---|---|
| GET | `/api/enquiries` | List enquiries. Supports `?limit=N&page=P`. Returns `{ data, total, page, limit }`. |
| GET | `/api/enquiries/:id` | Single enquiry. |
| PATCH | `/api/enquiries/:id` | Update `status` and/or `notes`. |
| DELETE | `/api/enquiries/:id` | Delete enquiry. |
| POST | `/api/enquiries/:id/reply` | Send reply email to customer; sets status to *responded*. Body: `{ subject, message }`. |

### Authenticated CMS endpoints

The following resource groups each expose `GET` (list + paginated), `POST` (create), `GET /:id`, `PATCH /:id`, `DELETE /:id` — all requiring authentication:

- `/api/contacts`
- `/api/subscribers`
- `/api/blog`
- `/api/destinations`
- `/api/deals`
- `/api/flight-offers`
- `/api/flight-offer-bookings`
- `/api/holidays`
- `/api/testimonials`
- `/api/destination-highlights`
- `/api/faqs`, `/api/faq-groups/:id`, `/api/faq-items`, `/api/faq-items/:id`
- `/api/users` — superadmin only

### File upload

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/upload` | Auth | Upload image (JPG/PNG/WEBP/GIF, max 8MB). MIME detected via magic bytes. Returns `{ url: "/api/uploads/<uuid>.<ext>" }`. |
| GET | `/api/uploads/:filename` | Public | Serve uploaded file. UUID-only filenames enforced (path-traversal protection). Cache: 1-year immutable. |

---

## Database

14 tables managed by Drizzle ORM. MySQL 8 dialect on development; MariaDB-compatible on production (JSON columns returned as raw strings by MariaDB driver — parsed manually in query code).

| Table | Purpose |
|---|---|
| `enquiries` | Quote wizard submissions — status (new/in_progress/responded), all trip details |
| `contacts` | Contact form submissions — `read` boolean, topic, message |
| `subscribers` | Newsletter signups — `email` UNIQUE |
| `blog_posts` | Blog articles — slug UNIQUE, `content` JSON (Tiptap JSONContent), hero_image |
| `destinations` | Destination pages — slug UNIQUE, `gallery` JSON, `itinerary` JSON, `highlights` JSON |
| `deals` | Travel deals — string PK (slug), FK → `destinations.slug`, `gallery` JSON, `is_favourite`, `expires` |
| `testimonials` | Customer reviews — author, trip, rating (1–5), body |
| `faq_groups` | FAQ categories — title, sort_order |
| `faq_items` | FAQ questions — FK → `faq_groups.id` CASCADE DELETE, question, answer, sort_order |
| `holiday_types` | Holiday category pages — slug UNIQUE, `bullets` JSON, `destination_slugs` JSON |
| `destination_highlights` | Home page image tiles — image, country, city, type, sort_order |
| `flight_offers` | Published flight offers — string PK, from_code/to_code (IATA), cabin_class, featured |
| `flight_offer_bookings` | Flight offer booking requests — FK → `flight_offers.id` ON DELETE RESTRICT, status |
| `rate_limits` | DB-backed rate limiting — PK `key` VARCHAR(255), count, reset_at (Unix ms) |
| `sessions` | Admin auth sessions — PK random hex id, email, revoked_at (null = active) |
| `admin_users` | Admin user accounts — email UNIQUE, password_hash, role ENUM(admin, superadmin) |
| `admin_actions` | Audit log of admin API calls — admin_email, method, path, status |

**Relationships:**
- `deals.destination_slug` → `destinations.slug` ON DELETE RESTRICT
- `flight_offer_bookings.offer_id` → `flight_offers.id` ON DELETE RESTRICT
- `faq_items.faq_group_id` → `faq_groups.id` ON DELETE CASCADE

---

## File Uploads

Images uploaded through the admin are stored server-side (not as base64 or external CDN):

1. Admin POSTs multipart form data to `POST /api/upload`
2. Server validates MIME type via **magic bytes** (not the Content-Type header) — accepts JPG, PNG, WEBP, GIF only
3. Size limit: 8MB
4. File saved with a UUID filename to prevent enumeration
5. Server returns `{ url: "/api/uploads/<uuid>.<ext>" }`
6. Files served at `GET /api/uploads/:filename` with path-traversal protection and 1-year immutable cache headers

> **Warning:** Uploaded files are stored on the local VPS filesystem with no offsite backup. A server wipe will lose all uploaded images. Consider migrating to object storage (S3, Cloudflare R2) for production resilience.

---

## Rate Limiting

Rate limits are enforced via atomic upsert into the `rate_limits` database table — safe under concurrent requests and persistent across server restarts.

| Endpoint | Limit | Window | Key |
|---|---|---|---|
| `POST /api/auth/login` | 5 attempts | 15 minutes | Per IP + per account |
| `POST /api/enquiries` | 5 submissions | 10 minutes | Per IP |
| `POST /api/contacts` | 5 submissions | 10 minutes | Per IP |
| `POST /api/flight-offer-bookings` | 5 submissions | 10 minutes | Per IP |
| `POST /api/subscribers` | 10 signups | 10 minutes | Per IP |

---

## Deployment

Deployment targets a **Hostinger VPS** running Node.js 22 + PM2. The GitHub Actions workflow (`.github/workflows/deploy.yml`) automates deployment on push to `main`.

### CI/CD pipeline steps

1. **Build on GitHub runner** — `npm ci && npm run build` → produces `.output/`
2. **Pre-deploy database backup** — SSH into Hostinger; run `mysqldump` to `~/db-backups/`; retain last 14 backups
3. **Deploy code** — pull latest code; install dependencies; run production build on server
4. **Run migrations** — `npm run db:push` (current; see migration cutover note above)
5. **Update environment** — write `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` from GitHub Secrets to `.env`
6. **Reload PM2** — `pm2 reload ecosystem.config.cjs --update-env` (zero-downtime reload)

### Required GitHub Secrets

| Secret | Purpose |
|---|---|
| `HOST` | Hostinger server IP or hostname |
| `PORT` | SSH port |
| `USERNAME` | SSH username |
| `SSH_KEY` | Private SSH key for server access |
| `APP_PATH` | Absolute path to app directory on server |
| `ADMIN_USERNAME` | Bootstrap admin username |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password |

> `RESEND_API_KEY`, `DATABASE_URL`, `JWT_SECRET`, and other env vars must be present in the `.env` file on the server. They are not injected by CI — manage them directly on the server.

### PM2 commands

```bash
# Start / reload application
pm2 reload ecosystem.config.cjs --update-env

# View logs
pm2 logs luxeonair

# Monitor
pm2 monit
```

---

## Troubleshooting

**Admin login returns 500**
Ensure `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` are set in `.env`. Generate the hash with:
```bash
node -e "require('bcryptjs').hash('yourpassword', 12).then(console.log)"
```

**Database connection fails silently**
If `DATABASE_URL` is not set, the pool starts with empty credentials and fails at the first query (not at startup). Check that the variable is exported in your environment. Confirm Docker is running for local dev: `docker compose ps`

**No email notifications on form submissions**
Check that `RESEND_API_KEY`, `RESEND_FROM`, and `RESEND_TO` are set. The sending domain in `RESEND_FROM` must be verified in your Resend account. Check PM2 logs: `pm2 logs luxeonair`

**Uploaded images not persisting after server restart**
Upload files are stored on the local filesystem. A full server wipe will lose them. Back up the uploads directory regularly or migrate to object storage.

**Site content not updating after admin edits**
Public pages are SSR-rendered from MySQL on each request with no caching layer. If changes don't appear, check that the admin PATCH/POST returned a success response, then hard-refresh the public page.

**Dark mode flicker on page load**
The root layout includes an inline script that reads `localStorage` and applies the dark class before React hydrates. If you see a flash, check that the script in `__root.tsx` is not blocked or deferred.

---

## Known Gaps & Future Work

- **Admin dashboard stats are hardcoded** — stat cards and recent enquiries table on `/admin` show mock data, not live database counts
- **Sidebar badge counts are hardcoded** — the navigation badges ("7", "3") are static; the notification bell correctly uses live data but the badge values do not
- **Companies House registration number** — `src/config/site.ts` has a placeholder; update before public launch
- **ATOL and IATA accreditation numbers** — both are empty strings in `site.ts`; the site references ATOL protection prominently, which must match a valid ATOL membership number
- **Social media links** — all social URLs are empty strings in `site.ts`
- **No automated tests** — Playwright is configured (`playwright.config.ts`) but no test files have been written; high-risk areas (auth, enquiry submission, admin CRUD) have no coverage
- **Upload storage** — images are stored on the VPS filesystem with no offsite backup or CDN
- **Migration cutover** — a one-time `npm run db:migrate -- --baseline` is required before switching from `db:push` to `db:migrate` in production CI
- **`admin_actions` audit log** — the table and migration exist; wiring in API route handlers was not confirmed in all routes
- **No customer auto-confirmation email** — customers receive no acknowledgement when submitting the quote or contact form; only the admin reply sends an email to the customer
