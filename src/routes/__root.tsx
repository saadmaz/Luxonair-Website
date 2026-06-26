// Root layout for all routes.
// RootShell renders the full <html> document (head, body, scripts).
// RootComponent wraps every page with the shared Header / Footer / floating CTAs.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  ScriptOnce,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles/globals.css?url";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Luxeonair | Tailor-Made Luxury Travel from the UK" },
      { name: "description", content: "London luxury travel agency specialising in bespoke long-haul holidays, family escapes and corporate trips. ATOL protected. A consultant replies to every quote within 4 hours." },
      { name: "author", content: "Luxeonair" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { property: "og:site_name", content: "Luxeonair" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#042045" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "style", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "icon", href: "/Favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/Logo/Main%20Logo.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TravelAgency",
              "@id": "https://www.luxeonair.com/#organization",
              "name": "Luxeonair",
              "url": "https://www.luxeonair.com",
              "logo": "https://www.luxeonair.com/Logo/Main%20Logo.png",
              "description": "London-based luxury travel agency crafting bespoke long-haul holidays, family escapes and corporate travel programmes from the UK. ATOL protected. One dedicated consultant per trip.",
              "telephone": "+447448009739",
              "email": "info@luxeonair.co.uk",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "11 Charlotte Avenue",
                "addressLocality": "Bicester",
                "postalCode": "OX27 8AS",
                "addressCountry": "GB"
              },
              "areaServed": { "@type": "Country", "name": "United Kingdom" },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                  "opens": "09:00",
                  "closes": "18:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday","Sunday"],
                  "opens": "10:00",
                  "closes": "17:00"
                }
              ],
              "priceRange": "£££",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "6",
                "bestRating": "5",
                "worstRating": "1"
              },
              "knowsAbout": [
                "Long-haul holidays",
                "Luxury travel",
                "Corporate travel management",
                "Family holidays",
                "Honeymoon travel",
                "Business class flights",
                "Maldives holidays",
                "Dubai holidays",
                "ATOL protected travel"
              ],
              "hasCredential": [
                { "@type": "EducationalOccupationalCredential", "name": "ATOL Protected" },
                { "@type": "EducationalOccupationalCredential", "name": "IATA Accredited" }
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://www.luxeonair.com/#website",
              "url": "https://www.luxeonair.com",
              "name": "Luxeonair",
              "description": "Tailor-made luxury travel from the UK",
              "publisher": { "@id": "https://www.luxeonair.com/#organization" },
              "inLanguage": "en-GB",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.luxeonair.com/destinations?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }
          ]
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Inline script injected synchronously before first paint to apply the user's
// stored theme preference. Prevents flash of unstyled content (FOUC) on dark mode.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark';document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ScriptOnce>{themeInit}</ScriptOnce>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        <Outlet />
      ) : (
        <div className="flex min-h-dvh flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1 pb-16 md:pb-0">
            <Outlet />
          </main>
          <Footer />
          <StickyMobileCTA />
          <WhatsAppFloat />
        </div>
      )}
    </QueryClientProvider>
  );
}
