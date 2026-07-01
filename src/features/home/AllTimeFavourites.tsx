import { Link } from "@tanstack/react-router";
import { MapPin, ArrowUpRight, Sparkles, ClipboardList, Info } from "lucide-react";
import { motion } from "framer-motion";
import { deals } from "@/data/deals";

const BADGE_COLORS: Record<string, string> = {
  Honeymoon: "bg-pink-500 text-white",
  Family: "bg-blue-500 text-white",
  Corporate: "bg-slate-600 text-white",
  Couples: "bg-rose-500 text-white",
  "City break": "bg-violet-500 text-white",
  "Tailor-made": "bg-teal text-white",
};

export function AllTimeFavourites() {
  // Show a different set of deals than HotDeals (which uses slice 0–3)
  const featured = deals.slice(3, 6);

  return (
    <section className="bg-secondary/30 py-12 md:py-20">
      <div className="container-page">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All Time Favourites
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground">
            A curated list of the most popular travel packages based on different destinations
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {featured.map((deal, i) => {
            const badgeClass = BADGE_COLORS[deal.badge ?? ""] ?? "bg-gold text-gold-foreground";
            const days = deal.nights + 1;
            return (
              <motion.article
                key={deal.id}
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
                      src={deal.image}
                      alt={deal.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {deal.badge && (
                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-md ${badgeClass}`}
                    >
                      {deal.badge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-foreground">
                    {deal.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
                    <span className="font-medium">{deal.region}</span>
                    <span className="text-border">↔</span>
                    <span>
                      {days} Days / {deal.nights} Nights
                    </span>
                  </div>

                  {/* CTA row */}
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      to="/quote"
                      search={{ destination: deal.title }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-gold-foreground transition-all hover:bg-gold/90"
                    >
                      Book Now <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">per person</p>
                      <p className="font-display text-lg font-bold text-foreground">
                        £{deal.fromPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="my-4 border-t border-border" />

                  {/* Info tags */}
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-gold" />
                      Experience
                      <Info className="h-3 w-3 opacity-40" />
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ClipboardList className="h-3.5 w-3.5 text-teal" />
                      Inclusion
                      <Info className="h-3 w-3 opacity-40" />
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* View all */}
        <div className="mt-8 text-center">
          <Link
            to="/deals"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-all hover:bg-gold hover:text-gold-foreground"
          >
            View all favourites <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
