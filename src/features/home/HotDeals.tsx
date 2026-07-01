import { Link } from "@tanstack/react-router";
import { ArrowRight, Flame } from "lucide-react";
import { motion } from "framer-motion";

type Deal = {
  id: string;
  title: string;
  destinationSlug: string;
  nights: number;
  fromPrice: number;
  badge: string;
  image: string;
};

const THEMES = [
  { from: "#C4790E", to: "#8B4F08", label: "Christmas Offer" },
  { from: "#1565A8", to: "#0D3F72", label: "Special Offer" },
  { from: "#2C3E6B", to: "#16223D", label: "Christmas Offer" },
] as const;

export function HotDeals({ deals }: { deals: Deal[] }) {
  const top = deals.slice(0, 3);

  if (top.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-12 md:py-20">
      <div className="container-page">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            <Flame className="h-3.5 w-3.5" /> Limited time offers
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hot Deals
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Hand-picked by our consultants. Prices won't last — book before they're gone.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          {top.map((deal, i) => {
            const theme = THEMES[i % THEMES.length];
            const [destination] = deal.title.split(" - ");
            const days = deal.nights + 1;
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
              >
                <a
                  href={deal.destinationSlug ? `/destinations/${deal.destinationSlug}` : "/deals"}
                  className="group relative flex min-h-50 overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
                  }}
                >
                  {/* Background image — right side */}
                  <div className="absolute inset-y-0 right-0 w-3/5 overflow-hidden">
                    <img
                      src={deal.image}
                      alt={destination}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-30 mix-blend-luminosity transition-opacity duration-300 group-hover:opacity-40"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to right, ${theme.from} 0%, transparent 65%)`,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col p-5 md:p-6">
                    {/* Offer label */}
                    <span className="font-serif text-[11px] italic tracking-wide text-white/60">
                      {deal.badge ?? theme.label}
                    </span>

                    {/* Destination name */}
                    <h3
                      className="mt-1.5 font-display text-2xl font-extrabold leading-tight md:text-[1.55rem]"
                      style={{ color: "#C8FF3C" }}
                    >
                      {destination}
                    </h3>

                    {/* Duration pill */}
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-[#C8FF3C] px-3 py-0.5 text-[10px] font-bold text-[#1a1a1a]">
                        {days}Days · {deal.nights} Nights
                      </span>
                    </div>

                    {/* Price block */}
                    <div className="mt-4 w-fit rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-white/55">
                        <span className="h-px w-4 bg-white/30" />
                        Total Price
                        <span className="h-px w-4 bg-white/30" />
                      </div>
                      <p className="font-display text-2xl font-extrabold text-white">
                        £{deal.fromPrice.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-white/55">
                        <span className="h-px w-4 bg-white/30" />
                        Per Person Only
                        <span className="h-px w-4 bg-white/30" />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-white/65 transition-colors group-hover:text-white">
                      Get a quote <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* View all */}
        <div className="mt-8 text-center">
          <Link
            to="/deals"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-all hover:bg-gold hover:text-gold-foreground"
          >
            View all deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
