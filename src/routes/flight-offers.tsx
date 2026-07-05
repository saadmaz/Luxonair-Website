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
            confirmed price with a rapid response.
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((offer) => {
              const fromA = findAirport(offer.fromCode);
              const toA = findAirport(offer.toCode);
              return (
                <article
                  key={offer.id}
                  className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-navy/3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-3/2 w-full overflow-hidden bg-muted">
                    <img
                      src={offer.image}
                      alt={`${fromA?.cityName ?? offer.fromCode} to ${toA?.cityName ?? offer.toCode}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy/55 via-navy/0 to-navy/10" />
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-fg ring-1 ring-white/15 backdrop-blur-md">
                      {offer.cabinClass}
                    </span>
                    <div className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-card/95 shadow-md ring-1 ring-white/40 backdrop-blur-sm">
                      {offer.airlineLogo ? (
                        <img
                          src={offer.airlineLogo}
                          alt={offer.airlineName}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <PlaneTakeoff className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-sm font-bold text-foreground">
                          {fromA?.cityName ?? offer.fromCode}
                        </p>
                        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          {fromA && <Flag code={fromA.countryCode} size={11} />}
                          {offer.fromCode}
                        </p>
                      </div>
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10">
                        <ArrowRight className="h-3 w-3 text-gold" />
                      </div>
                      <div className="text-right">
                        <p className="font-display text-sm font-bold text-foreground">
                          {toA?.cityName ?? offer.toCode}
                        </p>
                        <p className="flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
                          {offer.toCode}
                          {toA && <Flag code={toA.countryCode} size={11} />}
                        </p>
                      </div>
                    </div>

                    <div className="relative -mx-4 my-2.5">
                      <div className="border-t border-dashed border-border" />
                      <span className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
                      <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-background" />
                    </div>

                    <div className="flex flex-1 items-end justify-between gap-3">
                      <p className="truncate pr-2 text-[11px] font-medium text-muted-foreground">
                        {offer.airlineName}
                      </p>
                      <div className="shrink-0 text-right leading-tight">
                        <div className="text-[10px] text-muted-foreground">Starting from</div>
                        <div className="font-display text-lg font-bold text-foreground">
                          £{offer.price.toLocaleString()}
                          <span className="text-xs font-medium text-muted-foreground">/PP</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelected(offer)}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-linear-to-b from-gold to-gold/90 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gold-foreground shadow-sm transition-all hover:shadow-md active:scale-98"
                    >
                      Book Now
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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
