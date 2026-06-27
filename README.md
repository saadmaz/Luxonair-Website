# Luxonair Website

Marketing and enquiry website for Luxonair, a UK travel agency specialising in premium long-haul, family, and corporate trips.

---

## Overview

This is the public-facing website for Luxonair. It presents destination pages, travel deals, holiday-type guides, a blog, and a customer reviews section. The primary conversion flows are a structured four-step quote wizard and a contact form. The site has no booking engine or payment processing — all enquiries are handled offline by consultants.

It includes a password-protected admin dashboard for managing enquiries, contact messages, newsletter subscribers, and content across all sections.

The site uses server-side rendering on first load and client-side navigation thereafter, backed by a MySQL database for form submissions and a Nitro server for SSR and API routes.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | ^5.8.3 |
| UI framework | React | ^19.2.0 |
| Meta-framework (SSR) | TanStack Start | ^1.167.50 |
| File-based routing | TanStack Router | ^1.168.25 |
| Data fetching | TanStack Query | ^5.83.0 |
| Build tool | Vite | ^8.0.16 |
| SSR server | Nitro | 3.0.260603-beta |
| CSS | Tailwind CSS | ^4.2.1 |
| CSS animations | tw-animate-css | ^1.3.4 |
| UI primitives | Radix UI (full suite) | ^1.x – ^2.x |
| Icons | Lucide React | ^0.575.0 |
| Form handling | react-hook-form | ^7.71.2 |
| Form validation | Zod | ^3.24.2 |
| Carousel | Embla Carousel React | ^8.6.0 |
| Date picker | react-day-picker | ^9.14.0 |
| Date utilities | date-fns | ^4.1.0 |
| Toast notifications | Sonner | ^2.0.7 |
| Auth | jose (JWT) + bcryptjs | ^6.2.3, ^3.0.3 |
| Database ORM | Drizzle ORM | ^0.45.2 |
| Database driver | MySQL2 | ^3.11.0 |
| Deployment target | Vercel (Nitro preset) or Node.js (PM2) | — |

Fonts loaded from Google Fonts: **Fraunces** (display/headings) and **Inter** (body).

---

## Project Structure

```
Luxonair-Website/
├── public/                          # Static assets served as-is
│   ├── favicon.png
│   ├── Logo/Main Logo.png
│   ├── robots.txt
│   └── sitemap.xml                  # Static sitemap (also generated dynamically at runtime)
├── db/
│   ├── schema.ts                    # Drizzle table definitions (enquiries, contacts, subscribers)
│   ├── index.ts                     # MySQL pool init + Drizzle ORM instance
│   └── migrations/                  # Drizzle-generated migration files
├── src/
│   ├── routes/                      # File-based route definitions (TanStack Router)
│   │   ├── __root.tsx               # Root layout: HTML shell, Header, Footer, CTAs, JSON-LD
│   │   ├── index.tsx                # Home page (/)
│   │   ├── about.tsx                # About page
│   │   ├── contact.tsx              # Contact page with enquiry form
│   │   ├── quote.tsx                # 4-step quote wizard
│   │   ├── destinations.tsx         # Destinations layout route
│   │   ├── destinations.index.tsx   # /destinations listing
│   │   ├── destinations.$slug.tsx   # /destinations/:slug detail page
│   │   ├── holiday-types.tsx        # Holiday types layout route
│   │   ├── holiday-types.index.tsx  # /holiday-types listing
│   │   ├── holiday-types.$slug.tsx  # /holiday-types/:slug detail page
│   │   ├── deals.tsx                # Deals listing
│   │   ├── flights.tsx              # Flights page
│   │   ├── holidays.tsx             # Holidays overview page
│   │   ├── blog.tsx                 # Blog layout route
│   │   ├── blog.index.tsx           # /blog listing
│   │   ├── blog.$slug.tsx           # /blog/:slug post
│   │   ├── reviews.tsx              # Customer testimonials
│   │   ├── faq.tsx                  # FAQ accordion page
│   │   ├── privacy.tsx              # Privacy policy
│   │   ├── terms.tsx                # Terms & conditions
│   │   ├── sitemap[.]xml.ts         # Server-rendered XML sitemap at /sitemap.xml
│   │   ├── admin.tsx                # Admin layout (auth-protected wrapper)
│   │   ├── admin.login.tsx          # Admin login page
│   │   ├── admin.index.tsx          # Admin dashboard (stats + recent activity)
│   │   ├── admin.enquiries.tsx      # Quote enquiry management
│   │   ├── admin.messages.tsx       # Contact message management
│   │   ├── admin.subscribers.tsx    # Newsletter subscriber list
│   │   ├── admin.blog.tsx           # Blog content editor
│   │   ├── admin.destinations.tsx   # Destination editor
│   │   ├── admin.deals.tsx          # Deal editor
│   │   ├── admin.holidays.tsx       # Holiday type editor
│   │   ├── admin.testimonials.tsx   # Review editor
│   │   ├── admin.faqs.tsx           # FAQ editor
│   │   ├── admin.users.tsx          # Admin user management
│   │   └── api/                     # Server-side API route handlers
│   │       ├── auth/login.ts
│   │       ├── auth/logout.ts
│   │       ├── auth/me.ts
│   │       ├── enquiries/index.ts
│   │       ├── enquiries/$id.ts
│   │       ├── contacts/index.ts
│   │       ├── contacts/$id.ts
│   │       ├── subscribers/index.ts
│   │       └── subscribers/$id.ts
│   ├── features/
│   │   └── home/                    # Home page section components
│   │       ├── Hero.tsx
│   │       ├── StatsStrip.tsx
│   │       ├── TrustPillars.tsx
│   │       ├── FeaturedDestinations.tsx
│   │       ├── HolidayTypeTiles.tsx
│   │       ├── DealsSection.tsx
│   │       ├── WhyLuxonair.tsx
│   │       ├── SocialProof.tsx
│   │       ├── BlogCarousel.tsx
│   │       ├── FinalCta.tsx
│   │       └── index.ts
│   ├── components/
│   │   ├── layout/                  # Header, Footer, StickyMobileCTA, WhatsAppFloat, ThemeToggle
│   │   ├── shared/                  # Reusable cross-page components
│   │   │   ├── QuoteForm.tsx        # 4-step quote wizard component
│   │   │   ├── Newsletter.tsx       # Email signup component
│   │   │   ├── HeroSearchTabs.tsx   # Home hero search widget
│   │   │   ├── DestinationCard.tsx  # Destination preview card
│   │   │   └── SectionHeader.tsx
│   │   └── ui/                      # 40+ shadcn/ui-generated Radix UI primitives
│   ├── data/                        # Static content arrays (TypeScript, no CMS)
│   │   ├── destinations.ts
│   │   ├── deals.ts
│   │   ├── holidayTypes.ts
│   │   ├── blog.ts
│   │   ├── reviews.ts
│   │   ├── faq.ts
│   │   └── flights.ts
│   ├── types/                       # TypeScript interfaces for each data domain
│   │   ├── destination.ts
│   │   ├── deal.ts
│   │   ├── blog.ts
│   │   ├── holiday-type.ts
│   │   ├── review.ts
│   │   ├── faq.ts
│   │   ├── flight.ts
│   │   └── index.ts
│   ├── config/
│   │   └── site.ts                  # Single source of truth for brand constants
│   ├── lib/
│   │   ├── utils.ts                 # cn() helper (clsx + tailwind-merge)
│   │   └── unsplash.ts              # Centralised Unsplash CDN URL builder
│   ├── hooks/
│   │   └── use-mobile.tsx           # useIsMobile() hook (768px breakpoint)
│   ├── server/
│   │   ├── auth.ts                  # JWT helpers: signToken, verifyToken, requireAuth()
│   │   ├── error-capture.ts         # Global error listener with 5s TTL cache
│   │   └── error-page.ts            # Static HTML 500 error page renderer
│   ├── styles/
│   │   └── globals.css              # Tailwind entry point + Luxonair brand token definitions
│   ├── router.tsx                   # Router factory with QueryClient context
│   ├── routeTree.gen.ts             # Auto-generated route tree (do not edit manually)
│   ├── server.ts                    # Nitro server entry with error middleware
│   └── start.ts                     # TanStack Start client/server entry point
├── drizzle.config.ts                # Drizzle Kit config (MySQL, schema path, migrations dir)
├── ecosystem.config.cjs             # PM2 config for standalone Node.js deployment
├── nitro.config.ts                  # Nitro server config (entry point, public assets dir)
├── vite.config.ts                   # Vite config (TanStack Start, Tailwind, tsconfig paths)
├── tsconfig.json                    # TypeScript config (strict, bundler module resolution)
├── vercel.json                      # Vercel deployment config (build command, Nitro preset)
├── components.json                  # shadcn/ui CLI config
└── bunfig.toml                      # Bun package manager hint
```

---

## Prerequisites

- **Node.js** — Node 20 LTS recommended. Vite 8 requires Node 18+.
- **npm** — used by `vercel.json`. Bun is also supported (`bunfig.toml`).
- **MySQL** — a running MySQL instance is required for form submissions and the admin dashboard.

---

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd Luxonair-Website

# 2. Install dependencies
npm install

# 3. Create and populate the .env file (see Environment Variables section)
cp .env.example .env

# 4. Push the database schema
npm run db:push
```

---

## Environment Variables

All runtime secrets live in a `.env` file (not committed). An `.env.example` template is included.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MySQL connection string, e.g. `mysql://user:pass@host:3306/dbname` |
| `JWT_SECRET` | Secret key used to sign and verify admin session tokens |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the admin password (generate with bcryptjs) |
| `NODE_ENV` | `production` or `development` |
| `PORT` | Server port (default `3000`) |

**Brand constants** (phone, email, social links, Formspree IDs, accreditation numbers) are **not** environment variables — they live as TypeScript constants in `src/config/site.ts` and are compiled into the bundle.

---

## Site Configuration (`src/config/site.ts`)

`SITE` is the single source of truth for all brand-level constants. Fields set to empty strings act as feature flags — the UI gracefully hides or disables the related element.

| Field | Purpose | Effect when empty |
|---|---|---|
| `formspree.quote` | Formspree form ID for the quote wizard | Submissions logged to console only |
| `formspree.contact` | Formspree form ID for the contact form | Submissions not sent |
| `formspree.newsletter` | Formspree/Mailchimp list ID for newsletter | Submissions not sent |
| `social.facebook` | Facebook page URL | Icon hidden in footer |
| `social.instagram` | Instagram profile URL | Icon hidden in footer |
| `social.linkedin` | LinkedIn URL | Icon hidden in footer |
| `social.youtube` | YouTube channel URL | Icon hidden in footer |
| `accreditation.atol` | ATOL membership number | Membership number not displayed |
| `accreditation.iata` | IATA code | Code not displayed |
| `registration` | Companies House registration number | Not displayed |

`SITE.phone`, `SITE.email`, `SITE.address`, `SITE.hours`, and `SITE.stats` are already populated with live values.

---

## Running the Project

```bash
# Development server (Vite + HMR)
npm run dev

# Production build → outputs to .output/
npm run build

# Preview production build locally
npm run preview

# Start the bundled production server directly
npm run start

# Lint
npm run lint

# Format (Prettier)
npm run format
```

---

## Frontend Architecture

### SSR Model

The project uses **TanStack Start**, which wraps TanStack Router with an SSR layer powered by Nitro. Every public route is server-rendered on first request for SEO and performance, then client-navigated thereafter using the pre-loaded route tree.

The `routeTree.gen.ts` file is auto-generated by the `@tanstack/router-plugin` Vite plugin and must not be edited manually.

### Root Layout (`__root.tsx`)

The root shell renders the full `<html>` document and is responsible for:

- Injecting Google Fonts and Tailwind styles
- Embedding JSON-LD structured data (`TravelAgency` + `WebSite` schema.org types)
- Injecting a synchronous inline script before the first paint to read `localStorage` and toggle the `dark` class on `<html>` — this prevents the flash of unstyled content (FOUC) on theme-aware loads
- Wrapping all non-admin routes with `Header`, `Footer`, `StickyMobileCTA`, and `WhatsAppFloat`
- Admin routes bypass the public wrapper entirely

### Routes

| Path | Description |
|---|---|
| `/` | Home page |
| `/about` | About Luxonair |
| `/contact` | Contact form |
| `/quote` | 4-step quote wizard |
| `/destinations` | All destinations listing |
| `/destinations/:slug` | Individual destination detail |
| `/holiday-types` | Holiday category listing |
| `/holiday-types/:slug` | Individual holiday type |
| `/deals` | Current deals |
| `/flights` | Flights overview |
| `/holidays` | Holidays overview |
| `/blog` | Blog listing |
| `/blog/:slug` | Individual blog post |
| `/reviews` | Customer testimonials |
| `/faq` | FAQ accordion |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions |
| `/sitemap.xml` | Dynamically generated XML sitemap |
| `/admin` | Admin dashboard (auth-protected) |
| `/admin/login` | Admin login |
| `/admin/enquiries` | Quote enquiry management |
| `/admin/messages` | Contact message management |
| `/admin/subscribers` | Newsletter subscriber list |
| `/admin/destinations` | Destination content editor |
| `/admin/deals` | Deal editor |
| `/admin/holidays` | Holiday type editor |
| `/admin/blog` | Blog editor |
| `/admin/testimonials` | Testimonial editor |
| `/admin/faqs` | FAQ editor |
| `/admin/users` | Admin user management |

### Static Content Data

All public-facing content (destinations, deals, blog posts, reviews, FAQ, flights) lives as TypeScript arrays in `src/data/*.ts`. There is no CMS or database for content — updating it means editing these files and redeploying.

**Destination shape:**
```typescript
{
  slug, name, country,
  region: "Europe" | "Caribbean" | "Indian Ocean" | "Asia" | "Americas" | "Middle East",
  tripType: string[],
  budgetBand: "££" | "£££" | "££££",
  fromPrice, durationNights,
  heroImage, gallery: string[],
  tagline, summary,
  itinerary: [{ day, title, detail }],
  highlights: string[]
}
```

**BlogPost shape:**
```typescript
{
  slug, title, excerpt,
  category: "Guides" | "Family" | "Corporate" | "News",
  author, date, readMinutes, heroImage,
  content: [{ heading?, body }]
}
```

**Deal, HolidayType, Review, FaqGroup, FlightRoute** follow similarly typed structures defined in `src/types/`.

### Quote Form URL Pre-population

The `/quote` route reads search parameters (`destination`, `when`, `depart`, `tripType`, `travellers`, `cabin`) and maps them to the wizard's initial state. The hero search widget links to `/quote?destination=...` to pre-fill the first step.

### Images

All content images reference Unsplash photo IDs via `src/lib/unsplash.ts`. The `unsplashImg(id, width?)` helper builds the full CDN URL. Changing the CDN or default quality requires editing one line.

### Theme

Dark mode is toggled via a `ThemeToggle` component in the header. The current preference is persisted to `localStorage` and applied by a synchronous script in `__root.tsx` before hydration to prevent FOUC.

### Mobile Responsiveness

`useIsMobile()` hook (768px breakpoint) is used to conditionally render drawer navigation and a sticky mobile CTA bar at the bottom of the screen. A floating WhatsApp button links to `wa.me/<number>` with a prefilled message.

---

## Backend / API Architecture

### Server Entry

`src/server.ts` is the Nitro server entry point. It:

- Imports the error-capture module to attach global `error` and `unhandledrejection` listeners
- Dynamically loads the TanStack Start server bundle
- Catches SSR errors and either recovers a stack trace from the cached error store or falls back to rendering a static HTML error page
- Normalises h3-swallowed catastrophic SSR responses (prevents silent 200-with-broken-HTML responses)

### API Routes (`src/routes/api/`)

All API routes are TanStack Start server functions served by the Nitro handler.

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Verifies email + bcrypt password; sets `lx_session` JWT cookie (7 days, HttpOnly) |
| `GET` | `/api/auth/me` | Protected | Returns current session info |
| `POST` | `/api/auth/logout` | Protected | Clears session cookie |
| `POST` | `/api/enquiries` | Public | Saves a quote wizard submission to the `enquiries` table |
| `GET` | `/api/enquiries` | Protected | Returns all enquiries, newest first |
| `GET` | `/api/enquiries/:id` | Protected | Returns a single enquiry |
| `POST` | `/api/contacts` | Public | Saves a contact form submission to the `contacts` table |
| `GET` | `/api/contacts` | Protected | Returns all contact messages |
| `GET` | `/api/contacts/:id` | Protected | Returns a single contact message |
| `POST` | `/api/subscribers` | Public | Adds an email to the `subscribers` table (unique constraint) |
| `GET` | `/api/subscribers` | Protected | Returns all newsletter subscribers |
| `GET` | `/api/subscribers/:id` | Protected | Returns a single subscriber |

### Authentication

Session auth is implemented in `src/server/auth.ts` using **jose** for JWT operations and **bcryptjs** for password hashing.

- On login, the server checks the submitted credentials against `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` from env vars
- A signed JWT is issued and stored in a `lx_session` cookie (HttpOnly, Secure in production, 7-day expiry)
- Protected routes call `requireAuth()` which verifies the cookie before processing the request
- There is a single admin account; credentials are set via environment variables

### Sitemap

`GET /sitemap.xml` is a server-rendered route that builds an XML sitemap dynamically from the static data arrays (destinations, holiday types, blog posts). It sets `Cache-Control: max-age=3600` (1 hour). A static `public/sitemap.xml` also exists as a fallback.

---

## Database

### Technology

**MySQL** with **Drizzle ORM**. The connection is initialised in `db/index.ts` using the `DATABASE_URL` environment variable. Drizzle Kit is used for schema management.

### Schema

**`enquiries` table** — Stores quote wizard submissions:

| Column | Type | Notes |
|---|---|---|
| id | INT | PK, auto-increment |
| name, email, phone, destination | TEXT NOT NULL | |
| region, tripType, dateMode, departWindow | TEXT | Nullable |
| flexibility, departDate, returnDate | TEXT | Nullable |
| nights, adults, children | INT | |
| departAirport, cabinClass, budget | TEXT | |
| directOnly, preferredAirlines, notes | TEXT | Nullable |
| status | TEXT | Default `"new"` |
| createdAt | TIMESTAMP | Auto |

**`contacts` table** — Stores contact form submissions:

| Column | Type | Notes |
|---|---|---|
| id | INT | PK, auto-increment |
| name, email, phone, topic, message | TEXT | |
| read | BOOLEAN | Default `false` |
| createdAt | TIMESTAMP | Auto |

**`subscribers` table** — Stores newsletter signups:

| Column | Type | Notes |
|---|---|---|
| id | INT | PK, auto-increment |
| email | VARCHAR(255) | UNIQUE |
| createdAt | TIMESTAMP | Auto |

### Database Commands

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply schema to the database directly (skips migration files)
npm run db:push

# Open Drizzle Studio (web UI for browsing data)
npm run db:studio
```

---

## Admin Dashboard

The admin area lives under `/admin` and is protected by JWT session auth. Accessing any `/admin/*` route without a valid `lx_session` cookie redirects to `/admin/login`.

| Section | Description |
|---|---|
| Dashboard | Overview with stats and recent enquiries/messages |
| Enquiries | View and manage quote wizard submissions |
| Messages | View and manage contact form submissions |
| Subscribers | View newsletter email list |
| Destinations | Content editor for destination data |
| Deals | Content editor for deals |
| Holidays | Content editor for holiday types |
| Blog | Content editor for blog posts |
| Testimonials | Content editor for customer reviews |
| FAQs | Content editor for FAQ entries |
| Users | Admin user account management |

Content editors in the admin allow viewing and basic CRUD. Changes made via the admin are not yet persisted to the static `src/data/*.ts` files — this is a known limitation.

---

## Styling

### Tailwind CSS v4

Styles are authored in Tailwind CSS v4 with a custom design system defined in `src/styles/globals.css` using CSS custom properties in OKLCH colour space.

**Brand colour palette:**

| Token | Hex | Usage |
|---|---|---|
| `--navy` | `#042045` | Page background (dark), headings |
| `--primary` | `#12355B` | Royal navy, primary actions |
| `--teal` | `#0F9CA4` | Accent, ring, highlights |
| `--teal-deep` | `#097F8B` | Teal hover states |
| `--gold` | `#D2972A` | Luxury gold, admin badges |
| `--aqua` | `#6AAEB7` | Secondary, light accent |

### Utilities

- **`cn()`** in `src/lib/utils.ts` — merges Tailwind class names using `clsx` + `tailwind-merge`, resolving specificity conflicts.
- **40+ Radix UI primitives** scaffolded via shadcn/ui (`components.json`) live in `src/components/ui/`.

---

## Forms & Validation

### Quote Wizard

`QuoteForm.tsx` is a 4-step wizard with:
- Zod schema validation at each step
- Fields: destination, trip dates, trip type, traveller count, budget, special notes, departure airport, cabin class
- On submit: if `SITE.formspree.quote` is set, POSTs to Formspree; otherwise logs to console (demo mode)
- URL pre-population from search params on the `/quote` route

### Contact Form

- Fields: name, email, phone, topic, message
- Posts to `/api/contacts` (stored in DB) and optionally to Formspree if `SITE.formspree.contact` is set

### Newsletter

- Email field → `POST /api/subscribers` (stored in DB)
- Renders in two variants: full-width section or inline

---

## Error Handling

**`src/server/error-capture.ts`** — Attaches global `error` and `unhandledrejection` listeners on the Node process. Stores the last error with a 5-second TTL so `server.ts` can recover a stack trace when h3 silently swallows a thrown error.

**`src/server/error-page.ts`** — Renders a static HTML 500 error page without requiring React SSR. Detects the browser's `prefers-color-scheme` and renders an appropriate theme. Provides "Try again" (page reload) and "Go home" buttons.

**Root error boundary** — `ErrorComponent` in `__root.tsx` catches client-side React errors and renders an inline recovery UI with "Try again" (invalidates query cache) and "Go home" buttons.

---

## Deployment

### Vercel (primary)

`vercel.json` specifies a custom build command that runs the Vite build followed by a Nitro build with `NITRO_PRESET=vercel`. The output lands in `.vercel/output/` in the Vercel serverless format.

```json
{
  "buildCommand": "npm run build && NITRO_PRESET=vercel npx nitro build",
  "outputDirectory": ".vercel/output"
}
```

### Standalone Node.js (Hostinger / PM2)

`ecosystem.config.cjs` is a PM2 configuration that runs `.output/server/index.mjs` directly. Use this for VPS or shared hosting deployments where Vercel is not available.

```bash
pm2 start ecosystem.config.cjs
```

---

## Testing

No tests exist in this repository. There is no test framework installed and no test scripts in `package.json`.

---

## Known Limitations / TODOs

**From `src/config/site.ts`:**
- `SITE.registration` — Companies House number is placeholder `"00000000"`.
- `SITE.formspree.*` — All three IDs are empty; forms run in demo/console mode until populated.
- `SITE.accreditation.atol`, `.iata` — Both empty; accreditation section shows descriptions only.
- `SITE.social.*` — All four social links are empty strings; icons are conditionally hidden.

**From `src/routes/sitemap[.]xml.ts`:**
- `BASE_URL` is an empty string, so `<loc>` values are relative paths (e.g. `/destinations/maldives`). Set this to the production domain before submitting the sitemap to search engines.

**Admin content editors:**
- Changes made in the admin dashboard are not yet written back to the static `src/data/*.ts` files. Admin CRUD and static data are not yet connected.
- Only a single admin account is supported (credentials via env vars). There is no multi-user or role-based access control.

**General:**
- No test suite.
- No CMS integration — all content is in TypeScript arrays and requires a redeploy to update.

---

## License

No `LICENSE` file is present in the repository.
