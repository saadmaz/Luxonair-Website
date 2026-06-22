import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findHolidayType, holidayTypes } from "@/data/holidayTypes";
import { destinations } from "@/data/destinations";
import { DestinationCard } from "@/components/shared/DestinationCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/holiday-types/$slug")({
  loader: ({ params }) => {
    const h = findHolidayType(params.slug);
    if (!h) throw notFound();
    return h;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Holiday Type | Luxe on Air" }] };
    return {
      meta: [
        { title: `${loaderData.name} Holidays from the UK | Tailor-Made | Luxe on Air` },
        { name: "description", content: `${loaderData.tagline}. Handcrafted ${loaderData.name.toLowerCase()} holidays departing the UK — ATOL protected, one dedicated consultant from first quote to return gate.` },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: `${loaderData.name} Holidays from the UK | Luxe on Air` },
        { property: "og:description", content: `${loaderData.tagline}. Tailor-made, ATOL protected, departing UK airports.` },
        { property: "og:image", content: loaderData.heroImage },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `https://www.luxeonair.com/holiday-types/${params.slug}` },
        { name: "twitter:title", content: `${loaderData.name} Holidays | Luxe on Air` },
        { name: "twitter:description", content: `${loaderData.tagline}. Tailor-made from the UK, ATOL protected.` },
        { name: "twitter:image", content: loaderData.heroImage },
      ],
      links: [{ rel: "canonical", href: `https://www.luxeonair.com/holiday-types/${params.slug}` }],
    };
  },
  component: HolidayTypePage,
  notFoundComponent: () => (
    <div className="container-page py-20">
      <h1 className="font-display text-3xl">Not found</h1>
      <Link to="/holiday-types" className="mt-4 inline-flex text-primary">Back to holiday types</Link>
    </div>
  ),
});

function HolidayTypePage() {
  const h = Route.useLoaderData();
  const matches = destinations.filter((d) => h.destinationSlugs.includes(d.slug));
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${h.heroImage})` }} />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-navy/70 via-navy/55 to-navy/85" />
        <div className="container-page py-20 text-navy-fg md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-navy-fg/70">Holiday type</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-6xl text-balance">{h.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-fg/90">{h.tagline}</p>
          <Button asChild size="lg" className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/quote" search={{ tripType: h.name }}>Start a {h.name.toLowerCase()} quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold">What's included</h2>
            <p className="mt-4 text-muted-foreground">{h.summary}</p>
          </div>
          <ul className="space-y-3">
            {h.bullets.map((b: string) => (
              <li key={b} className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 text-gold" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {matches.length > 0 && (
        <section className="container-page py-12 md:py-16">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Popular {h.name.toLowerCase()} destinations</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((d) => <DestinationCard key={d.slug} d={d} />)}
          </div>
        </section>
      )}
    </>
  );
}

void holidayTypes;
