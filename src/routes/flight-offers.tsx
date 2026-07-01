import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PlaneTakeoff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFlightOffers } from "@/server/queries";
import { FlightOfferBookingModal } from "@/components/shared/FlightOfferBookingModal";
import { Flag } from "@/components/shared/Flag";
import { findAirport } from "@/data/airports";
import type { FlightOffer } from "@/types/flightOffer";

const TABS = ["Economy", "Business"] as const;

export const Route = createFileRoute("/flight-offers")({
  loader: async () => {
    try {
      return await getFlightOffers();
    } catch {
      return [];
    }
  },
  head: () => ({
    meta: [
      { title: "Flight Offers from the UK | Luxeonair" },
      {
        name: "description",
        content:
          "Indicative business and economy flight fares departing UK airports. Prices confirmed by a consultant at enquiry stage.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Flight Offers from the UK | Luxeonair" },
      {
        property: "og:description",
        content: "Indicative business and economy flight fares departing UK airports.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.luxeonair.co.uk/flight-offers" },
    ],
    links: [{ rel: "canonical", href: "https://www.luxeonair.co.uk/flight-offers" }],
  }),
  component: FlightOffersPage,
});

function FlightOffersPage() {
  const offers = (Route.useLoaderData() ?? []) as FlightOffer[];
  const [tab, setTab] = useState<(typeof TABS)[number]>("Economy");
  const [selected, setSelected] = useState<FlightOffer | null>(null);

  const shown = offers.filter((o) => o.cabinClass === tab);

  return (
    <>
      {/* Dark hero header */}
      <section className="bg-navy text-navy-fg">
        <div className="container-page py-10 md:py-16">
          <div className="flex items-center gap-2.5">
            <PlaneTakeoff className="h-4 w-4 text-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Flight offers
            </p>
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-navy-fg sm:text-5xl text-balance">
            Business and economy fares from the UK.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-navy-fg/60 leading-relaxed">
            Indicative fares held by our consultants — every enquiry gets live availability and a
            confirmed price within 4 working hours.
          </p>
        </div>
      </section>

      {/* Cabin toggle */}
      <section className="container-page pt-10">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-7 py-2.5 text-sm font-bold transition-colors",
                  tab === t
                    ? "bg-navy text-navy-fg shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Offers grid */}
      <section className="container-page py-10 md:py-14">
        {shown.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            More {tab.toLowerCase()} offers coming soon — enquire and we'll build a bespoke fare.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((offer) => {
              const fromA = findAirport(offer.fromCode);
              const toA = findAirport(offer.toCode);
              return (
                <article
                  key={offer.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted sm:aspect-16/10">
                    <img
                      src={offer.image}
                      alt={`${fromA?.cityName ?? offer.fromCode} to ${toA?.cityName ?? offer.toCode}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground shadow">
                      {offer.cabinClass}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-lg font-bold text-foreground">
                          {fromA?.cityName ?? offer.fromCode}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {fromA && <Flag code={fromA.countryCode} size={12} />}
                          {offer.fromCode}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-gold" />
                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-foreground">
                          {toA?.cityName ?? offer.toCode}
                        </p>
                        <p className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                          {offer.toCode}
                          {toA && <Flag code={toA.countryCode} size={12} />}
                        </p>
                      </div>
                    </div>

                    <div className="my-4 border-t border-border" />

                    <div className="flex flex-1 items-end justify-between gap-3">
                      <div className="flex h-9 w-16 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
                        {offer.airlineLogo ? (
                          <img
                            src={offer.airlineLogo}
                            alt={offer.airlineName}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">per person</div>
                        <div className="font-display text-2xl font-semibold text-teal">
                          £{offer.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelected(offer)}
                      className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground transition-all hover:bg-gold/90"
                    >
                      Book Now <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <FlightOfferBookingModal
        offer={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  );
}
