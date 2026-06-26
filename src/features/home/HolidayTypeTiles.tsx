import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { holidayTypes } from "@/data/holidayTypes";
import { SectionHeader } from "@/components/shared/SectionHeader";

// Masonry-style tile grid linking to each holiday type's detail page.
export function HolidayTypeTiles() {
  return (
    <section className="bg-secondary/30">
      <div className="container-page py-16 md:py-20">
        <SectionHeader
          eyebrow="Holiday types"
          title="Find a holiday that best suits you."
          cta={{ label: "All types", to: "/holiday-types" }}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {holidayTypes.map((h) => (
            <Link
              key={h.slug}
              to="/holiday-types/$slug"
              params={{ slug: h.slug }}
              className="group relative overflow-hidden rounded-2xl shadow-md"
            >
              <div className="aspect-5/3 w-full overflow-hidden">
                <img
                  src={h.heroImage}
                  alt={h.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <div className="font-display text-xl font-semibold">{h.name}</div>
                <div className="mt-0.5 text-xs text-primary-foreground/75">{h.tagline}</div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
