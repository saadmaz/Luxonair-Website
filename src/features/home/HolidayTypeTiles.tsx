import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { holidayTypes } from "@/data/holidayTypes";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";

export function HolidayTypeTiles() {
  return (
    <section className="bg-secondary/30">
      <div className="container-page py-10 md:py-16">
        <SectionHeader
          eyebrow="Holiday types"
          title="Find a holiday that suits you perfectly."
          cta={{ label: "All types", to: "/holiday" }}
        />
        <motion.div
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {holidayTypes.map((h) => (
            <motion.div
              key={h.slug}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
            >
              <Link
                to="/holiday/$slug"
                params={{ slug: h.slug }}
                className="group relative block overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                {/* Image */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-navy/30">
                  <img
                    src={h.heroImage}
                    alt={h.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />

                {/* Bottom content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="font-display text-xl font-semibold text-white">{h.name}</div>
                  <div className="mt-0.5 line-clamp-1 text-xs text-white/70">{h.tagline}</div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold transition-all duration-200 group-hover:gap-2">
                    Explore <ArrowRight className="h-3 w-3" />
                  </span>
                </div>

                {/* Destination count badge */}
                {(h.destinationSlugs?.length ?? 0) > 0 && (
                  <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                    {h.destinationSlugs.length} destination
                    {h.destinationSlugs.length !== 1 ? "s" : ""}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
