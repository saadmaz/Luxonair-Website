import { createFileRoute, Link } from "@tanstack/react-router";
import { deals } from "@/lib/deals";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Tag } from "lucide-react";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Travel Deals & Offers — Luxonair" },
      {
        name: "description",
        content:
          "Limited-availability holiday and flight deals from the UK. Indicative pricing — confirmed at quote stage.",
      },
      { property: "og:title", content: "Travel Deals & Offers — Luxonair" },
      {
        property: "og:description",
        content: "Hand-picked, limited-availability deals from UK departure airports.",
      },
      { property: "og:url", content: "/deals" },
    ],
    links: [{ rel: "canonical", href: "/deals" }],
  }),
  component: DealsPage,
});

function DealsPage() {
  return (
    <>
      {/* Dark hero header */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-16 md:py-20">
          <div className="flex items-center gap-2.5">
            <Tag className="h-4 w-4 text-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Exclusive deals
            </p>
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-navy-fg sm:text-5xl text-balance">
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
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-16/10 w-full overflow-hidden">
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
                <h2 className="mt-1 font-display text-xl font-semibold leading-snug">{d.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {d.blurb}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">From, per person</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-semibold">
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
                  {new Date(d.expires).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
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
            Tell us your destination, budget and dates — we'll find you a deal that isn't on any
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
