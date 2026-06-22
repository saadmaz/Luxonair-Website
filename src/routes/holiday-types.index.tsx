import { createFileRoute, Link } from "@tanstack/react-router";
import { holidayTypes } from "@/data/holidayTypes";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/holiday-types/")({
  head: () => ({
    meta: [
      { title: "Types of Holiday | Beach, Honeymoon, Family & Luxury | Luxe on Air" },
      { name: "description", content: "Beach retreats, romantic honeymoons, family adventures, luxury escapes, city breaks and all-inclusive holidays — all tailor-made from the UK by a dedicated consultant." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Types of Holiday | Beach, Honeymoon, Family & Luxury | Luxe on Air" },
      { property: "og:description", content: "Beach, honeymoon, family, luxury, city breaks and all-inclusive — every style tailor-made from the UK." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.com/holiday-types" },
      { name: "twitter:title", content: "Types of Holiday | Luxe on Air" },
      { name: "twitter:description", content: "Beach, honeymoon, family, luxury & all-inclusive. Every holiday style, tailor-made from the UK." },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.com/holiday-types" }],
  }),
  component: HolidayTypesIndex,
});

function HolidayTypesIndex() {
  return (
    <>
      {/* Dark hero */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Holiday types
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Find the trip shape that fits you.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            Pick the type, we'll match the destination, board basis, and flight cabin to your
            dates and budget.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="container-page py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {holidayTypes.map((h) => (
            <Link
              key={h.slug}
              to="/holiday-types/$slug"
              params={{ slug: h.slug }}
              className="group relative overflow-hidden rounded-2xl shadow-md"
            >
              <div className="aspect-4/3 w-full overflow-hidden">
                <img
                  src={h.heroImage}
                  alt={h.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-primary/70 via-primary/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <div className="font-display text-xl font-semibold">{h.name}</div>
                <div className="mt-0.5 text-sm text-primary-foreground/75">{h.tagline}</div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold group-hover:gap-2">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
