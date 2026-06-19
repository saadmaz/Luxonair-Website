import { createFileRoute, Link } from "@tanstack/react-router";
import { holidayTypes } from "@/lib/holidayTypes";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/holiday-types/")({
  head: () => ({
    meta: [
      { title: "Holiday Types — Beach, Honeymoon, Family, Luxury & more | Luxonair" },
      { name: "description", content: "Browse Luxonair holiday types — beach, honeymoon, family, luxury, city breaks and all-inclusive escapes from the UK." },
      { property: "og:title", content: "Holiday Types — Luxonair" },
      { property: "og:url", content: "/holiday-types" },
    ],
    links: [{ rel: "canonical", href: "/holiday-types" }],
  }),
  component: HolidayTypesIndex,
});

function HolidayTypesIndex() {
  return (
    <div className="container-page py-12 md:py-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Holiday types</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl text-balance">
          Find a trip shape that fits.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pick the type, we'll match the destination, board basis, and flight cabin to your dates and budget.
        </p>
      </header>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {holidayTypes.map((h) => (
          <Link
            key={h.slug}
            to="/holiday-types/$slug"
            params={{ slug: h.slug }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img src={h.heroImage} alt={h.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl font-semibold">{h.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{h.tagline}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-foreground group-hover:text-primary">
                Explore <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
