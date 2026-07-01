import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { destinations, tripTypes } from "@/data/destinations";

const FILTERS = ["All", ...tripTypes] as const;
type Filter = (typeof FILTERS)[number];

export function FeaturedDestinations() {
  const [active, setActive] = useState<Filter>("All");

  const filtered =
    active === "All"
      ? destinations
      : destinations.filter((d) =>
          d.tripType.includes(active as (typeof tripTypes)[number])
        );

  const visible = filtered.slice(0, 4);

  return (
    <section className="py-12 md:py-20">
      <div className="container-page">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Popular Destinations
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Explore top picks with trending destinations our clients love
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                active === f
                  ? "bg-gold text-gold-foreground shadow-sm"
                  : "border border-border bg-background text-foreground hover:border-gold/50 hover:text-gold",
              ].join(" ")}
            >
              {f === "All" ? "All Destinations" : f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {visible.length > 0 ? (
              visible.map((d) => (
                <Link
                  key={d.slug}
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-3xl bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                    <img
                      src={d.heroImage}
                      alt={d.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-sm font-bold text-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
                    {d.country}
                  </p>
                </Link>
              ))
            ) : (
              <p className="col-span-4 py-10 text-center text-sm text-muted-foreground">
                No destinations found for this filter.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          <span className="h-2.5 w-7 rounded-full bg-gold" />
          <span className="h-2.5 w-2.5 rounded-full bg-border transition-colors hover:bg-gold/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-border transition-colors hover:bg-gold/40" />
        </div>
      </div>
    </section>
  );
}
