import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, PlaneTakeoff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FlightOfferBookingModal } from "@/components/shared/FlightOfferBookingModal";
import type { FlightOffer } from "@/types/flightOffer";

const TABS = ["Economy", "Business"] as const;

export function FlightOffers({ offers }: { offers: FlightOffer[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Economy");
  const [selected, setSelected] = useState<FlightOffer | null>(null);

  const shown = offers.filter((o) => o.cabinClass === tab).slice(0, 3);

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container-page">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Flight Offers from the UK
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground">
            Indicative business and economy fares departing the UK, confirmed by a consultant at
            enquiry stage.
          </p>
        </div>

        {/* Cabin toggle */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-6 py-2 text-sm font-bold transition-colors",
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

        {/* Cards */}
        {shown.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            More {tab.toLowerCase()} offers coming soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3">
            {shown.map((offer, i) => (
              <motion.article
                key={offer.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={offer.image}
                      alt={`${offer.fromCity} to ${offer.toCity}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-navy/90 px-3 py-1 text-xs font-bold text-navy-fg shadow-md">
                    {offer.cabinClass}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-display text-base font-bold text-foreground">
                        {offer.fromCity}
                      </p>
                      <p className="text-xs text-muted-foreground">{offer.fromCountry}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gold" />
                    <div className="text-right">
                      <p className="font-display text-base font-bold text-foreground">
                        {offer.toCity}
                      </p>
                      <p className="text-xs text-muted-foreground">{offer.toCountry}</p>
                    </div>
                  </div>

                  <div className="my-4 border-t border-border" />

                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-14 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
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
                      <p className="text-[10px] text-muted-foreground">per person</p>
                      <p className="font-display text-lg font-bold text-foreground">
                        £{offer.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelected(offer)}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 text-xs font-bold text-gold-foreground transition-all hover:bg-gold/90"
                  >
                    Book Now <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* View all */}
        <div className="mt-8 text-center">
          <Link
            to="/flight-offers"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-all hover:bg-gold hover:text-gold-foreground"
          >
            View all flight offers <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <FlightOfferBookingModal
        offer={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </section>
  );
}
