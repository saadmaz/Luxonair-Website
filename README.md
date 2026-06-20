# Luxonair Website

Marketing and enquiry website for Luxonair, a UK travel agency specialising in premium long-haul, family, and corporate trips.

---

## Overview

This is the public-facing website for Luxonair. It presents destination pages, travel deals, holiday-type guides, a blog, and a customer reviews section. The primary conversion flows are a structured four-step quote wizard and a contact form, both of which submit to Formspree. The site has no booking engine or payment processing - all enquiries are handled offline by consultants.

The intended audience is UK travellers looking for tailor-made long-haul trips or corporate travel management.

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
| Deployment target | Vercel (via Nitro preset) | - |

Fonts loaded from Google Fonts: **Fraunces** (display/headings) and **Inter** (body).

---

## Project Structure

```
Luxonair-Website/
├── public/                  # Static assets served as-is
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml          # Pre-built XML sitemap (also generated at runtime)
├── src/
│   ├── routes/              # File-based route definitions (TanStack Router)
│   │   ├── __root.tsx       # Root layout: HTML shell, Header, Footer, floating CTAs
│   │   ├── index.tsx        # Home page (/)
│   │   ├── about.tsx        # About page
│   │   ├── contact.tsx      # Contact page with enquiry form
│   │   ├── quote.tsx        # 4-step quote wizard
│   │   ├── destinations.tsx         # Destinations layout route
│   │   ├── destinations.index.tsx   # /destinations listing
│   │   ├── destinations.$slug.tsx   # /destinations/:slug detail
│   │   ├── holiday-types.tsx        # Holiday types layout route
│   │   ├── holiday-types.index.tsx  # /holiday-types listing
│   │   ├── holiday-types.$slug.tsx  # /holiday-types/:slug detail
│   │   ├── deals.tsx        # Deals listing
│   │   ├── flights.tsx      # Flights page
│   │   ├── holidays.tsx     # Holidays page
│   │   ├── blog.tsx         # Blog layout route
│   │   ├── blog.index.tsx   # /blog listing
│   │   ├── blog.$slug.tsx   # /blog/:slug post
│   │   ├── reviews.tsx      # Customer reviews
│   │   ├── faq.tsx          # FAQ accordion page
│   │   └── sitemap[.]xml.ts # Server-rendered XML sitemap at /sitemap.xml
│   ├── features/
│   │   └── home/            # Home page section components (Hero, StatsStrip, etc.)
│   ├── components/
│   │   ├── layout/          # Header, Footer, StickyMobileCTA, WhatsAppFloat, ThemeToggle
│   │   ├── shared/          # Reusable cross-page components (QuoteForm, Newsletter,
│   │   │                    #   HeroSearchTabs, DestinationCard, SectionHeader)
│   │   └── ui/              # shadcn/ui-generated Radix UI primitives (40+ components)
│   ├── data/                # Static data arrays (TypeScript modules, no database)
│   │   ├── destinations.ts
│   │   ├── deals.ts
│   │   ├── holidayTypes.ts
│   │   ├── blog.ts
│   │   ├── reviews.ts
│   │   ├── faq.ts
│   │   └── flights.ts
│   ├── types/               # TypeScript interfaces for each data domain
│   ├── config/
│   │   └── site.ts          # Single source of truth for brand constants (phone,
│   │                        #   email, Formspree IDs, accreditation numbers, stats)
│   ├── lib/
│   │   ├── utils.ts         # cn() helper (clsx + tailwind-merge)
│   │   └── unsplash.ts      # Centralised Unsplash CDN URL builder
│   ├── hooks/
│   │   └── use-mobile.tsx   # useIsMobile() hook
│   ├── server/
│   │   ├── error-capture.ts # Error capture utilities
│   │   └── error-page.ts    # HTML error page renderer for 500s
│   ├── styles/
│   │   └── globals.css      # Tailwind entry point + Luxonair brand token definitions
│   ├── router.tsx           # Router factory with QueryClient context
│   ├── routeTree.gen.ts     # Auto-generated route tree (do not edit manually)
│   ├── server.ts            # Nitro server entry with error middleware
│   └── start.ts             # TanStack Start entry point
├── nitro.config.ts          # Nitro server config (entry point, public assets dir)
├── vite.config.ts           # Vite config (TanStack Start plugin, Tailwind, tsconfig paths)
├── tsconfig.json            # TypeScript config (strict, bundler module resolution)
├── vercel.json              # Vercel deployment config (Nitro build command)
├── components.json          # shadcn/ui CLI config
└── bunfig.toml              # Bun config (package manager hint)
```

---

## Prerequisites

- **Node.js** - no `.nvmrc` or `engines` field present; `vite@^8` requires Node 18+. Node 20 LTS recommended.
- **npm** - used by `vercel.json`'s `installCommand`. Alternatively, the project has a `bunfig.toml` suggesting Bun is also supported.
- No database, no Redis, no external services required to run locally.

---

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd Luxonair-Website

# 2. Install dependencies
npm install

# 3. Configure brand constants (see Environment Variables section)
#    Edit src/config/site.ts directly - there are no .env files.
```

---

## Environment Variables

This project has **no runtime environment variables**. All configuration is in [`src/config/site.ts`](src/config/site.ts) as TypeScript constants.

Fields that must be populated before go-live (currently set to empty strings, which enable demo/disabled mode):

| Field in `SITE` | Purpose | Effect when empty |
|---|---|---|
| `formspree.quote` | Formspree form ID for the quote wizard | Submissions logged to console only |
| `formspree.contact` | Formspree form ID for the contact form | Submissions logged to console only |
| `formspree.newsletter` | Formspree/Mailchimp list ID for newsletter | Submissions not sent |
| `social.facebook` | Facebook page URL | Icon hidden in footer |
| `social.instagram` | Instagram profile URL | Icon hidden in footer |
| `social.linkedin` | LinkedIn URL | Icon hidden in footer |
| `social.youtube` | YouTube channel URL | Icon hidden in footer |
| `accreditation.atol` | ATOL membership number | Membership number not displayed |
| `accreditation.abta` | ABTA membership number | Membership number not displayed |
| `accreditation.iata` | IATA code | Code not displayed |
| `registration` | Companies House registration number | Not displayed |

`SITE.phone`, `SITE.email`, `SITE.address`, and `SITE.stats` are already populated with real values.

---

## Running the Project

Commands are defined in `package.json`:

```bash
# Development server (Vite dev with HMR)
npm run dev

# Production build (Vite client + Nitro server bundle)
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint

# Format (Prettier)
npm run format
```

---

## API Endpoints

This is primarily a frontend site, but one server handler exists:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/sitemap.xml` | Returns a dynamically generated XML sitemap including all destination, holiday-type, and blog slugs. Cached for 1 hour via `Cache-Control`. |

The contact and quote forms are not server-side API routes - they POST directly from the browser to `https://formspree.io/f/<id>`.

---

## Folder-Level Architecture Notes

**Static data, no CMS.** All content (destinations, deals, blog posts, reviews, FAQ, flights) lives in `src/data/*.ts` as TypeScript arrays. There is no database or CMS integration. Updating content means editing these files and redeploying.

**TanStack Start SSR model.** The project uses TanStack Start, which wraps TanStack Router with an SSR layer powered by Nitro. Routes in `src/routes/` are both server-rendered on first load and client-navigated thereafter. The `routeTree.gen.ts` file is auto-generated by the `@tanstack/router-plugin` Vite plugin - do not edit it manually.

**Demo mode for forms.** `SITE.formspree.*` fields default to empty strings. Both `QuoteForm` and the contact form check whether the ID is truthy before POSTing to Formspree; if falsy, they `console.log` the payload. This means the forms are always interactable during development without live credentials.

**Dark mode without flash.** The root shell injects a synchronous inline script before the first paint that reads `localStorage.getItem('theme')` and toggles the `dark` class on `<html>`. This prevents the flash of unstyled content (FOUC) that would occur if the theme were applied by React after hydration.

**Unsplash for all images.** All content images reference Unsplash photo IDs via `src/lib/unsplash.ts:unsplashImg()`. Swapping CDN or changing quality/dimensions requires editing one line.

**URL pre-population for the quote form.** The `/quote` route validates search parameters (`destination`, `when`, `depart`, `tripType`, `travellers`, `cabin`) and maps them to the wizard's initial state. The hero search widget on the home page links to `/quote?destination=...` with these params to pre-fill the form.

---

## Testing

No tests exist in this repository. There is no test framework installed and no test scripts in `package.json`.

---

## Known Limitations / TODOs

From `src/config/site.ts` (explicit `// TODO` comments):

- `SITE.registration` - Companies House registration number is `"00000000"` (placeholder).
- `SITE.formspree.quote`, `.contact`, `.newsletter` - all empty; forms run in demo/console mode.
- `SITE.accreditation.atol`, `.abta`, `.iata` - all empty; accreditation section shows descriptions instead of real membership numbers.
- `SITE.social.*` - all four social links are empty strings; icons are conditionally hidden.

From `src/routes/sitemap[.]xml.ts`:

- `BASE_URL` is an empty string (`""`), so `<loc>` values in the sitemap are relative paths (e.g. `/destinations/maldives-private-villa`) instead of absolute URLs. This needs to be set to the production domain before the sitemap is submitted to search engines.

---

## License

No `LICENSE` file is present in the repository.
