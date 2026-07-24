import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { getDeals } from "@/server/queries";
import { OfferCard } from "@/components/shared/OfferCard";

export const Route = createFileRoute("/deals")({
  loader: async () => {
    try {
      return await getDeals();
    } catch {
      return [];
    }
  },
  head: () => ({
    meta: [
      { title: "Holiday Deals & Exclusive Travel Offers | Luxeonair" },
      { name: "description", content: "Hand-picked flight and holiday deals from UK airports. Limited availability — prices confirmed by a consultant at quote stage. Business class, beach and family deals updated regularly." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Holiday Deals & Exclusive Travel Offers | Luxeonair" },
      { property: "og:description", content: "Curated UK-departing deals — limited availability. Business class, beach and family holidays confirmed by a real consultant." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.co.uk/deals" },
      { name: "twitter:title", content: "Holiday Deals & Exclusive Offers | Luxeonair" },
      { name: "twitter:description", content: "Hand-picked UK-departing deals. Limited availability. Business class, beach and family. Confirmed by a consultant." },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.co.uk/deals" }],
  }),
  component: DealsPage,
});

function DealsPage() {
  const deals = Route.useLoaderData() ?? [];
  return (
    <>
      {/* Dark hero header */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-10 md:py-16">
          <div className="flex items-center gap-2.5">
            <Tag className="h-4 w-4 text-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Exclusive deals
            </p>
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Curated, time-limited, never auto-generated.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            Each offer is held by one of our consultants. Click through and you'll get a
            real-person quote with a rapid response.
          </p>
        </div>
      </section>

      {/* Deals grid */}
      <section className="container-page py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => (
            <OfferCard key={d.id} d={d} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-page pb-16">
        <div className="rounded-2xl bg-secondary/50 border border-border p-8 text-center">
          <h2 className="font-display text-2xl font-semibold">
            Don't see what you're looking for?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us your destination, budget and dates - we'll find you a deal that isn't on any
            aggregator.
          </p>
          <Button asChild className="mt-5 bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/quote">Start a bespoke quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
