import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { getDeals } from "@/server/queries";

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
            real-person quote within 4 working hours.
          </p>
        </div>
      </section>

      {/* Deals grid */}
      <section className="container-page py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => (
            <article
              key={d.id}
              className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted sm:aspect-16/10">
                <img
                  src={d.image}
                  alt={d.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {d.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground shadow">
                    {d.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <span className="rounded bg-black/40 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {d.region}
                  </span>
                  <span className="rounded bg-black/40 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {d.nights} nights
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {d.board}
                </p>
                <h2 className="mt-1 line-clamp-2 font-display text-xl font-semibold leading-snug">{d.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {d.blurb}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">From, per person</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-semibold text-teal">
                        £{d.fromPrice.toLocaleString()}
                      </span>
                      {d.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          £{d.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    asChild
                    className="shrink-0 bg-gold text-gold-foreground hover:bg-gold/90"
                  >
                    <Link to="/quote" search={{ destination: d.title }}>
                      Get a quote <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 shrink-0" />
                  Expires{" "}
                  {d.expires ? new Date(d.expires).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }) : ""}
                </p>
              </div>
            </article>
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
