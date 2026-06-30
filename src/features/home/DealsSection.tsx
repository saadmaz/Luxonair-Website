import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { deals } from "@/data/deals";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function DealsSection() {
  const top = deals.slice(0, 3);

  return (
    <section className="container-page py-10 md:py-20">
      <SectionHeader
        eyebrow="Limited deals"
        title="Held by a consultant, not an algorithm."
        cta={{ label: "All deals", to: "/deals" }}
      />
      <motion.div
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {top.map((d) => (
          <motion.article
            key={d.id}
            variants={card}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
          >
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
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {d.region} · {d.nights} nights
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{d.title}</h3>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">From, per person</span>
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
                <Button asChild size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Link to="/quote" search={{ destination: d.title }}>Quote</Link>
                </Button>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
