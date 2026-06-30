import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getHolidayTypes } from "@/server/queries";

export const Route = createFileRoute("/holiday/")({
  loader: async () => getHolidayTypes(),
  head: () => ({
    meta: [
      { title: "Types of Holiday | Beach, City Break, All Inclusive, Family & More | Luxeonair" },
      { name: "description", content: "Beach, city breaks, all-inclusive, theme parks, family, multi-city, trending and summer holidays — all tailor-made from the UK by a dedicated consultant." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Types of Holiday | Beach, City Break, Family & More | Luxeonair" },
      { property: "og:description", content: "Beach, city breaks, all-inclusive, theme parks, family & multi-city — every style tailor-made from the UK." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.co.uk/holiday" },
      { name: "twitter:title", content: "Types of Holiday | Luxeonair" },
      { name: "twitter:description", content: "Beach, city breaks, all-inclusive, family & more. Every holiday style, tailor-made from the UK." },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.co.uk/holiday" }],
  }),
  component: HolidayTypesIndex,
});

function HolidayTypesIndex() {
  const holidayTypes = Route.useLoaderData();
  return (
    <>
      {/* Dark hero */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Holiday types
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Find a holiday that best suits you.
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
              to="/holiday/$slug"
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
