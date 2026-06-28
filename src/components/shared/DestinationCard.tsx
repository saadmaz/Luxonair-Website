// Destination card: image thumbnail → region / budget chips → name + tagline → price.
// Used in FeaturedDestinations (home), /destinations index, and holiday-type detail pages.
import { Link } from "@tanstack/react-router";
import type { Destination } from "@/types/destination";

export function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link
      to="/destinations/$slug"
      params={{ slug: d.slug }}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="aspect-video overflow-hidden bg-muted sm:aspect-4/3">
        <img
          src={d.heroImage}
          alt={`${d.name} - ${d.country}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span>{d.region}</span>
          <span>{d.budgetBand}</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold leading-tight">{d.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.tagline}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{d.durationNights} nights</span>
          <span className="font-semibold text-teal">
            From £{d.fromPrice.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">pp</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
